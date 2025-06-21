import React, { useState, useEffect, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';
import Header from './Headerpop';
import Sidebar from './SideBarpop';
import MobileMenu from "./MobileMenu";
import { SidebarProvider1 } from '../admin/SidebarContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col">
     < SidebarProvider1>
      <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
      <div className="flex flex-row overflow-auto">
        {!isMobile && <Sidebar />}
        {isMobile && <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />}
        <div className="flex-grow p-5">
          {children}
        </div>
      </div>
      </SidebarProvider1>
    </div>
  );
};

export default Layout;
