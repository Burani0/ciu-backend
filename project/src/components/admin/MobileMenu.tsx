import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Lock,
  Library,
  ClipboardCheck,
  ChevronDown,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "./SidebarContext";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  subItems?: {
    icon: React.ElementType;
    label: string;
    path: string;
  }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function MobileMenu({ isOpen, toggleMenu }: MobileMenuProps) {
  const { activeItem, setActiveItem } = useSidebar();
  const location = useLocation();
  const [isExamsOpen, setIsExamsOpen] = useState(false);
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    {
      icon: Users,
      label: "Manage Users",
      subItems: [
        { icon: ClipboardCheck, label: "Manage Students", path: "/table" },
        { icon: ClipboardCheck, label: "Manage Lectures", path: "/users" },
        { icon: ClipboardCheck, label: "Manage Administrators", path: "/adminuser" },
      ],
    },
    { icon: ClipboardCheck, label: "Exam list", path: "/admin-exam-list" },
    {
      icon: Library,
      label: "Courses",
      subItems: [
        { icon: Library, label: "Register Course", path: "/regCourse" },
        { icon: Library, label: "View Courses", path: "/admin-courses" },
      ],
    },
    { icon: Lock, label: "Create FAQs", path: "/admin/create-faqs" },
    { icon: Calendar, label: "Calendar", path: "/admin/calendar" },
    { icon: LogOut, label: "Logout", path: "/" },
  ];

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.label);
    }
  }, [location, setActiveItem]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    if (label === "Courses") {
      setIsExamsOpen(!isExamsOpen);
    } else if (label === "Manage Users") {
      setIsManageUsersOpen(!isManageUsersOpen);
    } else {
      toggleMenu();
    }
  };

  return (
    <div
      className={`fixed top-0 h-screen w-64 bg-gray-100 transition-all duration-300 ease-in-out z-[999] ${
        isOpen ? "left-0 z-[1000]" : "-left-64"
      }`}
    >
      <button
        className="absolute top-4 right-4 p-2 bg-transparent border-none cursor-pointer"
        onClick={toggleMenu}
        aria-label="Close menu"
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>

      <aside className="flex flex-col px-4 pt-12 pb-4">
        <nav>
          <ul className="list-none p-0">
            {menuItems.map((item, index) => {
              const isSubmenuOpen =
                (item.label === "Courses" && isExamsOpen) ||
                (item.label === "Manage Users" && isManageUsersOpen);

              return (
                <li
                  key={index}
                  className={`${
                    activeItem === item.label ? "bg-white text-green-700" : ""
                  }`}
                >
                  {item.subItems ? (
                    <div>
                      <button
                        className="flex items-center w-full p-3 text-[#105F53] text-base bg-transparent border-none cursor-pointer hover:bg-white hover:text-green-700"
                        onClick={() => handleItemClick(item.label)}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                        <ChevronDown
                          className={`ml-auto w-5 h-5 transform transition-transform duration-300 ${
                            isSubmenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isSubmenuOpen && (
                        <ul className="ml-4 pl-4 border-l border-white/10">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className="flex items-center w-full px-4 py-2 text-[#105F53] text-base bg-transparent hover:bg-white hover:text-green-700"
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
                      to={item.path!}
                      className="flex items-center w-full p-3 text-[#105F53] text-base bg-transparent hover:bg-white hover:text-green-700"
                      onClick={() => handleItemClick(item.label)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
