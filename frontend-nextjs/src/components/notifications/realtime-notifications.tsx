"use client";

import { useState, useEffect } from "react";
import { useSSE } from "@/hooks/use-sse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth-store";

interface RealtimeNotificationsProps {
  className?: string;
}

export default function RealtimeNotifications({
  className,
}: RealtimeNotificationsProps) {
  const { user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const {
    connected,
    events,
    lastEvent,
    connect,
    disconnect,
    sendTestEvent,
    clearEvents,
  } = useSSE({
    autoConnect: true, // ✅ Bật auto-connect cho admin
    eventTypes: [
      "payroll_signed",
      "test",
      "connection",
      "disconnection",
      "error",
    ],
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [demoMode, setDemoMode] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter and format notifications
  useEffect(() => {
    if (!isClient) return;

    const recentEvents = events
      .filter((event) =>
        ["payroll_signed", "test", "error"].includes(event.type)
      )
      .slice(-10)
      .reverse(); // Show newest first

    setNotifications(recentEvents);
  }, [events, isClient]);

  // Show notification popup for payroll_signed events
  useEffect(() => {
    if (!isClient || lastEvent?.type !== "payroll_signed") return;

    // Create browser notification if permission granted
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Nhân viên đã ký lương", {
        body: lastEvent.message,
        icon: "/favicon.ico",
        tag: "payroll-signed",
      });
    }

    // Play notification sound (optional)
    if (typeof window !== "undefined") {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {
        // Ignore audio errors (no file or autoplay blocked)
      });
    }
  }, [lastEvent, isClient]);

  // Request notification permission on mount
  useEffect(() => {
    if (!isClient) return;

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [isClient]);

  // Demo mode - simulate events
  useEffect(() => {
    if (!demoMode || !isClient) return;

    const interval = setInterval(() => {
      const demoEvents = [
        {
          type: "payroll_signed",
          message: "Nhân viên NV001 đã ký lương",
          data: { ma_nv: "NV001", ho_ten: "Nguyễn Văn A" },
          timestamp: new Date().toISOString(),
        },
        {
          type: "test",
          message: "Demo test event",
          timestamp: new Date().toISOString(),
        },
      ];

      const randomEvent =
        demoEvents[Math.floor(Math.random() * demoEvents.length)];
      setNotifications((prev) => [randomEvent, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [demoMode, isClient]);

  if (user?.role !== "admin") {
    return null; // Only show for admin
  }

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>🔔 Thông báo Real-time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse">Đang tải...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    if (typeof window === "undefined") return "";
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "payroll_signed":
        return "✅";
      case "test":
        return "🧪";
      case "error":
        return "❌";
      default:
        return "📢";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "payroll_signed":
        return "text-green-600 bg-green-50 border-green-200";
      case "test":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>🔔 Thông báo Real-time</span>
            <div
              className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
            ></div>
          </div>
          <div className="flex items-center space-x-2">
            {!connected && (
              <Button size="sm" variant="outline" onClick={connect}>
                Kết nối
              </Button>
            )}
            {connected && (
              <Button size="sm" variant="outline" onClick={disconnect}>
                Ngắt kết nối
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendTestEvent("Test từ Frontend")}
            >
              Test
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDemoMode(!demoMode)}
              className={demoMode ? "bg-yellow-100 text-yellow-800" : ""}
            >
              {demoMode ? "Demo ON" : "Demo"}
            </Button>
            <Button size="sm" variant="outline" onClick={clearEvents}>
              Xóa
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Connection Status */}
        <div className="mb-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span>Trạng thái kết nối:</span>
            <span
              className={`font-medium ${
                demoMode
                  ? "text-yellow-600"
                  : connected
                    ? "text-green-600"
                    : "text-red-600"
              }`}
            >
              {demoMode
                ? "🟡 Demo Mode"
                : connected
                  ? "🟢 Đã kết nối"
                  : "🔴 Chưa kết nối"}
            </span>
          </div>
          {lastEvent && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Sự kiện gần nhất:</span>
              <span className="text-gray-600">
                {lastEvent.type} - {formatTimestamp(lastEvent.timestamp)}
              </span>
            </div>
          )}
        </div>

        {/* Connection Info */}
        {!demoMode && !connected && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Đang kết nối SSE...</p>
                <p>
                  Nếu backend đang chạy, SSE sẽ tự động kết nối. Nhấn "Demo" để
                  test UI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              {demoMode
                ? "Chờ demo events..."
                : connected
                  ? "Chưa có thông báo nào"
                  : "Đang chờ kết nối SSE..."}
            </p>
          ) : (
            notifications.map((event, index) => (
              <div
                key={`${event.id || event.timestamp}-${index}`}
                className={`p-3 rounded-lg border ${getEventColor(event.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{getEventIcon(event.type)}</span>
                    <div>
                      <p className="font-medium text-sm">
                        {event.message || `${event.type} event`}
                      </p>
                      {event.data && (
                        <div className="text-xs text-gray-600 mt-1">
                          {event.type === "payroll_signed" && (
                            <p>
                              NV: {event.data.ma_nv} - {event.data.ho_ten}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Event Count */}
        {notifications.length > 0 && (
          <div className="mt-4 pt-3 border-t text-center text-sm text-gray-600">
            Hiển thị {notifications.length} thông báo gần nhất
          </div>
        )}
      </CardContent>
    </Card>
  );
}
