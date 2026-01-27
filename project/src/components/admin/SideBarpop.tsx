import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Library,
  ClipboardCheck,
  ChevronDown,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateCourseModal from "../CreateCourseModal.tsx";
import { useSidebar } from "./SidebarContext.tsx";

export default function Sidebar() {
  const { activeItem, setActiveItem } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) return;
    try {
      await axios.post("https://examiner.ciu.ac.ug/api/admin/adminlogout", { adminId });
      localStorage.removeItem("adminId");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin" },
    {
      icon: <Users size={20} />,
      text: "Manage Users",
      subItems: [
        { text: "Manage Lecturers", path: "/users" },
        { text: "Manage Admins", path: "/adminlist" },
        // { text: "Lecturer Logs", path: "/loggs" },
        
      ],
    },
    {
      icon: <ClipboardCheck size={20} />,
      text: "Logs",
      subItems: [{ text: "Lecturer Logs", path: "/loggs" },
        { text: "Student Exam Logs", path: "/student_logs" },
      ],
      
    },
    {
      icon: <Library size={20} />,
      text: "Courses",
      subItems: [
        { text: "Register Course", action: () => setIsCreateCourseModalOpen(true) },
        { text: "View Courses", path: "/admin-courses" },
      ],
    },
    { icon: <LogOut size={20} />, text: "Logout", action: () => setShowLogoutConfirm(true) },
  ];

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    if (currentItem) setActiveItem(currentItem.text);
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
      <aside className="w-64 bg-[#f0f0f0] p-4 h-screen overflow-y-auto font-['Roboto']">
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
                      className={`transition-transform duration-200 ${openDropdowns[item.text] ? "rotate-180" : ""}`}
                    />
                  </div>
                  {openDropdowns[item.text] && (
                    <ul className="ml-4 mt-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className={`mb-2 ${activeItem === subItem.text ? "bg-white text-[#1a8754] rounded" : ""}`}
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
                  className={`mb-2 ${activeItem === item.text ? "bg-white text-[#1a8754] rounded" : ""}`}
                >
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className="flex w-full items-center p-2 text-left text-[#333] hover:bg-white hover:text-[#1a8754] rounded"
                    >
                      <span className="mr-2 text-[#105F53]">{item.icon}</span>
                      <span>{item.text}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center p-2 text-[#333] hover:bg-white hover:text-[#1a8754] rounded"
                      onClick={() => handleItemClick(item.text)}
                    >
                      <span className="mr-2 text-[#105F53]">{item.icon}</span>
                      <span>{item.text}</span>
                    </Link>
                  )}
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>

      {/* Create Course Modal */}
      {isCreateCourseModalOpen && (
        <CreateCourseModal isOpen={isCreateCourseModalOpen} onClose={() => setIsCreateCourseModalOpen(false)} />
      )}

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
}
