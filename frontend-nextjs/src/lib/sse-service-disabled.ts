interface SSEEvent {
  type: string;
  data?: any;
  message?: string;
  timestamp: string;
  id?: number;
}

type SSECallback = (event: SSEEvent) => void;

/**
 * Disabled SSE Service - No backend connection
 * This prevents all SSE errors when backend is not available
 */
class DisabledSSEService {
  private callbacks: Map<string, SSECallback[]> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private token: string | null = null;

  constructor() {
    console.log("ℹ️ SSE: Using disabled SSE service (no backend connection)");
  }

  /**
   * Fake connect - does nothing but emits success
   */
  async connect(token: string) {
    this.token = token;
    console.log("🔄 SSE: Simulating connection (disabled mode)");
    
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      this.emit("connection", { message: "SSE Connected (Demo Mode)" });
    }, 1000);
  }

  /**
   * Fake disconnect
   */
  disconnect() {
    console.log("📡 SSE: Disconnecting (disabled mode)");
    this.isConnected = false;
    this.emit("disconnection", { message: "SSE Disconnected" });
  }

  /**
   * Subscribe to specific event type
   */
  on(eventType: string, callback: SSECallback) {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
    }
    this.callbacks.get(eventType)!.push(callback);
    console.log(`🎯 SSE: Subscribed to '${eventType}' events (disabled mode)`);
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
    console.log(`🚫 SSE: Unsubscribed from '${eventType}' events (disabled mode)`);
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
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      hasToken: !!this.token,
      eventSource: false, // Always false in disabled mode
    };
  }

  /**
   * Send test event (fake)
   */
  async sendTestEvent(message: string = "Frontend test (disabled mode)") {
    console.log("✅ SSE: Sending test event (disabled mode)");
    this.emit("test", { message });
  }
}

// Create singleton instance
const disabledSSEService = new DisabledSSEService();

export default disabledSSEService;
export type { SSEEvent, SSECallback };
