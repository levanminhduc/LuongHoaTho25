"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/auth-store";
import sseService, { SSEEvent, SSECallback } from "@/lib/sse-service";

interface UseSSEOptions {
  autoConnect?: boolean;
  eventTypes?: string[];
}

interface SSEStatus {
  connected: boolean;
  reconnectAttempts: number;
  hasToken: boolean;
  eventSource: boolean;
}

export function useSSE(options: UseSSEOptions = {}) {
  const { user, token } = useAuthStore();
  const [status, setStatus] = useState<SSEStatus>({
    connected: false,
    reconnectAttempts: 0,
    hasToken: false,
    eventSource: false,
  });
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null);

  // Update status periodically
  useEffect(() => {
    const updateStatus = () => {
      setStatus(sseService.getStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-connect disabled by default to prevent errors when backend is not available
  // Users can manually connect via the "Kết nối" button
  useEffect(() => {
    if (
      options.autoConnect === true && // Explicitly enable auto-connect
      user?.role === "admin" &&
      token &&
      !status.connected
    ) {
      console.log("🔄 useSSE: Auto-connecting SSE for admin");
      sseService.connect(token);
    }
  }, [user, token, options.autoConnect, status.connected]);

  // Event handler callbacks (stable references)
  const handleEvent = useCallback((event: SSEEvent) => {
    setLastEvent(event);
    setEvents((prev) => [...prev.slice(-49), event]); // Keep last 50 events
  }, []);

  // Subscribe to events
  const subscribe = useCallback((eventType: string, callback: SSECallback) => {
    sseService.on(eventType, callback);
    return () => sseService.off(eventType, callback);
  }, []);

  // Subscribe to specific event types from options
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Create stable event types array
    const eventTypes = options.eventTypes || [];
    const eventTypesKey = eventTypes.join(',');

    if (eventTypes.length > 0) {
      eventTypes.forEach((eventType) => {
        const unsubscribe = subscribe(eventType, handleEvent);
        unsubscribers.push(unsubscribe);
      });
    }

    // Always subscribe to all events for general tracking
    const unsubscribeAll = subscribe("all", handleEvent);
    unsubscribers.push(unsubscribeAll);

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [options.eventTypes?.join(',') || '']); // ✅ FIX: Use join to create stable dependency

  // Manual connect/disconnect
  const connect = useCallback(() => {
    if (token) {
      sseService.connect(token);
    } else {
      console.error("❌ useSSE: No token available for connection");
    }
  }, [token]);

  const disconnect = useCallback(() => {
    sseService.disconnect();
  }, []);

  // Send test event
  const sendTestEvent = useCallback((message?: string) => {
    return sseService.sendTestEvent(message);
  }, []);

  // Clear events history
  const clearEvents = useCallback(() => {
    setEvents([]);
    setLastEvent(null);
  }, []);

  return {
    // Status
    status,
    connected: status.connected,

    // Events
    events,
    lastEvent,

    // Actions
    connect,
    disconnect,
    subscribe,
    sendTestEvent,
    clearEvents,

    // Service instance for advanced usage
    service: sseService,
  };
}
