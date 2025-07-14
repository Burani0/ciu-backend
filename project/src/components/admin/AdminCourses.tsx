// import React, { useEffect, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";

// import Header from "../../components/admin/Headerpop";
// import Sidebar from "../../components/admin/SideBarpop";
// import MobileMenu from "../../components/admin/MobileMenu";
// import { SidebarProvider1 } from "../../components/admin/SidebarContext";
// import EditCourseModal from "./EditCourseModal";
// import RegCourseModal from "../modals/RegCourseModal";

// const BASE_URL = "https://ciu-backend.onrender.com/api/admin";

// interface Course {
//   _id: string;
//   faculty: string;
//   program: string;
//   courseTitle: string[] | string;
//   courseCode: string[] | string;
// }

// const AdminCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [editCourseId, setEditCourseId] = useState<string | null>(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const [showRegCourseModal, setShowRegCourseModal] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/courses`);
//         setCourses(response.data);
//         setFilteredCourses(response.data);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     setFilteredCourses(
//       courses.filter((course) =>
//         course.courseTitle.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm, courses]);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 991);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleDeleteClick = (course: Course) => {
//     setSelectedCourse(course);
//     setDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedCourse) return;
//     try {
//       await axios.delete(`${BASE_URL}/courses/${selectedCourse._id}`);
//       setCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
//       setFilteredCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
//     } catch (err) {
//       console.error("Error deleting course:", err);
//     }
//     setDialogOpen(false);
//   };

//   const handleEditClick = (id: string) => {
//     setEditCourseId(id);
//     setShowEditModal(true);
//   };

//   return (
//     <SidebarProvider1>
//       <div className="font-['Roboto']">
//         <div className="flex flex-col h-screen">
//           <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//           <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
//             {!isMobile && <Sidebar />}
//             {isMobile && (
//               <>
//                 <div
//                   className={`fixed inset-0 bg-black bg-opacity-50 z-[998] ${isMobileMenuOpen ? 'block' : 'hidden'}`}
//                   onClick={toggleMobileMenu}
//                 ></div>
//                 <MobileMenu isOpen={isMobileMenuOpen} />
//               </>
//             )}
//             <main className="flex-1 p-5 bg-gray-50 overflow-y-auto">
//               <div className="max-w-[1200px] mx-auto pt-20">
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
//                   <button
//                     className="bg-[#0F533D] hover:bg-[#0B3F37] text-white font-medium py-2 px-4 rounded-md shadow min-w-[180px]"
//                     onClick={() => setShowRegCourseModal(true)}
//                   >
//                     Add New Course
//                   </button>
//                   <input
//                     type="text"
//                     placeholder="Search by course title..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-[300px] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F533D]"
//                   />
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden">
//                     <thead>
//                       <tr className="bg-[#E6F1EB] text-[#0F533D] text-sm font-semibold uppercase tracking-wide">
//                         <th className="px-2 py-3 border-b border-gray-200">#</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Faculty</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Program</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Course Title</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Course Code</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCourses.map((course, index) => (
//                         <tr key={course._id} className="text-center hover:bg-gray-50 text-sm">
//                           <td className="px-2 py-2">{index + 1}</td>
//                           <td className="px-2 py-2">{course.faculty}</td>
//                           <td className="px-2 py-2">
//                             <ul>
//                               {[course.program].flat().map((prog, i) => (
//                                 <li key={i}>• {prog}</li>
//                               ))}
//                             </ul>
//                           </td>
//                           <td className="px-2 py-2">
//                             <ul>
//                               {[course.courseTitle].flat().map((title, i) => (
//                                 <li key={i}>• {title}</li>
//                               ))}
//                             </ul>
//                           </td>
//                           <td className="px-2 py-2">
//                             <ul>
//                               {[course.courseCode].flat().map((code, i) => (
//                                 <li key={i}>• {code}</li>
//                               ))}
//                             </ul>
//                           </td>
//                           <td className="px-2 py-2 flex justify-center gap-2">
//                             <button onClick={() => handleEditClick(course._id)}>
//                               <FaEdit className="text-[#0F533D] hover:text-[#0B3F37]" />
//                             </button>
//                             <button onClick={() => handleDeleteClick(course)}>
//                               <FaTrash className="text-red-600 hover:text-red-800" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
//                 <DialogTitle className="text-red-700 font-bold">Confirm Delete</DialogTitle>
//                 <DialogContent className="text-gray-700">
//                   Are you sure you want to delete <strong>{selectedCourse?.courseTitle}</strong>? This action cannot be undone.
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={() => setDialogOpen(false)} color="inherit">
//                     Cancel
//                   </Button>
//                   <Button onClick={confirmDelete} color="error" variant="contained">
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>

