import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SidebarContextType {
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider1: React.FC<SidebarProviderProps> = ({ children }) => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');

  return (
    <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider1');
  }
  return context;
};
