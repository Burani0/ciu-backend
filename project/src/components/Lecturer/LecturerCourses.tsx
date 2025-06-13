// import React, { useState, useEffect } from "react";
// import Header from "../Lecturer/Headerpop";
// import Sidebar from "../Lecturer/Sidebarpop";
// import MobileMenu from "../Lecturer/MobileMenu";
// import { useNavigate } from "react-router-dom";
// import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

// interface User {
//   id: string;
//   faculty: string;
//   program: string;
//   courseTitle: string;
//   courseCode: string;
// }

// function Table({ children }: { children: React.ReactNode }) {
//   return (
//     <table className="w-full border-collapse mt-5 bg-white shadow-lg border-none">
//       {children}
//     </table>
//   );
// }

// function TableHead({ cols }: { cols: string[] }) {
//   return (
//     <thead>
//       <tr>
//         {cols.map((colName, index) => (
//           <th
//             scope="col"
//             key={index}
//             className="bg-[#E6F1EB] text-[#106053] px-4 py-3 text-center font-bold uppercase shadow"
//           >
//             {colName}
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// }

// function TableBody({ children }: { children: React.ReactNode }) {
//   return <tbody>{children}</tbody>;
// }

// function UserList({ users }: { users: User[] }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState(users);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const filtered = users.filter((user) =>
//       user.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [searchTerm, users]);

//   const cols = ["#", "Faculty", "Program", "Course Name", "Course Code"];

//   return (
//     <div>
//       <div className="flex justify-between items-center py-5">
//         <button
//           className="bg-[#0F533D] text-white px-6 py-3 text-base ml-[500px]"
//           onClick={() => navigate("/lect-courses")}
//         >
//           Search Courses
//         </button>
//         <input
//           type="text"
//           placeholder="Search by course name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-4 py-3 border border-gray-300 rounded text-base w-[300px] text-gray-600"
//         />
//       </div>

//       <h2 className="text-2xl font-semibold text-center text-[#0F533D] mb-4">Assigned Courses</h2>

//       <Table>
//         <TableHead cols={cols} />
//         <TableBody>
//           {filteredUsers.map((user, index) => (
//             <tr key={user.id} className="hover:bg-gray-100">
//               <th
//                 scope="row"
//                 className="px-4 py-3 text-center border-b border-gray-300"
//               >
//                 {index + 1}
//               </th>
//               <td className="px-4 py-3 text-center border-b border-gray-300">{user.faculty}</td>
//               <td className="px-4 py-3 text-center border-b border-gray-300">{user.program}</td>
//               <td className="px-4 py-3 text-center border-b border-gray-300">{user.courseTitle}</td>
//               <td className="px-4 py-3 text-center border-b border-gray-300">{user.courseCode}</td>
//             </tr>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// function LectCourses() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   useEffect(() => {
//     fetch("http://localhost:3001/api/admin/courses")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const mappedData = data.map((course: any) => ({
//           id: course._id,
//           faculty: course.faculty,
//           program: course.program,
//           courseTitle: course.courseTitle,
//           courseCode: course.courseCode,
//         }));
//         setUsers(mappedData);
//       })
//       .catch((error) => console.error("Error fetching users:", error));
//   }, []);

//   return (
//     <SidebarProvider2>
//       <div className="flex flex-col h-screen w-[1230px]">
//         <div className="flex-1">
//           <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//           <div className="flex">
//             {!isMobile && <Sidebar />}
//             {isMobile && (
//               <MobileMenu
//                 isOpen={isMobileMenuOpen}
//                 toggleMenu={toggleMobileMenu}
//               />
//             )}
//             <div className="flex-1 p-5 overflow-y-auto">
//               <div className="pt-5 flex justify-center">
//                 <UserList users={users} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider2>
//   );
// }

// export default LectCourses;

// import React, { useState, useEffect } from "react";
// import Header from "../Lecturer/Headerpop";
// import Sidebar from "../Lecturer/Sidebarpop";
// import MobileMenu from "../Lecturer/MobileMenu";
// import { useNavigate } from "react-router-dom";
// import { SidebarProvider2 } from "../Lecturer/SidebarContext2";

// interface User {
//   id: string;
//   faculty: string;
//   program: string;
//   courseTitle: string;
//   courseCode: string;
// }

// function Table({ children }: { children: React.ReactNode }) {
//   return (
//     <table className="w-full border-collapse mt-5 bg-white shadow-lg border-none rounded-md overflow-hidden">
//       {children}
//     </table>
//   );
// }

// function TableHead({ cols }: { cols: string[] }) {
//   return (
//     <thead>
//       <tr>
//         {cols.map((colName, index) => (
//           <th
//             key={index}
//             className="bg-[#E6F1EB] text-[#106053] px-4 py-3 text-center font-bold uppercase"
//           >
//             {colName}
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// }

// function TableBody({ children }: { children: React.ReactNode }) {
//   return <tbody>{children}</tbody>;
// }

// function UserList({ users }: { users: User[] }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState(users);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const filtered = users.filter((user) =>
//       user.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [searchTerm, users]);

//   const cols = ["#", "Faculty", "Program", "Course Name", "Course Code"];

//   return (
//     <div className="flex flex-col items-center w-full pt-8">
//       <div className="flex justify-between items-center w-[90%] mb-4">
//         <h2 className="text-xl font-semibold text-[#0F533D]">Assigned Courses</h2>
//         <div className="flex gap-4 items-center">
//           <button
//             className="bg-[#0F533D] text-white px-5 py-2 text-sm rounded"
//             onClick={() => navigate("/lect-courses")}
//           >
//             Search Courses
//           </button>
//           <input
//             type="text"
//             placeholder="Search by course name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded text-sm w-[250px] text-gray-600"
//           />
//         </div>
//       </div>

