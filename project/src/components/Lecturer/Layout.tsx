import React, { ReactNode } from 'react';
import Header from '../Lecturer/Headerpop';
import LecturerSidebar from '../Lecturer/Sidebarpop';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-row">
        <LecturerSidebar />
        <div className="flex-grow p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
