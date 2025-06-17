const { pool } = require("../config/database");

class SSEService {
  constructor() {
    this.connections = new Map(); // Store active SSE connections
    this.eventHistory = []; // Store recent events for new connections
    this.maxHistorySize = 50; // Reduced from 100 to 50
    this.maxConnections = 5; // Limit concurrent connections
    this.throttleMap = new Map(); // For event throttling
    this.throttleInterval = 1000; // 1 second throttle
    this.heartbeatInterval = 30000; // 30 seconds heartbeat
    this.startHeartbeat();
  }

  /**
   * Start heartbeat to keep connections alive and clean dead ones
   */
  startHeartbeat() {
    setInterval(() => {
      this.sendHeartbeat();
      this.cleanupDeadConnections();
    }, this.heartbeatInterval);
  }

  /**
   * Send heartbeat to all connections
   */
  sendHeartbeat() {
    const heartbeat = {
      type: "heartbeat",
      timestamp: new Date().toISOString(),
    };

    this.connections.forEach((connection, userId) => {
      this.sendToConnection(userId, heartbeat);
    });
  }

  /**
   * Clean up dead connections
   */
  cleanupDeadConnections() {
    const deadConnections = [];

    this.connections.forEach((connection, userId) => {
      if (connection.response.destroyed || connection.response.closed) {
        deadConnections.push(userId);
      }
    });

    deadConnections.forEach((userId) => {
      console.log(`🧹 SSE: Cleaning up dead connection for ${userId}`);
      this.connections.delete(userId);
    });
  }

  /**
   * Check if event should be throttled
   * @param {string} eventType - Type of event
   * @returns {boolean} - True if should throttle
   */
  shouldThrottle(eventType) {
    const now = Date.now();
    const lastSent = this.throttleMap.get(eventType) || 0;

    if (now - lastSent < this.throttleInterval) {
      return true;
    }

    this.throttleMap.set(eventType, now);
    return false;
  }

  /**
   * Add new SSE connection
   * @param {string} userId - User ID (admin)
   * @param {Response} res - Express response object
   */
  addConnection(userId, res) {
    // Check connection limit
    if (this.connections.size >= this.maxConnections) {
      console.log(`⚠️ SSE: Connection limit reached (${this.maxConnections})`);
      res.status(429).json({
        error: "Too Many Connections",
        message: `Maximum ${this.maxConnections} concurrent SSE connections allowed`,
      });
      return null;
    }

    console.log(
      `📡 SSE: Admin ${userId} connected (${this.connections.size + 1}/${this.maxConnections})`
    );

    // Setup SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });

    // Store connection
    this.connections.set(userId, {
      response: res,
      userId,
      connectedAt: new Date(),
    });

    // Send connection confirmation
    this.sendToConnection(userId, {
      type: "connection",
      message: "SSE connection established",
      timestamp: new Date().toISOString(),
    });

    // Send recent event history to new connection
    this.sendEventHistory(userId);

    // Handle connection close
    res.on("close", () => {
      console.log(`📡 SSE: Admin ${userId} disconnected`);
      this.connections.delete(userId);
    });

    return res;
  }

  /**
   * Remove SSE connection
   * @param {string} userId - User ID
   */
  removeConnection(userId) {
    if (this.connections.has(userId)) {
      const connection = this.connections.get(userId);
      connection.response.end();
      this.connections.delete(userId);
      console.log(`📡 SSE: Admin ${userId} connection removed`);
    }
  }

  /**
   * Send event to specific connection
   * @param {string} userId - User ID
   * @param {Object} data - Event data
   */
  sendToConnection(userId, data) {
    const connection = this.connections.get(userId);
    if (connection) {
      try {
        const eventData = `data: ${JSON.stringify(data)}\n\n`;
        connection.response.write(eventData);
      } catch (error) {
        console.error(`❌ SSE: Error sending to ${userId}:`, error.message);
        this.removeConnection(userId);
      }
    }
  }

  /**
   * Broadcast event to all connected admins
   * @param {Object} eventData - Event data
   */
  broadcast(eventData) {
    // Check throttling for this event type
    if (this.shouldThrottle(eventData.type)) {
      console.log(`🚫 SSE: Event ${eventData.type} throttled`);
      return;
    }

    const event = {
      ...eventData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };

    // Add to history (async to not block)
    setImmediate(() => this.addToHistory(event));

    // Send to all connected admins
    let successCount = 0;
    this.connections.forEach((connection, userId) => {
      try {
        this.sendToConnection(userId, event);
        successCount++;
      } catch (error) {
        console.error(`❌ SSE: Failed to send to ${userId}:`, error.message);
      }
    });

    console.log(
      `📡 SSE: Broadcasted ${event.type} to ${successCount}/${this.connections.size} admins`
    );
  }

  /**
   * Add event to history
   * @param {Object} event - Event data
   */
  addToHistory(event) {
    this.eventHistory.push(event);

    // Keep only recent events
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }

    // Save to database for persistence
    this.saveEventToDatabase(event);
  }

  /**
   * Send event history to new connection
   * @param {string} userId - User ID
   */
  sendEventHistory(userId) {
    if (this.eventHistory.length > 0) {
      this.sendToConnection(userId, {
        type: "history",
        events: this.eventHistory.slice(-10), // Send last 10 events
        message: `Sent ${Math.min(this.eventHistory.length, 10)} recent events`,
      });
    }
  }

  /**
   * Save event to database for persistence
   * @param {Object} event - Event data
   */
  async saveEventToDatabase(event) {
    // Skip saving heartbeat events to reduce DB load
    if (event.type === "heartbeat" || event.type === "connection") {
      return;
    }

    try {
      // Use setImmediate to make it truly non-blocking
      setImmediate(async () => {
        await pool.execute(
          `INSERT INTO sse_events (event_type, event_data, created_at)
           VALUES (?, ?, ?)`,
          [event.type, JSON.stringify(event), new Date()]
        );
      });
    } catch (error) {
      console.error("❌ Error saving SSE event to database:", error.message);
    }
  }

  /**
   * Emit payroll signature event
   * @param {Object} signatureData - Signature data
   */
  emitPayrollSigned(signatureData) {
    this.broadcast({
      type: "payroll_signed",
      data: {
        ma_nv: signatureData.ma_nv,
        ho_ten: signatureData.ho_ten,
        ngay_ky: signatureData.ngay_ky,
        ten_da_ky: signatureData.ten_da_ky,
      },
      message: `${signatureData.ho_ten} (${signatureData.ma_nv}) đã ký nhận lương`,
    });
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      activeConnections: this.connections.size,
      maxConnections: this.maxConnections,
      connectedAdmins: Array.from(this.connections.keys()),
      eventHistorySize: this.eventHistory.length,
      maxHistorySize: this.maxHistorySize,
      throttleInterval: this.throttleInterval,
      heartbeatInterval: this.heartbeatInterval,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return {
      connections: this.connections.size,
      throttledEvents: this.throttleMap.size,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    };
  }

  /**
   * Get event history from database
   * @param {number} limit - Number of events to retrieve
   */
  async getEventHistoryFromDB(limit = 50) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM sse_events 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [limit]
      );
      return rows;
    } catch (error) {
      console.error(
        "❌ Error fetching SSE events from database:",
        error.message
      );
      return [];
    }
  }
}

// Create singleton instance
const sseService = new SSEService();

module.exports = sseService;
