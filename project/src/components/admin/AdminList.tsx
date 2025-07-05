import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateAdminModal from "../modals/CreateAdminModal";
import EditAdminModal from "./EditAdminModal";
import { SidebarProvider1 } from "../../components/admin/SidebarContext";
import Header from "./Headerpop";
import Sidebar from "./SideBarpop";
import MobileMenu from "./MobileMenu";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

function Adminuser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAdminId, setEditAdminId] = useState<string | null>(null);



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://ciu-backend.onrender.com/api/admin/admins");
        setUsers(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`https://ciu-backend.onrender.com/api/admin/admins/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://ciu-backend.onrender.com/api/admin/admins");
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider1>
      <div className="font-['Roboto'] m-0 p-0 bg-white min-h-screen">
        <div className="flex flex-col h-screen">
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex flex-1 w-full overflow-hidden">
            {!isMobile && <Sidebar />}
            {isMobile && <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />}
            <main className="flex flex-col w-full max-w-[1200px] mx-auto p-6">
              {/* Header with Add + Search */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#0F533D] hover:bg-[#0d442f] text-white py-3 px-4 text-sm rounded shadow-md transition duration-200"
                >
                  Add New Admin
                </button>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border border-gray-300 text-gray-700 px-3 py-2 w-full sm:w-[300px] text-base rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F533D] transition"
                />
              </div>

              <h2 className="mb-4 text-xl font-semibold text-[#0F533D] text-left">
                List of Admins
              </h2>

              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        First Name
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Last Name
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Username
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Email
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                          No admins found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-[#E6F1EB] transition-colors duration-200"
                        >
                          <td className="px-4 py-3 text-center text-gray-800">{user.first_name}</td>
                          <td className="px-4 py-3 text-center text-gray-800">{user.last_name}</td>
                          <td className="px-4 py-3 text-center text-gray-800">{user.username}</td>
                          <td className="px-4 py-3 text-center text-gray-800">{user.email}</td>
                          <td className="flex justify-center gap-3 px-4 py-3">
                          <button
                              onClick={() => {
                                setEditAdminId(user._id);  
                                setIsEditModalOpen(true);
                              }}
                              
                              className="p-2 rounded hover:text-[#0d442f] transition"
                              title="Edit"
                            >
                              <FaEdit className="text-[#0F533D]" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure to delete this admin?")) deleteUser(user._id);
                              }}
                              className="p-2 rounded hover:text-red-700 transition"
                              title="Delete"
                            >
                              <FaTrash className="text-red-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </main>
          </div>
        </div>

        {isCreateModalOpen && (
          <CreateAdminModal
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              setIsCreateModalOpen(false);
              refreshUsers();
            }}
          />
        )}

          {isEditModalOpen && editAdminId !== null && (
            <EditAdminModal
              adminId={editAdminId}
              onClose={() => setIsEditModalOpen(false)}
              onSuccess={() => {
                setIsEditModalOpen(false);
                refreshUsers();
              }}
            />
          )}

      </div>
    </SidebarProvider1>
  );
}

export default Adminuser;
