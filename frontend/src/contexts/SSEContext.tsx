import React, { createContext, useContext, ReactNode } from 'react';
import { useSSE, SSEEvent, SSEState } from '@/hooks/useSSE';

interface SSEContextType extends SSEState {
  connect: () => void;
  disconnect: () => void;
  toggleNotifications: () => void;
  clearEvents: () => void;
  isAdmin: boolean;
  notificationsEnabled: boolean;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

interface SSEProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  showNotifications?: boolean;
}

export const SSEProvider: React.FC<SSEProviderProps> = ({ 
  children, 
  autoConnect = true,
  showNotifications = true 
}) => {
  const sseData = useSSE({ 
    autoConnect, 
    showNotifications,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5
  });

  return (
    <SSEContext.Provider value={sseData}>
      {children}
    </SSEContext.Provider>
  );
};

export const useSSEContext = (): SSEContextType => {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error('useSSEContext must be used within a SSEProvider');
  }
  return context;
};

// Optional: Hook to check if SSE is available (user is admin)
export const useSSEAvailable = (): boolean => {
  const context = useContext(SSEContext);
  return context?.isAdmin ?? false;
};
