import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Video,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext2';
import axios from 'axios';

const Sidebar: React.FC = () => {
  const { activeItem, setActiveItem } = useSidebar();
  const location = useLocation();
  const [isExamsDropdownOpen, setExamsDropdownOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/lecturer' },
    { icon: <FileText size={20} />, text: 'Courses', path: '/lecturer-courses' },
    { icon: <HelpCircle size={20} />, text: 'Timetable', path: '/timetable' },
    { icon: <Video size={20} />, text: 'Proctoring', path: '/join-viewer' },
    {
      icon: <FileText size={20} />,
      text: 'Exam Management',
      subItems: [
        { text: 'Student Exam Logs', path: '/student_logs' },
        { text: 'Completed Exams', path: '/completed-Assessments' },
      ],
    },
    { icon: <LogOut size={20} />, text: 'Logout', logout: true },
  ];

  useEffect(() => {
    const currentItem = menuItems.find(
      item => item.path === location.pathname && !item.logout
    );
    if (currentItem) {
      setActiveItem(currentItem.text);
    }
  }, [location, setActiveItem]);

  const handleItemClick = (text: string) => {
    setActiveItem(text);
  };

  const toggleExamsDropdown = () => {
    setExamsDropdownOpen(prev => !prev);
  };

  const handleLogout = async () => {
    const lecturerId = localStorage.getItem('lecturerId');
    if (!lecturerId) return;

    try {
      await axios.post('http://localhost:3001/api/auth/lecturerlogout', { lecturerId });
      localStorage.removeItem('lecturerId');
      window.location.href = '/'; // Redirect to login/home
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-64 bg-white h-screen shadow-md">
      <nav className="py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) =>
            item.subItems ? (
              <li key={index} className="relative">
                <div
                  className="flex items-center justify-between px-4 py-2 text-[#106053] font-medium cursor-pointer hover:bg-gray-100"
                  onClick={toggleExamsDropdown}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                  <ChevronDown size={16} />
                </div>
                {isExamsDropdownOpen && (
                  <ul className="bg-white shadow-md border border-gray-200 mt-1 rounded">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className={`${
                          activeItem === subItem.text ? 'bg-[#106053] text-white' : ''
                        }`}
                      >
                        <Link
                          to={subItem.path}
                          className="block px-4 py-2 text-sm hover:bg-[#106053] hover:text-white"
                          onClick={() => handleItemClick(subItem.text)}
                        >
                          {subItem.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : item.logout ? (
              <li
                key={index}
                className="rounded cursor-pointer hover:bg-gray-100"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-2 px-4 py-2 font-medium text-[#106053]">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              </li>
            ) : (
              <li
                key={index}
                className={`${
                  activeItem === item.text ? 'bg-[#E6F1EB]' : ''
                } rounded`}
                onClick={() => handleItemClick(item.text)}
              >
                <Link
                  to={item.path!}
                  className="flex items-center gap-2 px-4 py-2 font-medium text-[#106053]"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
