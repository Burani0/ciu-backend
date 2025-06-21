import React from "react";
import { LayoutDashboard, Users, Calendar, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  path: string;
  active?: boolean;
}

export default function Sidebar1() {
  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin/" },
    { icon: <Users size={20} />, text: "Manage Users", path: "/users", active: true },
    { icon: <Lock size={20} />, text: "Create FAQ", path: "/admin/authentication" },
    // { icon: <Calendar size={20} />, text: "Calendar", path: "/admin/calendar" },
    { icon: <LogOut size={20} />, text: "Logout", path: "/" },
  ];

  return (
    <aside className="w-64 bg-gray-200 p-4">
      <nav>
        <ul className="list-none p-0">
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded text-gray-800 no-underline
                  ${
                    item.active
                      ? "bg-white text-green-700"
                      : "hover:bg-white hover:text-green-700"
                  }
                `}
              >
                <span className="mr-2 text-[#105F53]">{item.icon}</span>
                <span className="flex-grow">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