//               {showEditModal && editCourseId && (
//                 <EditCourseModal
//                   courseId={editCourseId}
//                   onClose={() => setShowEditModal(false)}
//                   onSuccess={() => {
//                     axios.get(`${BASE_URL}/courses`).then((res) => {
//                       setCourses(res.data);
//                       setFilteredCourses(res.data);
//                     });
//                   }}
//                 />
//               )}

//               {showRegCourseModal && (
//                 <RegCourseModal
//                   onClose={() => setShowRegCourseModal(false)}
//                   onSuccess={() => {
//                     axios.get(`${BASE_URL}/courses`).then((res) => {
//                       setCourses(res.data);
//                       setFilteredCourses(res.data);
//                     });
//                   }}
//                 />
//               )}
//             </main>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider1>
//   );
// };

// export default AdminCourses;

// import React, { useEffect, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";

// import Header from "../../components/admin/Headerpop";
// import Sidebar from "../../components/admin/SideBarpop";
// import MobileMenu from "../../components/admin/MobileMenu";
// import { SidebarProvider1 } from "../../components/admin/SidebarContext";
// import EditCourseModal from "./EditCourseModal";
// import RegCourseModal from "../modals/RegCourseModal";

// const BASE_URL = "https://ciu-backend.onrender.com/api/admin";

// interface Course {
//   _id: string;
//   faculty: string;
//   program: string;
//   courseTitle: string[] | string;
//   courseCode: string[] | string;
// }

// const AdminCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [editCourseId, setEditCourseId] = useState<string | null>(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const [showRegCourseModal, setShowRegCourseModal] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/courses`);
//         setCourses(response.data);
//         setFilteredCourses(response.data);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     setFilteredCourses(
//       courses.filter((course) =>
//         course.courseTitle.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm, courses]);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 991);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleDeleteClick = (course: Course) => {
//     setSelectedCourse(course);
//     setDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedCourse) return;
//     try {
//       await axios.delete(`${BASE_URL}/courses/${selectedCourse._id}`);
//       setCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
//       setFilteredCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
//     } catch (err) {
//       console.error("Error deleting course:", err);
//     }
//     setDialogOpen(false);
//   };

//   const handleEditClick = (id: string) => {
//     setEditCourseId(id);
//     setShowEditModal(true);
//   };

//   return (
//     <SidebarProvider1>
//       <div className="font-['Roboto']">
//         <div className="flex flex-col h-screen">
//           <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//           <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
//             {!isMobile && <Sidebar />}
//             {isMobile && (
//               <>
//                 <div
//                   className={`fixed inset-0 bg-black bg-opacity-50 z-[998] ${isMobileMenuOpen ? 'block' : 'hidden'}`}
//                   onClick={toggleMobileMenu}
//                 ></div>
//                 <MobileMenu isOpen={isMobileMenuOpen} />
//               </>
//             )}
//             <main className="flex-1 p-5 bg-gray-50 overflow-y-auto">
//               <div className="max-w-[1200px] mx-auto pt-20">
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
//                   <div className="flex gap-2">
//                     <button
//                       className="bg-[#0F533D] hover:bg-[#0B3F37] text-white font-medium py-2 px-4 rounded-md shadow min-w-[150px]"
//                       onClick={() => setShowRegCourseModal(true)}
//                     >
//                       Add New Course
//                     </button>

