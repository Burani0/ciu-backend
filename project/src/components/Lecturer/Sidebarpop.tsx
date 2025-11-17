import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Video,
  ClipboardCheck,
  ChevronDown,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext2';
import axios from 'axios';

const Sidebar: React.FC = () => {
  const { activeItem, setActiveItem } = useSidebar();
  const location = useLocation();
  const [isExamsDropdownOpen, setExamsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/lecturer' },
    { icon: <FileText size={20} />, text: 'Courses', path: '/lecturer-courses' },
    { icon: <ClipboardCheck size={20} />, text: 'Student Exam Logs', path: '/student_lect_logs' },
    { icon: <Video size={20} />, text: 'Manual Proctoring', path: '/join-viewer' },
    {
      icon: <FileText size={20} />,
      text: 'Exam Management',
      subItems: [
        { text: 'Completed Exams', path: '/Submitted-exam' },
        // { text: 'Completed Exams', path: '/completed-Assessments' },
      ],
    },
    { icon: <LogOut size={20} />, text: 'Logout', logout: true },
  ];

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname && !item.logout);
    if (currentItem) setActiveItem(currentItem.text);
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
      await axios.post('https://examiner.ciu.ac.ug/api/auth/lecturerlogout', { lecturerId });
      localStorage.removeItem('lecturerId');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <aside className="w-64 bg-white h-screen shadow-md font-['Roboto']">
        <nav className="py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) =>
              item.subItems ? (
                <li key={index} className="relative">
                  <div
                    className={`flex items-center justify-between px-4 py-2 font-medium cursor-pointer hover:bg-gray-100 ${
                      item.subItems.some((s) => s.text === activeItem) ? 'text-[#106053]' : ''
                    }`}
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
                            className={`block px-4 py-2 text-sm hover:bg-[#106053] hover:text-white ${
                              activeItem === subItem.text ? 'text-white' : 'text-[#106053]'
                            }`}
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
                  onClick={() => setShowLogoutConfirm(true)}
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
              <button onClick={() => setShowLogoutConfirm(false)}>
                <X className="text-gray-500 hover:text-gray-800" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
