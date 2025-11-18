
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CreateLecturerModal from "../CreateLecturerModal.tsx";
import EditLecturerModal from '../admin/EditLecturerModal.tsx';

function Table({ children }) {
  return (
    <table className="w-full border-collapse mt-5 bg-white rounded-md shadow-lg overflow-hidden">
      {children}
    </table>
  );
}

function TableHead({ cols }) {
  return (
    <thead>
      <tr>
        {cols.map((col, index) => (
          <th
            key={index}
            scope="col"
            className="bg-[#E6F1EB] text-[#0F533D] px-2 py-2 text-center font-semibold uppercase tracking-wide border-b border-gray-200"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

function UserList({ users, deleteUser }) {
  const cols = ["#", "First Name", "Last Name", "Email", "Assigned Courses", "Action"];
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateLecturerModalOpen, setCreateLecturerModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editLecturerId, setEditLecturerId] = useState<string | null>(null);
  const [setUsersState, setUsers] = useState([]); // to be updated via props or lifting state

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser._id);
    }
    setDialogOpen(false);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-5 font-['Roboto']">
      {isCreateLecturerModalOpen && (
        <CreateLecturerModal
          onClose={() => setCreateLecturerModalOpen(false)}
          onSuccess={() => setCreateLecturerModalOpen(false)}
        />
      )}

      {isEditModalOpen && editLecturerId && (
        <EditLecturerModal
          lecturerId={editLecturerId}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => setEditModalOpen(false)}
        />
      )}

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle className="text-red-700 font-bold">Confirm Delete</DialogTitle>
        <DialogContent className="text-gray-700">
          Are you sure you want to delete <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center py-5 gap-4 w-full">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="bg-[#0F533D] hover:bg-[#0d442f] text-white py-3 px-4 text-sm rounded shadow-md transition duration-200"
            onClick={() => setCreateLecturerModalOpen(true)}
          >
            Add New Lecturer
          </button>

          <label
            htmlFor="csvLecturerUpload"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 text-sm rounded shadow-md cursor-pointer transition duration-200"
          >
            Upload CSV
          </label>
          <input
            id="csvLecturerUpload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const Papa = await import("papaparse");
                Papa.parse(file, {
                  header: true,
                  skipEmptyLines: true,
                  complete: async (results) => {
                    const fileHeaders = results.meta.fields?.map(h => h.toLowerCase().trim()) || [];
                    const requiredHeaders = ["firstname", "lastname", "email", "universitynumber", "password"];
                    const missing = requiredHeaders.filter(h => !fileHeaders.includes(h));
                    if (missing.length > 0) {
                      alert(`Missing headers: ${missing.join(", ")}`);
                      return;
                    }

                    const formatted = results.data.map((row) => ({
                      firstName: row.firstName?.trim(),
                      lastName: row.lastName?.trim(),
                      email: row.email?.trim(),
                      universityNumber: row.universityNumber?.trim(),
                      password: row.password?.trim(),
                      assignedCourses: row.assignedCourses?.split(",").map(c => c.trim()) || []
                    }));

                    const res = await fetch("https://examiner.ciu.ac.ug/api/admin/bulk-create-lecturers", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ lecturers: formatted }),
                    });

                    if (!res.ok) throw new Error("Failed to upload");

                    alert("Lecturers uploaded successfully");
                    window.location.reload();
                  },
                  error: () => alert("CSV parsing failed"),
                });
              } catch (err) {
                alert("Something went wrong uploading the file.");
              }
            }}
          />
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 text-gray-700 px-3 py-2 w-full sm:w-[300px] text-base rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F533D] transition"
        />
      </div>

      <h2 className="mb-4 text-xl font-semibold text-[#0F533D] text-left">Lecturers</h2>

      <Table>
        <TableHead cols={cols} />
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-[#E6F1EB] transition-colors duration-200">
                <th className="px-4 py-3 text-center font-medium text-gray-800">{index + 1}</th>
                <td className="px-4 py-2 text-center">{user.firstName}</td>
                <td className="px-4 py-2 text-center">{user.lastName}</td>
                <td className="px-4 py-2 text-center">{user.email}</td>
                <td className="px-4 py-2 text-center">
                  {user.assignedCourses?.length > 0
                    ? user.assignedCourses.map((c) => c.courseTitle || c).join(", ")
                    : "No courses assigned"}
                </td>
                <td className="flex justify-center gap-2 px-4 py-3">
                  <button
                    onClick={() => {
                      setEditLecturerId(user._id);
                      setEditModalOpen(true);
                    }}
                    className="p-2 rounded hover:text-[#0d442f]"
                  >
                    <FaEdit className="text-[#0F533D]" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="p-2 rounded hover:text-red-700"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={cols.length} className="text-center py-6 text-gray-500 italic">
                No lecturers found.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function UsersContent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLecturersWithCourses = async () => {
      try {
        const res = await fetch("https://examiner.ciu.ac.ug/api/admin/lecturers");
        const lecturers = await res.json();

        const enrichedLecturers = await Promise.all(
          lecturers.map(async (lecturer) => {
            if (!lecturer.assignedCourses?.length) return { ...lecturer, assignedCourses: [] };

            // const courseDetails = await Promise.all(
            //   lecturer.assignedCourses.map(async (id) => {
            //     const res = await fetch(`https://ciu-backend.onrender.com/api/admin/courses/${id}`);
            //     if (!res.ok) return null;
            //     return await res.json();
            //   })
            // );

            const courseDetails = await Promise.all(
              lecturer.assignedCourses.map(async (identifier) => {
                const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier); // Check if it's a MongoDB ObjectId
            
                const endpoint = isObjectId
                  ? `https://examiner.ciu.ac.ug/api/admin/courses/${identifier}`
                  : `https://examiner.ciu.ac.ug/api/admin/course-by-code/${identifier}`;
            
                try {
                  const res = await fetch(endpoint);
                  if (!res.ok) return null;
                  return await res.json();
                } catch (err) {
                  console.error("Failed to fetch course:", err);
                  return null;
                }
              })
            );

            return {
              ...lecturer,
              assignedCourses: courseDetails.filter(Boolean),
            };
          })
        );

        setUsers(enrichedLecturers);
      } catch (err) {
        console.error("Error loading lecturers:", err);
      }
    };

    fetchLecturersWithCourses();
  }, []);

  const deleteUser = (id) => {
    fetch(`https://examiner.ciu.ac.ug/api/admin/lecturers/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u._id !== id));
        } else {
          console.error("Failed to delete");
        }
      })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="flex justify-center">
        <UserList users={users} deleteUser={deleteUser} />
      </div>
    </div>
  );
}

