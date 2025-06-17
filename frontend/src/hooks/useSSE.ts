import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export interface SSEEvent {
  id?: number;
  type: string;
  data?: any;
  message?: string;
  timestamp: string;
}

export interface SSEOptions {
  autoConnect?: boolean;
  showNotifications?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface SSEState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  events: SSEEvent[];
  connectionAttempts: number;
}

const DEFAULT_OPTIONS: Required<SSEOptions> = {
  autoConnect: true,
  showNotifications: true,
  reconnectInterval: 5000, // Increased from 3s to 5s
  maxReconnectAttempts: 3, // Reduced from 5 to 3
};

export const useSSE = (options: SSEOptions = {}) => {
  const { user, token } = useAuthStore();
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<SSEState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    events: [],
    connectionAttempts: 0,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyDisconnected = useRef(false);

  // Clear reconnect timeout
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Add event to state
  const addEvent = useCallback((event: SSEEvent) => {
    setState((prev) => ({
      ...prev,
      events: [event, ...prev.events].slice(0, 100), // Keep last 100 events
    }));
  }, []);

  // Handle SSE events
  const handleSSEEvent = useCallback(
    (event: MessageEvent) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);

        // Skip heartbeat events from UI
        if (data.type === "heartbeat") {
          return;
        }

        console.log("📡 SSE Event received:", data);

        addEvent(data);

        // Show notifications for specific event types
        if (opts.showNotifications && data.type === "payroll_signed") {
          toast.success(data.message || "Có nhân viên vừa ký nhận lương", {
            duration: 5000,
            icon: "✍️",
          });
        }
      } catch (error) {
        console.error("❌ Error parsing SSE event:", error);
      }
    },
    [addEvent, opts.showNotifications]
  );

  // Connect to SSE
  const connect = useCallback(() => {
    // Only admin can connect to SSE
    if (user?.role !== "admin" || !token) {
      console.log("🚫 SSE: Only admin can connect");
      return;
    }

    // Don't connect if already connected or connecting
    if (state.isConnected || state.isConnecting) {
      console.log("🔄 SSE: Already connected or connecting");
      return;
    }

    console.log("📡 SSE: Attempting to connect...");

    setState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
      connectionAttempts: prev.connectionAttempts + 1,
    }));

    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";
      // EventSource doesn't support custom headers, so we use query parameter
      const sseUrl = `${apiBaseUrl}/sse/connect?token=${encodeURIComponent(token)}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        console.log("✅ SSE: Connected successfully");
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          connectionAttempts: 0,
        }));
        clearReconnectTimeout();
        isManuallyDisconnected.current = false;
      };

      eventSource.onmessage = handleSSEEvent;

      eventSource.onerror = (error) => {
        console.error("❌ SSE: Connection error:", error);

        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: "Connection failed",
        }));

        // Auto-reconnect if not manually disconnected
        if (
          !isManuallyDisconnected.current &&
          state.connectionAttempts < opts.maxReconnectAttempts
        ) {
          console.log(`🔄 SSE: Reconnecting in ${opts.reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, opts.reconnectInterval);
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error("❌ SSE: Failed to create connection:", error);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to create connection",
      }));
    }
  }, [
    user?.role,
    token,
    state.isConnected,
    state.isConnecting,
    state.connectionAttempts,
    opts.maxReconnectAttempts,
    opts.reconnectInterval,
    handleSSEEvent,
    clearReconnectTimeout,
  ]);

  // Disconnect from SSE
  const disconnect = useCallback(() => {
    console.log("📡 SSE: Disconnecting...");
    isManuallyDisconnected.current = true;
    clearReconnectTimeout();

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      error: null,
    }));
  }, [clearReconnectTimeout]);

  // Toggle notifications
  const toggleNotifications = useCallback(() => {
    opts.showNotifications = !opts.showNotifications;
    toast.success(
      opts.showNotifications
        ? "Đã bật thông báo real-time"
        : "Đã tắt thông báo real-time",
      { icon: opts.showNotifications ? "🔔" : "🔕" }
    );
  }, [opts]);

  // Clear events
  const clearEvents = useCallback(() => {
    setState((prev) => ({ ...prev, events: [] }));
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (opts.autoConnect && user?.role === "admin" && token) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [opts.autoConnect, user?.role, token]); // Don't include connect/disconnect to avoid infinite loops

  return {
    ...state,
    connect,
    disconnect,
    toggleNotifications,
    clearEvents,
    isAdmin: user?.role === "admin",
    notificationsEnabled: opts.showNotifications,
  };
};
