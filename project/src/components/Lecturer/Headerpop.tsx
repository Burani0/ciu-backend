import React, { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import UserDetailsPopup from './UserDetailsPopup';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleMobileMenu: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu, isMobile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 h-20">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="bg-none border-none cursor-pointer p-2 mr-2"
          >
            <Menu className="w-6 h-6 text-[#106053]" />
          </button>
        )}
        <img
          src=".\public\public\CIU-exam-system-logo.png"
          alt="System Logo"
          className="h-12 mr-2"
        />
      </div>

      <div
        id="timedate"
        className="mr-0 ml-auto text-sm text-center whitespace-nowrap"
      >
        <a id="month">
          {currentTime.toLocaleString('default', { month: 'long' })}
        </a>{' '}
        <a id="day">{currentTime.getDate()}</a>,{' '}
        <a id="year">{currentTime.getFullYear()}</a>
        <br />
        <a id="hour">
          {((currentTime.getHours() % 12) || 12).toString().padStart(2, '0')}
        </a>
        :
        <a id="min">{currentTime.getMinutes().toString().padStart(2, '0')}</a>
        :
        <a id="s">{currentTime.getSeconds().toString().padStart(2, '0')}</a>{' '}
        <a id="ampm">{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</a>
      </div>

      <div className="flex items-center h-12 ml-2 gap-4">
        <Link to="/admin/notifications">
          <button
            className="relative bg-none border-none cursor-pointer p-2 rounded hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="w-7 h-7 text-[#106053]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </Link>

        <UserDetailsPopup>
          <button
            className="bg-none border-none cursor-pointer w-12 h-12 p-0 overflow-hidden rounded-full"
            aria-label="User profile"
          >
            <img
              src=".\public\public\IMG_9472.jpg"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </button>
        </UserDetailsPopup>
      </div>
    </header>
  );
};

export default Header;
