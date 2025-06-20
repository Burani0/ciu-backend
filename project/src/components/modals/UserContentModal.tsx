import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditLecturerModal from "./EditLecturerModal"; // import the modal


function Table({ children }) {
  return (
    <table className="w-full border-collapse mt-5 bg-white shadow-md">
      {children}
    </table>
  );
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr>
        {cols.map((col, index) => (
          <th
            key={index}
            className="bg-gray-100 text-gray-800 px-4 py-3 text-center font-bold uppercase shadow-sm"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

function ConfirmModal({ isOpen, onClose, onConfirm }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-center mb-2">Confirm Delete</h3>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to delete this Lecturer Account? <br />
          <span className="text-red-600 font-medium">This action cannot be undone.</span>
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function UserList({ users, deleteUser }: any) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);


  const cols = ["#", "First Name", "Last Name", "Email", "assigned courses", "Actions"];

  useEffect(() => {
    const filtered = users.filter((user: any) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
    }
    setDialogOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-5">
      <ConfirmModal
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <div className="flex justify-between items-center py-5">
        <button
          className="bg-[#0F533D] text-white py-3 px-6 text-lg rounded hover:bg-[#0d4a36] transition"
          onClick={() => navigate("/registers")}
        >
          Add New Lecturer
        </button>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 text-gray-700 px-4 py-3 w-72 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <h2 className="mb-4 text-xl font-semibold text-left">Lecturers</h2>

      <Table>
        <TableHead cols={cols} />
        <TableBody>
          {filteredUsers.map((user: any, index: number) => (
            <tr
              key={user.id}
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              <th className="px-4 py-2 text-center">{index + 1}</th>
              <td className="px-4 py-2 text-center">{user.first_name}</td>
              <td className="px-4 py-2 text-center">{user.last_name}</td>
              <td className="px-4 py-2 text-center">{user.email}</td>
              <td className="px-4 py-2 text-center">{user.role}</td>
              <td className="flex justify-center gap-3 px-4 py-2">
              <button
                onClick={() => {
                  setEditingUser(user);
                  setIsEditOpen(true);
                }}
                className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
              >
                <FaEdit />
              </button>

                <button
                  onClick={() => handleDeleteClick(user)}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
    
  );
}

export default function UsersContent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://ciu-backend.onrender.com/lecturerReg")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const deleteUser = (id: number) => {
    fetch(`https://ciu-backend.onrender.com/lecturerReg/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prev) => prev.filter((user: any) => user.id !== id));
        } else {
          console.error("Failed to delete user");
        }
      })
      .catch((err) => console.error("Error deleting user:", err));
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <UserList users={users} deleteUser={deleteUser} />
    </div>
  );
}
