import React, { useState, useEffect } from "react";
import { useSSEContext } from "@/contexts/SSEContext";
import SSEStatus from "@/components/SSEStatus";

const SSETestPage: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    error,
    events,
    connect,
    disconnect,
    toggleNotifications,
    clearEvents,
    isAdmin,
    notificationsEnabled,
  } = useSSEContext();

  const [testMessage, setTestMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Send test SSE event
  const sendTestEvent = async () => {
    if (!testMessage.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4001/api/sse/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: testMessage,
        }),
      });

      if (response.ok) {
        setTestMessage("");
        console.log("✅ Test event sent successfully");
      } else {
        console.error("❌ Failed to send test event");
      }
    } catch (error) {
      console.error("❌ Error sending test event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate payroll signing
  const simulatePayrollSigning = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4001/api/payroll/NV001/sign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ho_ten: "Nguyễn Test SSE",
          }),
        }
      );

      if (response.ok) {
        console.log("✅ Payroll signing simulated successfully");
      } else {
        console.error("❌ Failed to simulate payroll signing");
      }
    } catch (error) {
      console.error("❌ Error simulating payroll signing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Only admin users can access SSE test page
          </p>
          <button
            onClick={() => (window.location.href = "/simple-dashboard")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🧪 SSE Test Page
              </h1>
              <p className="text-gray-600">
                Test Server-Sent Events functionality
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <SSEStatus showDetails={true} />
              <button
                onClick={() => (window.location.href = "/simple-dashboard")}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connection Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📡 Connection Status
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isConnected
                        ? "bg-green-100 text-green-800"
                        : isConnecting
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isConnected
                      ? "✅ Connected"
                      : isConnecting
                        ? "🔄 Connecting"
                        : "❌ Disconnected"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notifications:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      notificationsEnabled
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {notificationsEnabled ? "🔔 Enabled" : "🔕 Disabled"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Events Received:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {events.length}
                  </span>
                </div>

                {error && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Error:</span>
                    <span className="text-sm text-red-600">{error}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                {isConnected ? (
                  <button
                    onClick={disconnect}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={connect}
                    disabled={isConnecting}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                )}

                <button
                  onClick={toggleNotifications}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  {notificationsEnabled
                    ? "Disable Notifications"
                    : "Enable Notifications"}
                </button>
              </div>
            </div>

            {/* Test Controls */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🎮 Test Controls
              </h2>

              <div className="space-y-4">
                {/* Send Test Event */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send Test Event
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Enter test message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendTestEvent}
                      disabled={isLoading || !testMessage.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>

                {/* Simulate Payroll Signing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Simulate Payroll Signing
                  </label>
                  <button
                    onClick={simulatePayrollSigning}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading
                      ? "Simulating..."
                      : "✍️ Simulate Employee Signature"}
                  </button>
                </div>

                {/* Clear Events */}
                <div>
                  <button
                    onClick={clearEvents}
                    disabled={events.length === 0}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    🗑️ Clear Events ({events.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Events Log */}
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Events Log
              </h2>

              <div className="max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No events received yet. Try connecting to SSE or sending a
                    test event.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {events.map((event, index) => (
                      <div
                        key={event.id || index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              event.type === "payroll_signed"
                                ? "bg-green-100 text-green-800"
                                : event.type === "test"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.type === "payroll_signed"
                              ? "✍️ Payroll Signed"
                              : event.type === "test"
                                ? "🧪 Test Event"
                                : event.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleString("vi-VN")}
                          </span>
                        </div>

                        {event.message && (
                          <p className="text-sm text-gray-700 mb-2">
                            {event.message}
                          </p>
                        )}

                        {event.data && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              View Data
                            </summary>
                            <pre className="mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSETestPage;
