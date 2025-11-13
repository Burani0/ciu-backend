// 1. First, create a notification context to manage state across components
// NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface NotificationContextType {
  unreadCount: number;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
  lastChecked: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(() => {
    // Get last checked time from localStorage or default to current time
    const stored = localStorage.getItem('lastNotificationCheck');
    return stored ? parseInt(stored) : Date.now();
  });

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/exams/fetch_exam_logs');
      const logs = response.data;
      
      // Count notifications newer than last checked time
      let newCount = 0;
      const now = Date.now();
      const threeHoursAgo = now - (3 * 60 * 60 * 1000);
      
      logs.forEach((log: any) => {
        log.logEntries.forEach((entry: any) => {
          const entryTimestamp = entry.timestamp || log.timestamp || Date.now();
          const timestampMs = new Date(entryTimestamp).getTime();
          
          // Count entries that are newer than last checked time and within 3 hours
          if (timestampMs >= threeHoursAgo && timestampMs > lastChecked) {
            newCount++;
          }
        });
      });
      
      setUnreadCount(newCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAllAsRead = () => {
    const now = Date.now();
    setLastChecked(now);
    setUnreadCount(0);
    localStorage.setItem('lastNotificationCheck', now.toString());
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [lastChecked]);

  return (
    <NotificationContext.Provider value={{ unreadCount, markAllAsRead, fetchNotifications, lastChecked }}>
      {children}
    </NotificationContext.Provider>
  );
};