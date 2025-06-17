import { Injectable } from '@nestjs/common';
import { Response } from 'express';

export interface SSEEvent {
  id?: number;
  type: string;
  data: any;
  timestamp: string;
  message?: string;
  events?: SSEEvent[]; // For history events
}

export interface PayrollSignedData {
  ma_nv: string;
  ho_ten: string;
  ngay_ky: Date;
  ten_da_ky: string;
}

export interface SSEConnection {
  response: Response;
  userId: string;
  connectedAt: Date;
}

@Injectable()
export class SseService {
  private connections = new Map<string, SSEConnection>();
  private eventHistory: SSEEvent[] = [];
  private maxHistorySize = 50;
  private maxConnections = 5;
  private throttleMap = new Map<string, number>();
  private throttleInterval = 1000; // 1 second
  private heartbeatInterval = 30000; // 30 seconds

  constructor() {
    console.log('🔧 SSE Service initialized for NestJS');
    this.startHeartbeat();
  }

  /**
   * Start heartbeat to keep connections alive
   */
  private startHeartbeat() {
    setInterval(() => {
      this.sendHeartbeat();
      this.cleanupDeadConnections();
    }, this.heartbeatInterval);
  }

  /**
   * Send heartbeat to all connections
   */
  private sendHeartbeat() {
    const heartbeat: SSEEvent = {
      type: 'heartbeat',
      data: {},
      timestamp: new Date().toISOString(),
    };

    this.connections.forEach((connection, userId) => {
      this.sendToConnection(userId, heartbeat);
    });
  }

  /**
   * Clean up dead connections
   */
  private cleanupDeadConnections() {
    const deadConnections: string[] = [];

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
   */
  private shouldThrottle(eventType: string): boolean {
    const now = Date.now();
    const lastSent = this.throttleMap.get(eventType) || 0;

    if (now - lastSent < this.throttleInterval) {
      return true;
    }

    this.throttleMap.set(eventType, now);
    return false;
  }

  /**
   * Add new SSE connection (Express.js style)
   */
  addConnection(userId: string, res: Response): Response | null {
    // Check connection limit
    if (this.connections.size >= this.maxConnections) {
      console.log(`⚠️ SSE: Connection limit reached (${this.maxConnections})`);
      res.status(429).json({
        error: 'Too Many Connections',
        message: `Maximum ${this.maxConnections} concurrent SSE connections allowed`,
      });
      return null;
    }

    console.log(
      `📡 SSE: Admin ${userId} connected (${this.connections.size + 1}/${this.maxConnections})`,
    );

    // Setup SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // Store connection
    this.connections.set(userId, {
      response: res,
      userId,
      connectedAt: new Date(),
    });

    // Send connection confirmation
    this.sendToConnection(userId, {
      type: 'connection',
      message: 'SSE connection established with NestJS',
      data: {},
      timestamp: new Date().toISOString(),
    });

    // Send recent event history
    this.sendEventHistory(userId);

    // Handle connection close
    res.on('close', () => {
      console.log(`📡 SSE: Admin ${userId} disconnected from NestJS`);
      this.connections.delete(userId);
    });

    return res;
  }

  /**
   * Send event to specific connection
   */
  private sendToConnection(userId: string, event: SSEEvent) {
    const connection = this.connections.get(userId);
    if (!connection) {
      console.warn(`⚠️ SSE: Connection not found for ${userId}`);
      return;
    }

    try {
      const eventData = `data: ${JSON.stringify(event)}\n\n`;
      connection.response.write(eventData);
    } catch (error) {
      console.error(`❌ SSE: Failed to send to ${userId}:`, error.message);
      this.connections.delete(userId);
    }
  }

  /**
   * Send event history to new connection
   */
  private sendEventHistory(userId: string) {
    if (this.eventHistory.length > 0) {
      console.log(
        `📚 SSE: Sending ${this.eventHistory.length} recent events to ${userId}`,
      );
      this.sendToConnection(userId, {
        type: 'history',
        events: this.eventHistory.slice(-10), // Send last 10 events
        message: `Sent ${Math.min(this.eventHistory.length, 10)} recent events`,
        data: {},
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Broadcast event to all connected admins
   */
  broadcast(eventData: Partial<SSEEvent>) {
    // Check throttling
    if (eventData.type && this.shouldThrottle(eventData.type)) {
      console.log(`🚫 SSE: Event ${eventData.type} throttled`);
      return;
    }

    const event: SSEEvent = {
      ...eventData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    } as SSEEvent;

    // Add to history
    this.addToHistory(event);

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
      `📡 SSE: Event '${event.type}' sent to ${successCount} admin(s)`,
    );
  }

  /**
   * Add event to history
   */
  private addToHistory(event: SSEEvent) {
    this.eventHistory.push(event);

    // Keep only recent events
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Send payroll signed event
   */
  broadcastPayrollSigned(employeeData: PayrollSignedData) {
    this.broadcast({
      type: 'payroll_signed',
      data: employeeData,
      message: `${employeeData.ho_ten} (${employeeData.ma_nv}) đã ký nhận lương`,
    });
  }

  /**
   * Send test event
   */
  sendTestEvent(message: string = 'Test event from NestJS') {
    this.broadcast({
      type: 'test',
      data: { message },
      message: message,
    });
  }

  /**
   * Get connection stats
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
    };
  }

  /**
   * Get event history (simplified - no DB for now)
   */
  async getEventHistory(limit = 50): Promise<SSEEvent[]> {
    return this.eventHistory.slice(0, limit);
  }
}
