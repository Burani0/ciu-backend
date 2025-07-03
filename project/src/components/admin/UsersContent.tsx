// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";
// import RegisterUserModal from "../modals/RegisterUserModal";

// function Table({ children }) {
//   return (
//     <table className="w-full border-collapse mt-5 bg-white shadow-md">
//       {children}
//     </table>
//   );
// }

// function TableHead({ cols }) {
//   return (
//     <thead>
//       <tr>
//         {cols.map((col, index) => (
//           <th
//             key={index}
//             scope="col"
//             className="bg-gray-100 text-gray-800 px-4 py-3 text-center font-bold uppercase shadow-sm"
//           >
//             {col}
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// }

// function TableBody({ children }) {
//   return <tbody>{children}</tbody>;
// }

// function UserList({ users, deleteUser }) {
//   const cols = ["#", "First Name", "Last Name", "Email", "Role", "Actions"];
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState(users);
//   const [isDialogOpen, setDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);


//   useEffect(() => {
//     const filtered = users.filter((user) =>
//       Object.values(user)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [searchTerm, users]);

//   const handleDeleteClick = (user) => {
//     setSelectedUser(user);
//     setDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (selectedUser) {
//       deleteUser(selectedUser.id);
//     }
//     setDialogOpen(false);
//   };

//   return (
//     <div className="w-full max-w-[1200px] mx-auto pt-5">
//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this Lecturer Account? This action
//           cannot be undone.
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button onClick={confirmDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
                

//       {/* Header and Search */}
//       <div className="flex justify-between items-center py-5">
//         <button
//           className="bg-[#0F533D] text-white py-3 px-6 text-lg"
//           onClick={() =>  setRegisterModalOpen(true)}
//         >
//           Add New Lecturer
//         </button>
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 text-gray-600 px-4 py-3 w-[300px] text-base rounded-sm"
//         />
//       </div>

//       <h2 className="mb-4 text-xl font-semibold text-left">Lecturers</h2>

//       <Table>
//         <TableHead cols={cols} />
//         <TableBody>
//           {filteredUsers.map((user, index) => (
//             <tr
//               key={user.id}
//               className="hover:bg-gray-100 transition-colors duration-200"
//             >
//               <th scope="row" className="px-4 py-2 text-center">
//                 {index + 1}
//               </th>
//               <td className="px-4 py-2 text-center">{user.first_name}</td>
//               <td className="px-4 py-2 text-center">{user.last_name}</td>
//               <td className="px-4 py-2 text-center">{user.email}</td>
//               <td className="px-4 py-2 text-center">{user.role}</td>
//               <td className="flex justify-center gap-3 px-4 py-2">
//                 <button
//                   onClick={() => navigate(`/edit/${user.id}`)}
//                   className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition"
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteClick(user)}
//                   className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
//                 >
//                   <FaTrash />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// export default function UsersContent() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/lecturerReg")
//       .then((response) => response.json())
//       .then((data) => setUsers(data))
//       .catch((error) => console.error("Error fetching users:", error));
//   }, []);

//   const deleteUser = (id) => {
//     fetch(`http://localhost:3000/lecturerReg/${id}`, {
//       method: "DELETE",
//     })
//       .then((response) => {
//         if (response.ok) {
//           setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
//         } else {
//           console.error("Failed to delete user");
//         }
//       })
//       .catch((error) => console.error("Error deleting user:", error));
//   };

//   return (
//     <div className="min-h-screen px-4 py-6">
//       <div className="flex justify-center">
//         <UserList users={users} deleteUser={deleteUser} />
//       </div>
//     </div>
//   );
// }
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
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateLecturerModalOpen, setCreateLecturerModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editLecturerId, setEditLecturerId] = useState<string | null>(null);


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
      {/* Register User Modal */}
      {isCreateLecturerModalOpen && (
  <CreateLecturerModal
    onClose={() => setCreateLecturerModalOpen(false)}
    onSuccess={() => {
      setCreateLecturerModalOpen(false);
      // You can optionally trigger a data refresh here, like calling a fetchUsers() function
    }}
  />
)}
  {isEditModalOpen && editLecturerId && (
  <EditLecturerModal
    lecturerId={editLecturerId} // ✅ Pass the ID here
    onClose={() => setEditModalOpen(false)}
    onSuccess={() => {
      setEditModalOpen(false);
      // Optional: Refresh lecturer list here
    }}
  />
)}



      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle className="text-red-700 font-bold">Confirm Delete</DialogTitle>
        <DialogContent className="text-gray-700">
          Are you sure you want to delete this Lecturer Account? This action
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center py-5 gap-4">
        <button
          className="bg-[#0F533D] hover:bg-[#0d442f] text-white py-3 px-4 text-sm rounded shadow-md transition duration-200"
          onClick={() => setCreateLecturerModalOpen(true)}
        >
          Add New Lecturer
        </button>
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
              <tr
                key={user._id}
                className="hover:bg-[#E6F1EB] transition-colors duration-200"
              >
                <th
                  scope="row"
                  className="px-4 py-3 text-center font-medium text-gray-800"
                >
                  {index + 1}
                </th>
                <td className="px-4 py-2 text-center">{user.firstName}</td>
                <td className="px-4 py-2 text-center">{user.lastName}</td>
                <td className="px-4 py-2 text-center">{user.email}</td>
                <td className="px-4 py-2 text-center">
                    {user.assignedCourses && user.assignedCourses.length > 0
                      ? user.assignedCourses.map((course) => course.courseTitle).join(", ")
                      : "No courses assigned"}
                  </td>

                <td className="flex justify-center gap-2 px-4 py-3">
                <button
                  onClick={() => {
                    setEditLecturerId(user._id);
                    setEditModalOpen(true);
                  }}
                  className="p-2 rounded hover:text-[#0d442f] transition"
                  aria-label={`Edit ${user.first_name} ${user.last_name}`}
                >
                  <FaEdit className="text-[#0F533D]" />
                </button>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="p-2 rounded hover:text-red-700 transition"
                  aria-label={`Delete ${user.first_name} ${user.last_name}`}
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
      const res = await fetch("https://ciu-backend.onrender.com/api/admin/lecturers");
      const lecturers = await res.json();

      const enrichedLecturers = await Promise.all(
        lecturers.map(async (lecturer) => {
          if (!lecturer.assignedCourses || lecturer.assignedCourses.length === 0) {
            return { ...lecturer, assignedCourses: [] };
          }

          const courseDetails = await Promise.all(
            lecturer.assignedCourses.map(async (courseId) => {
              const res = await fetch(`https://ciu-backend.onrender.com/api/admin/courses/${courseId}`);
              if (!res.ok) return null;
              return await res.json();
            })
          );

          return {
            ...lecturer,
            assignedCourses: courseDetails.filter(Boolean),
          };
        })
      );

      setUsers(enrichedLecturers);
    } catch (error) {
      console.error("Error fetching users with courses:", error);
    }
  };

  fetchLecturersWithCourses();
}, []);

  
  const deleteUser = (id) => {
    fetch(`https://ciu-backend.onrender.com/api/admin/lecturers/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        } else {
          console.error("Failed to delete user");
        }
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="flex justify-center">
        <UserList users={users} deleteUser={deleteUser} />
      </div>
    </div>
  );
}