//                     <label htmlFor="csvUpload" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow cursor-pointer min-w-[150px]">
//                       Upload CSV
//                     </label>
//                     <input
//                       id="csvUpload"
//                       type="file"
//                       accept=".csv"
//                       className="hidden"
//                       onChange={async (e) => {
//                         const file = e.target.files?.[0];
//                         if (!file) return;
//                         try {
//                           const Papa = await import('papaparse');

//                           Papa.parse(file, {
//                             header: true,
//                             skipEmptyLines: true,
//                             complete: async function (results: any) {
//                               const requiredHeaders = ['faculty', 'program', 'courseTitle', 'courseCode'];
//                               // const fileHeaders = results.meta.fields.map((h: string) => h.toLowerCase());
//                               const fileHeaders = results.meta.fields.map((h: string) =>
//                                 h.trim().toLowerCase()
//                               );
                              
//                               const missingHeaders = requiredHeaders.filter((h) => !fileHeaders.includes(h));

//                               if (missingHeaders.length > 0) {
//                                 // alert(`Missing required headers: ${missingHeaders.join(', ')}`);
//                                 alert(
//                                   `Missing required headers: ${missingHeaders.join(
//                                     ", "
//                                   )}\n\nYour CSV headers: ${fileHeaders.join(", ")}`
//                                 );
                                
//                                 return;
//                               }

//                               const correctFieldMap: Record<string, string> = {
//                                 faculty: 'faculty',
//                                 program: 'program',
//                                 coursetitle: 'courseTitle',
//                                 coursecode: 'courseCode',
//                               };

//                               const normalizedData = results.data.map((row: any) => {
//                                 const normalizedRow: any = {};
//                                 for (const key in row) {
//                                   const lowerKey = key.toLowerCase();
//                                   const correctKey = correctFieldMap[lowerKey];
//                                   if (correctKey) {
//                                     normalizedRow[correctKey] = row[key];
//                                   }
//                                 }
//                                 return normalizedRow;
//                               });

//                               try {
//                                 await axios.post(`${BASE_URL}/bulk-create-courses`, {
//                                   courses: normalizedData,
//                                 });

//                                 const res = await axios.get(`${BASE_URL}/courses`);
//                                 setCourses(res.data);
//                                 setFilteredCourses(res.data);
//                                 alert('CSV upload successful.');
//                               } catch (error: any) {
//                                 alert(error.response?.data?.message || 'CSV upload failed.');
//                               }
//                             },
//                             error: function () {
//                               alert('Failed to parse CSV.');
//                             },
//                           });
//                         } catch (err) {
//                           alert('Failed to upload CSV.');
//                         }
//                       }}
//                     />
//                   </div>

//                   <input
//                     type="text"
//                     placeholder="Search by course title..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-[300px] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F533D]"
//                   />
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden">
//                     <thead>
//                       <tr className="bg-[#E6F1EB] text-[#0F533D] text-sm font-semibold uppercase tracking-wide">
//                         <th className="px-2 py-3 border-b border-gray-200">#</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Faculty</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Program</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Course Title</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Course Code</th>
//                         <th className="px-2 py-3 border-b border-gray-200">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCourses.map((course, index) => (
//                         <tr key={course._id} className="text-center hover:bg-gray-50 text-sm">
//                           <td className="px-2 py-2">{index + 1}</td>
//                           <td className="px-2 py-2">{course.faculty}</td>
//                           <td className="px-2 py-2">
//                             <ul>
//                               {[course.program].flat().map((prog, i) => (
//                                 <li key={i}>• {prog}</li>
//                               ))}
//                             </ul>
//                           </td>
//                           <td className="px-2 py-2">
//                             <ul>
//                               {[course.courseTitle].flat().map((title, i) => (
//                                 <li key={i}>• {title}</li>
//                               ))}
//                             </ul>
//                           </td>
//                           <td className="px-2 py-2">
//                             <ul>
//                               {[course.courseCode].flat().map((code, i) => (
//                                 <li key={i}>• {code}</li>
//                               ))}
//                             </ul>
//                           </td>
//                           <td className="px-2 py-2 flex justify-center gap-2">
//                             <button onClick={() => handleEditClick(course._id)}>
//                               <FaEdit className="text-[#0F533D] hover:text-[#0B3F37]" />
//                             </button>
//                             <button onClick={() => handleDeleteClick(course)}>
//                               <FaTrash className="text-red-600 hover:text-red-800" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
//                 <DialogTitle className="text-red-700 font-bold">Confirm Delete</DialogTitle>
//                 <DialogContent className="text-gray-700">
//                   Are you sure you want to delete <strong>{selectedCourse?.courseTitle}</strong>? This action cannot be undone.
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={() => setDialogOpen(false)} color="inherit">
//                     Cancel
//                   </Button>
//                   <Button onClick={confirmDelete} color="error" variant="contained">
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>

