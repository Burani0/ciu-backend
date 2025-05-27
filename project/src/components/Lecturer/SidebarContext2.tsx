import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context value
interface SidebarContextType {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

// Create the context with undefined initial value
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Define props for the provider
interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider2({ children }: SidebarProviderProps) {
  const [activeItem, setActiveItem] = useState<string>('LecturerDashboard');

  return (
    <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Custom hook to access context
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider2');
  }
  return context;
};
