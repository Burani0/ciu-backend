import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, LogOut, Video,
  ClipboardCheck, HelpCircle, ChevronDown, X
} from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext2';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function MobileMenu({ isOpen, toggleMenu }: MobileMenuProps) {
  const { activeItem, setActiveItem } = useSidebar();
  const location = useLocation();
  const [isExamsOpen, setIsExamsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/lecturerdashboard' },
    { icon: FileText, label: 'Courses', path: '/lect-courses' },
    { icon: HelpCircle, label: 'Question Bank', path: '' },
    { icon: Video, label: 'Proctoring', path: '' },
    {
      icon: FileText,
      label: 'Exam Mgt',
      subItems: [
        { icon: ClipboardCheck, label: 'Create Assessment', path: '/schedule-create-exams' },
        { icon: ClipboardCheck, label: 'Upload Assessment', path: '/schedule-upload-exams' },
        { icon: ClipboardCheck, label: 'View Exam List', path: '/schedule-upload-exams/exam-list' },
        { icon: ClipboardCheck, label: 'Published Exams', path: '/published-exam-papers' },
        { icon: ClipboardCheck, label: 'Completed Exams', path: '/completed-Assessments' },
      ],
    },
    { icon: LogOut, label: 'Logout', path: '/' }
  ];

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.label);
    }
  }, [location, setActiveItem]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    if (label === "Exam Mgt") {
      setIsExamsOpen(!isExamsOpen);
    } else {
      toggleMenu();
    }
  };

  return (
    <div className={`fixed top-0 h-screen w-64 bg-gray-100 z-[999] transition-all duration-300 ease-in-out ${isOpen ? 'left-0 z-[1000]' : '-left-64'}`}>
      <button
        onClick={toggleMenu}
        className="absolute top-4 right-4 p-2 bg-transparent border-none cursor-pointer"
        aria-label="Close menu"
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>

      <aside className="flex flex-col pt-12 px-4 pb-4">
        <nav>
          <ul className="list-none p-0">
            {menuItems.map((item, index) => (
              <li key={index} className={`${activeItem === item.label ? 'bg-white text-green-700' : ''}`}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => handleItemClick(item.label)}
                      className="flex items-center w-full px-3 py-3 text-base cursor-pointer transition-colors hover:bg-white hover:text-green-700"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                      <ChevronDown className={`w-5 h-5 ml-auto transition-transform ${isExamsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExamsOpen && (
                      <ul className="list-none pl-10 mt-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className="flex items-center w-full px-3 py-2 text-base text-green-700 transition-colors hover:bg-white"
                              onClick={() => {
                                handleItemClick(subItem.label);
                                toggleMenu();
                              }}
                            >
                              <subItem.icon className="w-5 h-5 mr-3" />
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center w-full px-3 py-3 text-base transition-colors hover:bg-white hover:text-green-700"
                    onClick={() => handleItemClick(item.label)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
