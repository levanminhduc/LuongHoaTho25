import React, { useState } from 'react';
import { Bell, BellOff, Wifi, WifiOff, Settings, X } from 'lucide-react';
import { useSSEContext } from '@/contexts/SSEContext';

interface SSEStatusProps {
  className?: string;
  showDetails?: boolean;
}

const SSEStatus: React.FC<SSEStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const {
    isConnected,
    isConnecting,
    error,
    events,
    connectionAttempts,
    connect,
    disconnect,
    toggleNotifications,
    clearEvents,
    isAdmin,
    notificationsEnabled,
  } = useSSEContext();

  const [showPanel, setShowPanel] = useState(false);

  // Don't render if user is not admin
  if (!isAdmin) {
    return null;
  }

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-500';
    if (isConnected) return 'text-green-500';
    if (error) return 'text-red-500';
    return 'text-gray-400';
  };

  const getStatusText = () => {
    if (isConnecting) return 'Đang kết nối...';
    if (isConnected) return 'Kết nối thành công';
    if (error) return `Lỗi: ${error}`;
    return 'Chưa kết nối';
  };

  const StatusIcon = isConnected ? Wifi : WifiOff;
  const NotificationIcon = notificationsEnabled ? Bell : BellOff;

  return (
    <div className={`relative ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${getStatusColor()} hover:bg-gray-100`}
          title={getStatusText()}
        >
          <StatusIcon className="h-3 w-3" />
          {showDetails && <span>{getStatusText()}</span>}
        </button>

        {/* Notification Toggle */}
        <button
          onClick={toggleNotifications}
          className={`p-1 rounded-md transition-colors ${
            notificationsEnabled 
              ? 'text-blue-500 hover:bg-blue-50' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title={notificationsEnabled ? 'Tắt thông báo' : 'Bật thông báo'}
        >
          <NotificationIcon className="h-3 w-3" />
        </button>

        {/* Event Count Badge */}
        {events.length > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {events.length}
          </span>
        )}
      </div>

      {/* Detailed Panel */}
      {showPanel && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Real-time Status
              </h3>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Connection Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kết nối:</span>
                <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span className="text-xs">{getStatusText()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thông báo:</span>
                <button
                  onClick={toggleNotifications}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                    notificationsEnabled 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <NotificationIcon className="h-3 w-3" />
                  <span>{notificationsEnabled ? 'Bật' : 'Tắt'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Events:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{events.length} sự kiện</span>
                  {events.length > 0 && (
                    <button
                      onClick={clearEvents}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {connectionAttempts > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thử kết nối:</span>
                  <span className="text-xs text-gray-500">{connectionAttempts} lần</span>
                </div>
              )}
            </div>

            {/* Connection Controls */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex space-x-2">
                {isConnected ? (
                  <button
                    onClick={disconnect}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                  >
                    Ngắt kết nối
                  </button>
                ) : (
                  <button
                    onClick={connect}
                    disabled={isConnecting}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 disabled:opacity-50"
                  >
                    {isConnecting ? 'Đang kết nối...' : 'Kết nối'}
                  </button>
                )}
              </div>
            </div>

            {/* Recent Events */}
            {events.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  Sự kiện gần đây:
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {events.slice(0, 5).map((event, index) => (
                    <div key={event.id || index} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {event.type === 'payroll_signed' ? '✍️ Ký lương' : event.type}
                        </span>
                        <span className="text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                      {event.message && (
                        <div className="text-gray-600 mt-1">{event.message}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SSEStatus;