//       <div className="w-full max-w-6xl">
//         <Table>
//           <TableHead cols={cols} />
//           <TableBody>
//             {filteredUsers.map((user, index) => (
//               <tr key={user.id} className="hover:bg-gray-100">
//                 <th className="px-4 py-3 text-center border-b border-gray-300">
//                   {index + 1}
//                 </th>
//                 <td className="px-4 py-3 text-center border-b border-gray-300">{user.faculty}</td>
//                 <td className="px-4 py-3 text-center border-b border-gray-300">{user.program}</td>
//                 <td className="px-4 py-3 text-center border-b border-gray-300">{user.courseTitle}</td>
//                 <td className="px-4 py-3 text-center border-b border-gray-300">{user.courseCode}</td>
//               </tr>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

// function LectCourses() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   useEffect(() => {
//     fetch("http://localhost:3001/api/admin/courses")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const mappedData = data.map((course: any) => ({
//           id: course._id,
//           faculty: course.faculty,
//           program: course.program,
//           courseTitle: course.courseTitle,
//           courseCode: course.courseCode,
//         }));
//         setUsers(mappedData);
//       })
//       .catch((error) => console.error("Error fetching users:", error));
//   }, []);

//   return (
//     <SidebarProvider2>
//       <div className="flex flex-col h-screen w-full">
//         <div className="flex-1">
//           <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//           <div className="flex">
//             {!isMobile && <Sidebar />}
//             {isMobile && (
//               <MobileMenu
//                 isOpen={isMobileMenuOpen}
//                 toggleMenu={toggleMobileMenu}
//               />
//             )}
//             <div className="flex-1 p-5 overflow-y-auto">
//               <div className="pt-5 flex justify-center">
//                 <UserList users={users} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider2>
//   );
// }

// export default LectCourses;


// import React, { useState, useEffect } from "react";
// import Header from "../Lecturer/Headerpop";
// import Sidebar from "../Lecturer/Sidebarpop";
// import MobileMenu from "../Lecturer/MobileMenu";
// import { SidebarProvider2 } from "../Lecturer/SidebarContext2";

// interface Course {
//   _id: string;
//   faculty: string;
//   program: string;
//   courseTitle: string;
//   courseCode: string;
// }

// const LectCourses = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const lecturerId = localStorage.getItem('lecturerId');

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await fetch(`http://localhost:3001/api/lecturers/${lecturerId}`);
//         const data = await res.json();
//         setCourses(data.assignedCourses || []);
//       } catch (error) {
//         console.error("Failed to fetch lecturer courses", error);
//       }
//     };
//     if (lecturerId) fetchCourses();
//   }, [lecturerId]);

//   const filteredCourses = courses.filter((course) =>
//     course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <SidebarProvider2>
//       <div className="flex flex-col h-screen w-full">
//         <div className="flex-1">
//           <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//           <div className="flex">
//             {!isMobile && <Sidebar />}
//             {isMobile && (
//               <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
//             )}
//             <div className="flex-1 p-5 overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-[#0F533D]">Assigned Courses</h2>
//                 <input
//                   type="text"
//                   placeholder="Search by course title..."
//                   className="px-3 py-2 border border-gray-300 rounded text-sm w-[250px] text-gray-600"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
//                 <thead>
//                   <tr>
//                     {["Faculty", "Program", "Course Title", "Course Code"].map((col, index) => (
//                       <th
//                         key={index}
//                         className="bg-[#E6F1EB] text-[#106053] px-4 py-3 text-center font-bold uppercase"
//                       >
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCourses.map((course) => (
//                     <tr key={course._id} className="text-center border-b hover:bg-gray-100">
//                       <td className="py-2">{course.faculty}</td>
//                       <td className="py-2">{course.program}</td>
//                       <td className="py-2">{course.courseTitle}</td>
//                       <td className="py-2">{course.courseCode}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider2>
//   );
// };

// export default LectCourses;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Lecturer/Headerpop";
import Sidebar from "../Lecturer/Sidebarpop";
import MobileMenu from "../Lecturer/MobileMenu";
import { SidebarProvider2 } from "../Lecturer/SidebarContext2";

interface Course {
  _id: string;
  faculty: string;
  program: string;
  courseTitle: string;
  courseCode: string;
}

const LectCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const lecturerId = localStorage.getItem('lecturerId');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!lecturerId) {
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/admin/lecturers/${lecturerId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCourses(data.assignedCourses || []);
      } catch (error) {
        console.error("Failed to fetch lecturer courses", error);
      }
    };

    fetchCourses();
  }, [lecturerId, navigate]);

  const filteredCourses = courses.filter((course) =>
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider2>
      <div className="flex flex-col h-screen w-full">
        <div className="flex-1">
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex">
            {!isMobile && <Sidebar />}
            {isMobile && (
              <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            )}
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#0F533D]">Assigned Courses</h2>
                <input
                  type="text"
                  placeholder="Search by course title..."
                  className="px-3 py-2 border border-gray-300 rounded text-sm w-[250px] text-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
                <thead>
                  <tr>
                    {["Faculty", "Program", "Course Title", "Course Code"].map((col, index) => (
                      <th
                        key={index}
                        className="bg-[#E6F1EB] text-[#106053] px-4 py-3 text-center font-bold uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="text-center border-b hover:bg-gray-100">
                      <td className="py-2">{course.faculty}</td>
                      <td className="py-2">{course.program}</td>
                      <td className="py-2">{course.courseTitle}</td>
                      <td className="py-2">{course.courseCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider2>
  );
};

export default LectCourses;
