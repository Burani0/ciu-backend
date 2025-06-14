import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Library,
  // ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import CreateCourseModal from '../CreateCourseModal.tsx';
import { useSidebar } from "./SidebarContext.tsx";

export default function Sidebar() {
  const { activeItem, setActiveItem } = useSidebar();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isUserContentOpen, setIsUserContentOpen] = useState(false);

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      text: "Dashboard",
      path: "/admin",
    },
    {
      icon: <Users size={20} />,
      text: "Manage Users",
      path: "/admin/manage-users",
      subItems: [
        // { text: "Manage Students", path: "/table" },
        { text: "Manage Lecturers",path:"/users"  },
        { text: "Lecturer Logs",path:"/loggs"  },
        // { text: "Manage Administrators", path: "/adminuser" },
      ],
    },
    // {
    //   icon: <ClipboardCheck size={20} />,
    //   text: "Exam list",
    //   path: "/admin-exam-list",
    // },
    {
      icon: <Library size={20} />,
      text: "Courses",
      subItems: [
        { text: "Register Course",  action: () => setIsCreateCourseModalOpen(true) },
        { text: "View Courses", path: "/admin-courses" },
      ],
    },
    // {
    //   icon: <Lock size={20} />,
    //   text: "Create FAQs",
    //   path: "/admin/create-faqs",
    // },
    // { icon: <Calendar size={20} />, text: "Calendar", path: "/admin/calendar" },
    { icon: <LogOut size={20} />, text: "Logout", path: "/" },
  ];
useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    if (currentItem) {
      setActiveItem(currentItem.text);
    }
  }, [location, setActiveItem]);

  const handleItemClick = (text: string) => {
    setActiveItem(text);
  };

  const toggleDropdown = (text: string) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [text]: !prevState[text],
    }));
  };

  return (
    <>
      <aside className="w-64 bg-[#f0f0f0] p-4 h-screen overflow-y-auto">
        <nav>
          <ul className="list-none p-0">
            {menuItems.map((item, index) =>
              item.subItems ? (
                <li key={index} className="mb-2">
                  <div
                    className="flex items-center p-2 rounded cursor-pointer text-[#333] hover:bg-white hover:text-[#1a8754]"
                    onClick={() => toggleDropdown(item.text)}
                  >
                    <span className="mr-2 text-[#105F53]">{item.icon}</span>
                    <span className="flex-1">{item.text}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdowns[item.text] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openDropdowns[item.text] && (
                    <ul className="ml-4 mt-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className={`mb-2 ${
                            activeItem === subItem.text
                              ? "bg-white text-[#1a8754] rounded"
                              : ""
                          }`}
                        >
                          {subItem.path ? (
                            <Link
                              to={subItem.path}
                              className="flex items-center p-2 text-[#333] hover:bg-white hover:text-[#1a8754] rounded"
                              onClick={() => handleItemClick(subItem.text)}
                            >
                              {subItem.text}
                            </Link>
                          ) : (
                            <button
                              onClick={() => {
                                handleItemClick(subItem.text);
                                subItem.action?.();
                              }}
                              className="flex w-full items-center p-2 text-left text-[#333] hover:bg-white hover:text-[#1a8754] rounded"
                            >
                              {subItem.text}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li
                  key={index}
                  className={`mb-2 ${
                    activeItem === item.text ? "bg-white text-[#1a8754] rounded" : ""
                  }`}
                  onClick={() => handleItemClick(item.text)}
                >
                  <Link
                    to={item.path}
                    className="flex items-center p-2 text-[#333] hover:bg-white hover:text-[#1a8754] rounded"
                  >
                    <span className="mr-2 text-[#105F53]">{item.icon}</span>
                    <span>{item.text}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>

      {/* Register Course Modal */}
      {isCreateCourseModalOpen && (
        <CreateCourseModal isOpen={isCreateCourseModalOpen} onClose={() => setIsCreateCourseModalOpen(false)} />
      )}
      {/* {isUserContentOpen && (
        <UserContentModal isOpen={isUserContentOpen} onClose={() => setIsUserContentOpen(false)} />
      )} */}
    </>
  );
}