//               {showEditModal && editCourseId && (
//                 <EditCourseModal
//                   courseId={editCourseId}
//                   onClose={() => setShowEditModal(false)}
//                   onSuccess={() => {
//                     axios.get(`${BASE_URL}/courses`).then((res) => {
//                       setCourses(res.data);
//                       setFilteredCourses(res.data);
//                     });
//                   }}
//                 />
//               )}

//               {showRegCourseModal && (
//                 <RegCourseModal
//                   onClose={() => setShowRegCourseModal(false)}
//                   onSuccess={() => {
//                     axios.get(`${BASE_URL}/courses`).then((res) => {
//                       setCourses(res.data);
//                       setFilteredCourses(res.data);
//                     });
//                   }}
//                 />
//               )}
//             </main>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider1>
//   );
// };

// export default AdminCourses;

import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import Header from "../../components/admin/Headerpop";
import Sidebar from "../../components/admin/SideBarpop";
import MobileMenu from "../../components/admin/MobileMenu";
import { SidebarProvider1 } from "../../components/admin/SidebarContext";
import EditCourseModal from "./EditCourseModal";
import RegCourseModal from "../modals/RegCourseModal";

// const BASE_URL = "http://localhost:3001/api/admin";
const BASE_URL = "http://localhost:3001/api/admin";


