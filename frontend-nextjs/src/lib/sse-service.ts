interface SSEEvent {
  type: string;
  data?: any;
  message?: string;
  timestamp: string;
  id?: number;
}

type SSECallback = (event: SSEEvent) => void;

class SSEService {
  private eventSource: EventSource | null = null;
  private callbacks: Map<string, SSECallback[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3; // Giảm từ 5 xuống 3
  private reconnectDelay = 5000; // Tăng từ 3s lên 5s
  private token: string | null = null;
  private isConnected = false;

  constructor() {
    // Auto-connect handled by useSSE hook
    console.log("🔧 SSE Service initialized");
  }

  /**
   * Auto-connect if user is admin and has token
   */
  private autoConnect() {
    try {
      // Get auth data from localStorage (same as auth store)
      const authData = localStorage.getItem("auth-store");
      if (authData) {
        const parsed = JSON.parse(authData);
        const user = parsed.state?.user;
        const token = parsed.state?.token;

        if (user?.role === "admin" && token) {
          console.log("🔄 SSE: Auto-connecting for admin user");
          this.connect(token);
        }
      }
    } catch (error) {
      console.error("❌ SSE: Auto-connect failed:", error);
    }
  }

  /**
   * Connect to SSE endpoint
   */
  connect(token: string) {
    if (this.eventSource) {
      console.log("⚠️ SSE: Already connected");
      return;
    }

    this.token = token;
    // Use NestJS backend (new stable implementation)
    const nestjsUrl = `http://localhost:4002/api/sse/connect-public`;
    const expressUrl = `http://localhost:4001/api/sse/connect?token=${encodeURIComponent(token)}`;

    console.log(
      "📡 SSE: Connecting to NestJS backend (new stable)...",
      nestjsUrl
    );

    try {
      // Connect to NestJS backend
      this.eventSource = new EventSource(nestjsUrl);

      this.setupEventHandlers();

      this.eventSource.onopen = () => {
        console.log("✅ SSE: Connected successfully to NestJS");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit("connection", { message: "SSE Connected to NestJS" });
      };

      // Add timeout to detect if backend is not available
      setTimeout(() => {
        if (
          this.eventSource &&
          this.eventSource.readyState === EventSource.CONNECTING
        ) {
          console.warn(
            "⚠️ SSE: Connection timeout - backend may not be available"
          );
          this.disconnect();
          this.emit("error", {
            message: "Backend không khả dụng. SSE sẽ không hoạt động.",
          });
        }
      }, 5000);
    } catch (error) {
      console.error("❌ SSE: Failed to create EventSource:", error);
      this.handleError();
    }
  }

  /**
   * Setup event handlers for EventSource
   */
  private setupEventHandlers() {
    if (!this.eventSource) return;

    this.eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        console.log("📨 SSE: Received event:", data);
        this.handleEvent(data);
      } catch (error) {
        console.error("❌ SSE: Error parsing event data:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.warn("⚠️ SSE: Connection error (backend may be offline):", error);
      this.isConnected = false;
      // Only handle error if we haven't exceeded max attempts
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.handleError();
      } else {
        console.log(
          "ℹ️ SSE: Max reconnect attempts reached, stopping reconnection"
        );
      }
    };
  }

  /**
   * Disconnect from SSE
   */
  disconnect() {
    if (this.eventSource) {
      console.log("📡 SSE: Disconnecting...");
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
      this.emit("disconnection", { message: "SSE Disconnected" });
    }
  }

  /**
   * Handle SSE errors and reconnection
   */
  private handleError() {
    this.disconnect();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 SSE: Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        if (this.token) {
          this.connect(this.token);
        }
      }, this.reconnectDelay);

      // Exponential backoff
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 30000);
    } else {
      console.error("❌ SSE: Max reconnection attempts reached");
      this.emit("error", {
        message: "SSE Connection Failed - Max retries exceeded",
      });
    }
  }

  /**
   * Handle incoming SSE events
   */
  private handleEvent(event: SSEEvent) {
    // Execute callbacks for this event type
    const callbacks = this.callbacks.get(event.type) || [];
    callbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error(`❌ SSE: Error in callback for ${event.type}:`, error);
      }
    });

    // Also execute 'all' callbacks
    const allCallbacks = this.callbacks.get("all") || [];
    allCallbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("❌ SSE: Error in general callback:", error);
      }
    });
  }

  /**
   * Subscribe to specific event type
   */
  on(eventType: string, callback: SSECallback) {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
    }
    this.callbacks.get(eventType)!.push(callback);

    console.log(`🎯 SSE: Subscribed to '${eventType}' events`);
  }

  /**
   * Unsubscribe from event type
   */
  off(eventType: string, callback?: SSECallback) {
    if (callback) {
      const callbacks = this.callbacks.get(eventType) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.callbacks.delete(eventType);
    }

    console.log(`🚫 SSE: Unsubscribed from '${eventType}' events`);
  }

  /**
   * Emit internal events
   */
  private emit(eventType: string, data: any) {
    const event: SSEEvent = {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    };
    this.handleEvent(event);
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      hasToken: !!this.token,
      eventSource: !!this.eventSource,
    };
  }

  /**
   * Send test event (for debugging)
   */
  async sendTestEvent(message: string = "Frontend test") {
    if (!this.token) {
      console.error("❌ SSE: No token available for test");
      return;
    }

    try {
      const response = await fetch("http://localhost:4002/api/sse/test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        console.log("✅ SSE: Test event sent to NestJS");
      } else {
        console.error("❌ SSE: Failed to send test event to NestJS");
      }
    } catch (error) {
      console.error("❌ SSE: Error sending test event to NestJS:", error);
    }
  }
}

// Create singleton instance
const sseService = new SSEService();

export default sseService;
export type { SSEEvent, SSECallback };