interface Course {
  _id: string;
  faculty: string;
  program: string;
  courseTitle: string[] | string;
  courseCode: string[] | string;
}

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showRegCourseModal, setShowRegCourseModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses`);
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((course) =>
        course.courseTitle.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, courses]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    try {
      await axios.delete(`${BASE_URL}/courses/${selectedCourse._id}`);
      setCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
      setFilteredCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
    } catch (err) {
      console.error("Error deleting course:", err);
    }
    setDialogOpen(false);
  };

  const handleEditClick = (id: string) => {
    setEditCourseId(id);
    setShowEditModal(true);
  };

  return (
    <SidebarProvider1>
      <div className="font-['Roboto']">
        <div className="flex flex-col h-screen">
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            {!isMobile && <Sidebar />}
            {isMobile && (
              <>
                <div
                  className={`fixed inset-0 bg-black bg-opacity-50 z-[998] ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                  onClick={toggleMobileMenu}
                ></div>
                <MobileMenu isOpen={isMobileMenuOpen} />
              </>
            )}
            <main className="flex-1 p-5 bg-gray-50 overflow-y-auto">
              <div className="max-w-[1200px] mx-auto pt-20">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
                  <div className="flex gap-2">
                    <button
                      className="bg-[#0F533D] hover:bg-[#0B3F37] text-white font-medium py-2 px-4 rounded-md shadow min-w-[150px]"
                      onClick={() => setShowRegCourseModal(true)}
                    >
                      Add New Course
                    </button>

                    <label htmlFor="csvUpload" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow cursor-pointer min-w-[150px]">
                      Upload CSV
                    </label>
                    <input
                      id="csvUpload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const Papa = await import('papaparse');

                          Papa.parse(file, {
                            header: true,
                            skipEmptyLines: true,
                            complete: async function (results: any) {
                              const correctFieldMap: Record<string, string> = {
                                faculty: 'faculty',
                                program: 'program',
                                coursetitle: 'courseTitle',
                                coursecode: 'courseCode',
                              };

                              const rawHeaders = results.meta.fields || [];
                              const fileHeaders = rawHeaders.map((h: string) => h.trim().toLowerCase());
                              const requiredHeaders = ['faculty', 'program', 'coursetitle', 'coursecode'];
                              const missingHeaders = requiredHeaders.filter((h) => !fileHeaders.includes(h));

                              if (missingHeaders.length > 0) {
                                alert(
                                  `Missing required headers: ${missingHeaders.join(", ")}\n\nYour CSV headers: ${fileHeaders.join(", ")}`
                                );
                                return;
                              }

                              const normalizedData = results.data.map((row: any) => {
                                const normalizedRow: any = {};
                                for (const key in row) {
                                  const lowerKey = key.trim().toLowerCase();
                                  const correctKey = correctFieldMap[lowerKey];
                                  if (correctKey) {
                                    normalizedRow[correctKey] = row[key];
                                  }
                                }
                                return normalizedRow;
                              });

                              try {
                                await axios.post(`${BASE_URL}/bulk-create-courses`, {
                                  courses: normalizedData,
                                });

                                const res = await axios.get(`${BASE_URL}/courses`);
                                setCourses(res.data);
                                setFilteredCourses(res.data);
                                alert('CSV upload successful.');
                              } catch (error: any) {
                                alert(error.response?.data?.message || 'CSV upload failed.');
                              }
                            },
                            error: function () {
                              alert('Failed to parse CSV.');
                            },
                          });
                        }catch (error: any) {
                            console.error('Upload error:', error); // ADD THIS
                            alert(
                              error.response?.data?.message ||
                              error.message ||
                              'CSV upload failed.'
                            );
                          }
                          
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Search by course title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-[300px] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F533D]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden">
                    <thead>
                      <tr className="bg-[#E6F1EB] text-[#0F533D] text-sm font-semibold uppercase tracking-wide">
                        <th className="px-2 py-3 border-b border-gray-200">#</th>
                        <th className="px-2 py-3 border-b border-gray-200">Faculty</th>
                        <th className="px-2 py-3 border-b border-gray-200">Program</th>
                        <th className="px-2 py-3 border-b border-gray-200">Course Title</th>
                        <th className="px-2 py-3 border-b border-gray-200">Course Code</th>
                        <th className="px-2 py-3 border-b border-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course, index) => (
                        <tr key={course._id} className="text-center hover:bg-gray-50 text-sm">
                          <td className="px-2 py-2">{index + 1}</td>
                          <td className="px-2 py-2">{course.faculty}</td>
                          <td className="px-2 py-2">
                            <ul>
                              {[course.program].flat().map((prog, i) => (
                                <li key={i}>• {prog}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-2 py-2">
                            <ul>
                              {[course.courseTitle].flat().map((title, i) => (
                                <li key={i}>• {title}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-2 py-2">
                            <ul>
                              {[course.courseCode].flat().map((code, i) => (
                                <li key={i}>• {code}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-2 py-2 flex justify-center gap-2">
                            <button onClick={() => handleEditClick(course._id)}>
                              <FaEdit className="text-[#0F533D] hover:text-[#0B3F37]" />
                            </button>
                            <button onClick={() => handleDeleteClick(course)}>
                              <FaTrash className="text-red-600 hover:text-red-800" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle className="text-red-700 font-bold">Confirm Delete</DialogTitle>
                <DialogContent className="text-gray-700">
                  Are you sure you want to delete <strong>{selectedCourse?.courseTitle}</strong>? This action cannot be undone.
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

              {showEditModal && editCourseId && (
                <EditCourseModal
                  courseId={editCourseId}
                  onClose={() => setShowEditModal(false)}
                  onSuccess={() => {
                    axios.get(`${BASE_URL}/courses`).then((res) => {
                      setCourses(res.data);
                      setFilteredCourses(res.data);
                    });
                  }}
                />
              )}

              {showRegCourseModal && (
                <RegCourseModal
                  onClose={() => setShowRegCourseModal(false)}
                  onSuccess={() => {
                    axios.get(`${BASE_URL}/courses`).then((res) => {
                      setCourses(res.data);
                      setFilteredCourses(res.data);
                    });
                  }}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider1>
  );
};

export default AdminCourses;


