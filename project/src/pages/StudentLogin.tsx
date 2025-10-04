// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { BiSolidUserRectangle } from "react-icons/bi";
// import { FaLock } from "react-icons/fa";
// import axios from "axios";

// export default function Login(): JSX.Element {
//   const navigate = useNavigate();

//   const [regNo, setRegNo] = useState("");
//   const [academicYear, setAcademicYear] = useState("");
//   const [semester, setSemester] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     if (!regNo.trim() || !academicYear.trim() || !semester.trim()) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     setIsSubmitting(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     const apiUrl = `https://eadmin.ciu.ac.ug/API/ClearedStudentsAPI.aspx?acad=${academicYear}&sem=${semester}`;

//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       let clearedStudents;
//       if (typeof response.data === "string") {
//         try {
//           clearedStudents = JSON.parse(response.data);
//         } catch (parseError) {
//           throw new Error("Unable to parse server response.");
//         }
//       } else {
//         clearedStudents = response.data;
//       }

//       if (!Array.isArray(clearedStudents)) {
//         throw new Error("Invalid data format received from the server.");
//       }

//       const studentCleared = clearedStudents.some((student: any) => {
//         const studentRegNo = student?.RegistrationNo?.trim().toLowerCase();
//         return studentRegNo === regNo.trim().toLowerCase();
//       });

//       if (studentCleared) {
//         setSuccessMessage("Login successful!");
//         localStorage.setItem("studentRegNo", regNo.trim());
//         localStorage.setItem("studentYear", academicYear.trim());
//         localStorage.setItem("studentSem", semester.trim());
//         // Fetch cleared students and store extra details for the logged-in student
//         try {
//           const clearedRes = await axios.get(
//             `https://eadmin.ciu.ac.ug/API/ClearedStudentsAPI.aspx?acad=${academicYear}&sem=${semester}`
//           );
//           let clearedStudents = clearedRes.data;
//           if (typeof clearedStudents === "string") {
//             try { clearedStudents = JSON.parse(clearedStudents); } catch { clearedStudents = []; }
//           }
//           const matchedStudent = clearedStudents.find(
//             (student: any) => student.RegistrationNo?.trim().toLowerCase() === regNo.trim().toLowerCase()
//           );
//           if (matchedStudent) {
//             localStorage.setItem("StudyYear", matchedStudent.StudyYear || "");
//             localStorage.setItem("Semester", matchedStudent.Semester || "");
//             localStorage.setItem("AcademicYear", matchedStudent.AcademicYear || "");
//             localStorage.setItem("StudentName", matchedStudent.StudentName || "");
//           }
//         } catch (error) {
//           console.error("API Error fetching cleared students:", error);
//         }
//         setTimeout(() => {
//           navigate("/ExamInterface", {
//             state: {
//               regNo: regNo.trim(),
//               academicYear: academicYear.trim(),
//               semester: semester.trim(),
//             },
//           });
//         }, 1000);
//       } else {
//         setErrorMessage("Registration number not found or not cleared.");
//       }
//     } catch (err: any) {
//       console.error("Login error:", err);

//       if (err.response) {
//         setErrorMessage(
//           `Server Error: ${err.response.status} - ${err.response.statusText}`
//         );
//       } else if (err.message.includes("Network Error")) {
//         setErrorMessage(
//           "Network error: Please check your internet connection."
//         );
//       } else {
//         setErrorMessage(err.message || "Unexpected error occurred.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
//       <div className="relative w-[420px] h-[620px] bg-white text-[#106053]">
//         <div className="grid place-items-center w-full h-[185px] bg-[#106053] text-white">
//           <h1 className="text-[30px] text-center">ONLINE EXAMINATION SYSTEM</h1>
//         </div>

//         <div className="w-full p-10">
//           <form onSubmit={handleSubmit}>
//             <div className="flex justify-center mb-6">
//               <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
//                 <BiSolidUserRectangle className="text-[#106053]" size={42} />
//               </div>
//             </div>

//             <div className="mb-4">
//               <input
//                 type="text"
//                 required
//                 placeholder="Registration Number (e.g., 2023BBAFT-A10)"
//                 value={regNo}
//                 onChange={(e) => setRegNo(e.target.value)}
//                 className="w-full h-[50px] bg-[#ebebeb] rounded-[40px] px-[20px] text-black placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="mb-4">
//               <input
//                 type="text"
//                 required
//                 placeholder="Academic Year (e.g., 2024/2025)"
//                 value={academicYear}
//                 onChange={(e) => setAcademicYear(e.target.value)}
//                 className="w-full h-[50px] bg-[#ebebeb] rounded-[40px] px-[20px] text-black placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="mb-4">
//               <input
//                 type="number"
//                 required
//                 placeholder="Semester (e.g., 2)"
//                 value={semester}
//                 onChange={(e) => setSemester(e.target.value)}
//                 min="1"
//                 max="3"
//                 className="w-full h-[50px] bg-[#ebebeb] rounded-[40px] px-[20px] text-black placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#ebebeb] mb-8">
//               <input
//                 type="password"
//                 placeholder="Password (optional)"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
//               <FaLock className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
//             </div>

//             <div className="text-[14.5px] mb-4">
//               <label>
//                 <input type="checkbox" className="accent-white mr-1" /> Remember Me
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full h-[45px] bg-[#106053] text-white border-none outline-none cursor-pointer text-[16px] font-bold hover:bg-[#0b3f37] disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? "Logging in..." : "LOGIN"}
//             </button>

//             {errorMessage && (
//               <p className="text-red-600 font-bold mt-2 text-center text-sm">
//                 {errorMessage}
//               </p>
//             )}
//             {successMessage && (
//               <p className="text-green-600 font-bold mt-2 text-center text-sm">
//                 {successMessage}
//               </p>
//             )}

//             <div className="mt-5 mb-4 text-[14.5px] text-center">
//               <Link to="/reset-password" className="text-[#106053] hover:underline">
//                 Forgot Password?
//               </Link>
//               <span> or </span>
//               <Link to="/studenttoken-password-reset" className="text-[#106053] hover:underline">
//                 Set password using token
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { BiSolidUserRectangle } from "react-icons/bi";
// import { FaLock } from "react-icons/fa";
// import axios from "axios";

// export default function Login(): JSX.Element {
//   const navigate = useNavigate();

//   const [regNo, setRegNo] = useState("");
//   const [academicYear, setAcademicYear] = useState("");
//   const [semester, setSemester] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     if (!regNo.trim() || !academicYear.trim() || !semester.trim()) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     setIsSubmitting(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     const apiUrl = `https://eadmin.ciu.ac.ug/API/ClearedStudentsAPI.aspx?acad=${academicYear}&sem=${semester}`;

//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       let clearedStudents;
//       if (typeof response.data === "string") {
//         try {
//           clearedStudents = JSON.parse(response.data);
//         } catch (parseError) {
//           throw new Error("Unable to parse server response.");
//         }
//       } else {
//         clearedStudents = response.data;
//       }

//       if (!Array.isArray(clearedStudents)) {
//         throw new Error("Invalid data format received from the server.");
//       }

//       const studentCleared = clearedStudents.some((student: any) => {
//         const studentRegNo = student?.RegistrationNo?.trim().toLowerCase();
//         return studentRegNo === regNo.trim().toLowerCase();
//       });

//       if (studentCleared) {
//         setSuccessMessage("Login successful!");
//         localStorage.setItem("studentRegNo", regNo.trim());
//         localStorage.setItem("studentYear", academicYear.trim());
//         localStorage.setItem("studentSem", semester.trim());

//         try {
//           const clearedRes = await axios.get(apiUrl);
//           let clearedStudents = clearedRes.data;
//           if (typeof clearedStudents === "string") {
//             try { clearedStudents = JSON.parse(clearedStudents); } catch { clearedStudents = []; }
//           }
//           const matchedStudent = clearedStudents.find(
//             (student: any) => student.RegistrationNo?.trim().toLowerCase() === regNo.trim().toLowerCase()
//           );
//           if (matchedStudent) {
//             localStorage.setItem("StudyYear", matchedStudent.StudyYear || "");
//             localStorage.setItem("Semester", matchedStudent.Semester || "");
//             localStorage.setItem("AcademicYear", matchedStudent.AcademicYear || "");
//             localStorage.setItem("StudentName", matchedStudent.StudentName || "");
//           }
//         } catch (error) {
//           console.error("API Error fetching cleared students:", error);
//         }

//         setTimeout(() => {
//           navigate("/ExamInterface", {
//             state: {
//               regNo: regNo.trim(),
//               academicYear: academicYear.trim(),
//               semester: semester.trim(),
//             },
//           });
//         }, 1000);
//       } else {
//         setErrorMessage("Registration number not found or not cleared.");
//       }
//     } catch (err: any) {
//       console.error("Login error:", err);

//       if (err.response) {
//         setErrorMessage(`Server Error: ${err.response.status} - ${err.response.statusText}`);
//       } else if (err.message.includes("Network Error")) {
//         setErrorMessage("Network error: Please check your internet connection.");
//       } else {
//         setErrorMessage(err.message || "Unexpected error occurred.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
//       <div className="relative w-[420px] h-[680px] bg-white text-[#106053]">
//         <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6] text-white">
//           <img
//             src="/public/CIU-exam-system-logo.png"
//             alt="CIU Exam System Logo"
//             className="max-h-[120px] object-contain"
//           />
//         </div>

//         <div className="w-full p-10">
//           <form onSubmit={handleSubmit}>
//             <div className="flex justify-center mb-6">
//               <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
//                 <BiSolidUserRectangle className="text-[#106053]" size={42} />
//               </div>
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-4">
//               <input
//                 type="text"
//                 required
//                 placeholder="Registration Number (e.g., 2023BBAFT-A10)"
//                 value={regNo}
//                 onChange={(e) => setRegNo(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-4">
//               <input
//                 type="text"
//                 required
//                 placeholder="Academic Year (e.g., 2024/2025)"
//                 value={academicYear}
//                 onChange={(e) => setAcademicYear(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-4">
//               <input
//                 type="number"
//                 required
//                 min="1"
//                 max="3"
//                 placeholder="Semester (e.g., 2)"
//                 value={semester}
//                 onChange={(e) => setSemester(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="password"
//                 placeholder="Password (optional)"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
//               <FaLock className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full h-[45px] bg-[#106053] text-white border-none outline-none cursor-pointer text-[16px] font-bold hover:bg-[#0b3f37] disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? "Logging in..." : "LOGIN"}
//             </button>

//             {errorMessage && (
//               <p className="text-red-600 font-bold mt-2 text-center text-sm">
//                 {errorMessage}
//               </p>
//             )}
//             {successMessage && (
//               <p className="text-green-600 font-bold mt-2 text-center text-sm">
//                 {successMessage}
//               </p>
//             )}

//             <div className="mt-5 mb-4 text-[14.5px] text-center">
//               <Link to="/reset-password" className="text-[#106053] hover:underline">
//                 Forgot Password?
//               </Link>
//               <span> or </span>
//               <Link to="/studenttoken-password-reset" className="text-[#106053] hover:underline">
//                 Set password using token
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { BiSolidUserRectangle } from "react-icons/bi";
// import { FaLock } from "react-icons/fa";

// export default function StudentLogin(): JSX.Element {
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [regNo, setRegNo] = useState("");
//   const [academicYear, setAcademicYear] = useState("");
//   const [semester, setSemester] = useState("");

//   const handleStudentLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     if (!regNo.trim() || !academicYear.trim() || !semester.trim()) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     setIsSubmitting(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     const apiUrl = `https://ciu-backend.onrender.com/api/cleared-students?acad=${academicYear}&sem=${semester}`;
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       let clearedStudents;
//       if (typeof response.data === "string") {
//         try {
//           clearedStudents = JSON.parse(response.data);
//         } catch (parseError) {
//           throw new Error("Unable to parse server response.");
//         }
//       } else {
//         clearedStudents = response.data;
//       }

//       if (!Array.isArray(clearedStudents)) {
//         throw new Error("Invalid data format received from the server.");
//       }

//       const studentCleared = clearedStudents.some((student: any) => {
//         const studentRegNo = student?.RegistrationNo?.trim().toLowerCase();
//         return studentRegNo === regNo.trim().toLowerCase();
//       });

//       if (studentCleared) {
//         setSuccessMessage("Login successful!");
//         localStorage.setItem("studentRegNo", regNo.trim());
//         localStorage.setItem("studentYear", academicYear.trim());
//         localStorage.setItem("studentSem", semester.trim());
//         try {
//           const clearedRes = await axios.get(
//             `https://ciu-backend.onrender.com/api/cleared-students?acad=${academicYear}&sem=${semester}`
//           );
//           let clearedStudents = clearedRes.data;
//           if (typeof clearedStudents === "string") {
//             try { clearedStudents = JSON.parse(clearedStudents); } catch { clearedStudents = []; }
//           }
//           const matchedStudent = clearedStudents.find(
//             (student: any) => student.RegistrationNo?.trim().toLowerCase() === regNo.trim().toLowerCase()
//           );
//           if (matchedStudent) {
//             localStorage.setItem("StudyYear", matchedStudent.StudyYear || "");
//             localStorage.setItem("Semester", matchedStudent.Semester || "");
//             localStorage.setItem("AcademicYear", matchedStudent.AcademicYear || "");
//             localStorage.setItem("StudentName", matchedStudent.StudentName || "");
//           }
//         } catch (error) {
//           console.error("API Error fetching cleared students:", error);
//         }
//         setTimeout(() => {
//           navigate("/ExamInterface", {
//             state: {
//               regNo: regNo.trim(),
//               academicYear: academicYear.trim(),
//               semester: semester.trim(),
//             },
//           });
//         }, 1000);
//       } else {
//         setErrorMessage("Registration number not found or not cleared.");
//       }
//     } catch (err: any) {
//       console.error("Login error:", err);
//       if (err.response) {
//         setErrorMessage(
//           `Server Error: ${err.response.status} - ${err.response.statusText}`
//         );
//       } else if (err.message.includes("Network Error")) {
//         setErrorMessage(
//           "Network error: Please check your internet connection."
//         );
//       } else {
//         setErrorMessage(err.message || "Unexpected error occurred.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
//       <div className="relative w-[420px] bg-white text-[#106053]">
//         <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
//           <img
//             src="/public/CIU-exam-system-logo.png"
//             alt="CIU Exam System Logo"
//             className="max-h-[120px] object-contain"
//           />
//         </div>

//         <div className="w-full p-10">
//           <div className="flex justify-center mb-6">
//             <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
//               <BiSolidUserRectangle className="text-[#106053]" size={42} />
//             </div>
//           </div>

//           <form onSubmit={handleStudentLogin}>
//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="text"
//                 placeholder="Registration Number"
//                 value={regNo}
//                 onChange={(e) => setRegNo(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="text"
//                 placeholder="Academic Year"
//                 value={academicYear}
//                 onChange={(e) => setAcademicYear(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <select
//                 value={semester}
//                 onChange={(e) => setSemester(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               >
//                 <option value="" disabled>
//                   Select Semester
//                 </option>
//                 <option value="1">Semester 1</option>
//                 <option value="2">Semester 2</option>
//               </select>
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="password"
//                 placeholder="Password (optional)"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//               />
             
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     ></path>
//                   </svg>
//                   Logging in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>

//           {errorMessage && (
//             <p className="text-red-600 font-bold mt-2 text-center text-sm">{errorMessage}</p>
//           )}
//           {successMessage && (
//             <p className="text-green-600 font-bold mt-2 text-center text-sm">{successMessage}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }








// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { BiSolidUserRectangle } from "react-icons/bi";
// import { FaLock } from "react-icons/fa";

// export default function StudentLogin() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [regNo, setRegNo] = useState("");
//   const [academicYear, setAcademicYear] = useState("");
//   const [semester, setSemester] = useState("");
//   const [isChrome, setIsChrome] = useState(true);
//   const [tabsAcknowledged, setTabsAcknowledged] = useState(false);

//   // Check if instructions have been viewed and enforce Chrome
//   useEffect(() => {
//     if (!localStorage.getItem("instructionsViewed")) {
//       navigate("/instructions", { replace: true });
//     }

//     const userAgent = navigator.userAgent.toLowerCase();
//     const isChromeBrowser = /chrome/.test(userAgent) && !/edg|opr|samsungbrowser|ucbrowser/.test(userAgent);
//     setIsChrome(isChromeBrowser);
//     if (!isChromeBrowser) {
//       setErrorMessage("Please use Google Chrome to access the exam system.");
//     }
//   }, [navigate]);

//   const handleStudentLogin = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     if (!isChrome) {
//       setErrorMessage("Please use Google Chrome to access the exam system.");
//       return;
//     }
//     if (!tabsAcknowledged) {
//       setErrorMessage("Please acknowledge that all other tabs and programs are closed.");
//       return;
//     }
//     if (!regNo.trim() || !academicYear.trim() || !semester.trim()) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     setIsSubmitting(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     const apiUrl = `https://ciu-backend.onrender.com/api/cleared-students?acad=${academicYear}&sem=${semester}`;
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       let clearedStudents;
//       if (typeof response.data === "string") {
//         try {
//           clearedStudents = JSON.parse(response.data);
//         } catch (parseError) {
//           throw new Error("Unable to parse server response.");
//         }
//       } else {
//         clearedStudents = response.data;
//       }

//       if (!Array.isArray(clearedStudents)) {
//         throw new Error("Invalid data format received from the server.");
//       }

//       const studentCleared = clearedStudents.some((student) => {
//         const studentRegNo = student?.RegistrationNo?.trim().toLowerCase();
//         return studentRegNo === regNo.trim().toLowerCase();
//       });

//       if (studentCleared) {
//         setSuccessMessage("Login successful!");
//         localStorage.setItem("studentRegNo", regNo.trim());
//         localStorage.setItem("studentYear", academicYear.trim());
//         localStorage.setItem("studentSem", semester.trim());
//         try {
//           const clearedRes = await axios.get(
//             `https://ciu-backend.onrender.com/api/cleared-students?acad=${academicYear}&sem=${semester}`
//           );
//           let clearedStudents = clearedRes.data;
//           if (typeof clearedStudents === "string") {
//             try { clearedStudents = JSON.parse(clearedStudents); } catch { clearedStudents = []; }
//           }
//           const matchedStudent = clearedStudents.find(
//             (student) => student.RegistrationNo?.trim().toLowerCase() === regNo.trim().toLowerCase()
//           );
//           if (matchedStudent) {
//             localStorage.setItem("StudyYear", matchedStudent.StudyYear || "");
//             localStorage.setItem("Semester", matchedStudent.Semester || "");
//             localStorage.setItem("AcademicYear", matchedStudent.AcademicYear || "");
//             localStorage.setItem("StudentName", matchedStudent.StudentName || "");
//           }
//         } catch (error) {
//           console.error("API Error fetching cleared students:", error);
//         }
//         setTimeout(() => {
//           navigate("/ExamInterface", {
//             state: {
//               regNo: regNo.trim(),
//               academicYear: academicYear.trim(),
//               semester: semester.trim(),
//             },
//           });
//         }, 1000);
//       } else {
//         setErrorMessage("Registration number not found or not cleared.");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       if (err.response) {
//         setErrorMessage(
//           `Server Error: ${err.response.status} - ${err.response.statusText}`
//         );
//       } else if (err.message.includes("Network Error")) {
//         setErrorMessage(
//           "Network error: Please check your internet connection."
//         );
//       } else {
//         setErrorMessage(err.message || "Unexpected error occurred.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
//       <div className="relative w-[420px] bg-white text-[#106053] rounded-lg shadow-lg">
//         <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
//           <img
//             src="/public/CIU-exam-system-logo.png"
//             alt="CIU Exam System Logo"
//             className="max-h-[120px] object-contain"
//           />
//         </div>

//         <div className="w-full p-10">
//           <div className="flex justify-center mb-6">
//             <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
//               <BiSolidUserRectangle className="text-[#106053]" size={42} />
//             </div>
//           </div>

//           <form onSubmit={handleStudentLogin}>
//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="text"
//                 placeholder="Registration Number"
//                 value={regNo}
//                 onChange={(e) => setRegNo(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Registration Number"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="text"
//                 placeholder="Academic Year"
//                 value={academicYear}
//                 onChange={(e) => setAcademicYear(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Academic Year"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <select
//                 value={semester}
//                 onChange={(e) => setSemester(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Semester"
//               >
//                 <option value="" disabled>
//                   Select Semester
//                 </option>
//                 <option value="1">Semester 1</option>
//                 <option value="2">Semester 2</option>
//               </select>
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="password"
//                 placeholder="Password (optional)"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Password"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="flex items-center text-[16px] text-[#4f4e4e]">
//                 <input
//                   type="checkbox"
//                   checked={tabsAcknowledged}
//                   onChange={(e) => setTabsAcknowledged(e.target.checked)}
//                   className="mr-2"
//                 />
//                 I confirm all other tabs and programs are closed.
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting || !isChrome || !tabsAcknowledged}
//               className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center rounded-[40px]"
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     ></path>
//                   </svg>
//                   Logging in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>

//           {errorMessage && (
//             <p className="text-red-600 font-bold mt-2 text-center text-sm">{errorMessage}</p>
//           )}
//           {successMessage && (
//             <p className="text-green-600 font-bold mt-2 text-center text-sm">{successMessage}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { BiSolidUserRectangle } from "react-icons/bi";

// export default function StudentLogin() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [regNo, setRegNo] = useState("");
//   const [academicYear, setAcademicYear] = useState("");
//   const [semester, setSemester] = useState("");
//   const [isChrome, setIsChrome] = useState(true);
//   const [tabsAcknowledged, setTabsAcknowledged] = useState(false);
//   const [otherTabsDetected, setOtherTabsDetected] = useState(false);

//   // Check instructions, Chrome, and tab/program detection
//   useEffect(() => {
//     // Redirect if instructions not viewed
//     if (!localStorage.getItem("instructionsViewed")) {
//       navigate("/instructions", { replace: true });
//     }

//     // Chrome detection
//     const userAgent = navigator.userAgent.toLowerCase();
//     const isChromeBrowser = /chrome/.test(userAgent) && !/edg|opr|samsungbrowser|ucbrowser/.test(userAgent);
//     setIsChrome(isChromeBrowser);
//     if (!isChromeBrowser) {
//       setErrorMessage("Please use Google Chrome to access the exam system.");
//     }

//     // Tab and program detection using BroadcastChannel
//     const channel = new BroadcastChannel("exam_system_channel");
//     const tabId = `tab-${Date.now()}-${Math.random()}`;
//     let pingTimeout: NodeJS.Timeout;

//     // Send ping to check for other tabs
//     const sendPing = () => {
//       channel.postMessage({ type: "ping", tabId });
//       pingTimeout = setTimeout(() => {
//         if (!otherTabsDetected) {
//           setOtherTabsDetected(false); // No response means no other tabs
//           setErrorMessage(isChrome && tabsAcknowledged ? "" : isChrome ? "Please confirm all other tabs and programs are closed." : "Please use Google Chrome to access the exam system.");
//         }
//       }, 500); // 500ms timeout to detect no other tabs
//     };

//     // Listen for pings from other tabs
//     channel.onmessage = (event: MessageEvent) => {
//       if (event.data.type === "ping" && event.data.tabId !== tabId) {
//         clearTimeout(pingTimeout);
//         setOtherTabsDetected(true);
//         setErrorMessage("Please close all other tabs before proceeding.");
//         sendPing(); // Resend ping to keep detection active
//       }
//     };

//     // Initial ping
//     sendPing();

//     // Periodic ping to ensure continuous detection
//     const pingInterval = setInterval(sendPing, 1000);

//     // Detect window/tab switches
//     const handleBlur = () => {
//       setOtherTabsDetected(true);
//       setErrorMessage("Please close all other tabs or programs before proceeding.");
//     };

//     // Reset when window regains focus
//     const handleFocus = () => {
//       sendPing();
//     };

//     // Initial focus check
//     if (!document.hasFocus()) {
//       setOtherTabsDetected(true);
//       setErrorMessage("Please close all other tabs or programs before proceeding.");
//     }

//     window.addEventListener("blur", handleBlur);
//     window.addEventListener("focus", handleFocus);

//     // Debug logging
//     console.log("Initial state:", { isChrome, otherTabsDetected, tabsAcknowledged, errorMessage });
//     const debugState = () => console.log("State updated:", { isChrome, otherTabsDetected, tabsAcknowledged, errorMessage });
//     const stateListener = () => debugState();
//     document.addEventListener("visibilitychange", stateListener);

//     return () => {
//       clearInterval(pingInterval);
//       clearTimeout(pingTimeout);
//       window.removeEventListener("blur", handleBlur);
//       window.removeEventListener("focus", handleFocus);
//       channel.close();
//       document.removeEventListener("visibilitychange", stateListener);
//     };
//   }, [navigate, isChrome, tabsAcknowledged]);

//   const handleStudentLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     if (!isChrome) {
//       setErrorMessage("Please use Google Chrome to access the exam system.");
//       return;
//     }
//     if (otherTabsDetected) {
//       setErrorMessage("Please close all other tabs or programs before proceeding.");
//       return;
//     }
//     if (!tabsAcknowledged) {
//       setErrorMessage("Please confirm all other tabs and programs are closed.");
//       return;
//     }
//     if (!regNo.trim() || !academicYear.trim() || !semester.trim()) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     setIsSubmitting(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     const apiUrl = `http://localhost:3001/api/cleared-students?acad=${academicYear}&sem=${semester}`;
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       let clearedStudents;
//       if (typeof response.data === "string") {
//         try {
//           clearedStudents = JSON.parse(response.data);
//         } catch (parseError) {
//           throw new Error("Unable to parse server response.");
//         }
//       } else {
//         clearedStudents = response.data;
//       }

//       if (!Array.isArray(clearedStudents)) {
//         throw new Error("Invalid data format received from the server.");
//       }

//       const studentCleared = clearedStudents.some((student) => {
//         const studentRegNo = student?.RegistrationNo?.trim().toLowerCase();
//         return studentRegNo === regNo.trim().toLowerCase();
//       });

//       if (studentCleared) {
//         setSuccessMessage("Login successful!");
//         localStorage.setItem("studentRegNo", regNo.trim());
//         localStorage.setItem("studentYear", academicYear.trim());
//         localStorage.setItem("studentSem", semester.trim());
//         try {
//           const clearedRes = await axios.get(
//             `http://localhost:3001/api/cleared-students?acad=${academicYear}&sem=${semester}`
//           );
//           let clearedStudents = clearedRes.data;
//           if (typeof clearedStudents === "string") {
//             try { clearedStudents = JSON.parse(clearedStudents); } catch { clearedStudents = []; }
//           }
//           const matchedStudent = clearedStudents.find(
//             (student) => student.RegistrationNo?.trim().toLowerCase() === regNo.trim().toLowerCase()
//           );
//           if (matchedStudent) {
//             localStorage.setItem("StudyYear", matchedStudent.StudyYear || "");
//             localStorage.setItem("Semester", matchedStudent.Semester || "");
//             localStorage.setItem("AcademicYear", matchedStudent.AcademicYear || "");
//             localStorage.setItem("StudentName", matchedStudent.StudentName || "");
//           }
//         } catch (error) {
//           console.error("API Error fetching cleared students:", error);
//         }
//         setTimeout(() => {
//           navigate("/ExamInterface", {
//             state: {
//               regNo: regNo.trim(),
//               academicYear: academicYear.trim(),
//               semester: semester.trim(),
//             },
//           });
//         }, 1000);
//       } else {
//         setErrorMessage("Registration number not found or not cleared.");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       if (err.response) {
//         setErrorMessage(
//           `Server Error: ${err.response.status} - ${err.response.statusText}`
//         );
//       } else if (err.message.includes("Network Error")) {
//         setErrorMessage(
//           "Network error: Please check your internet connection."
//         );
//       } else {
//         setErrorMessage(err.message || "Unexpected error occurred.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
//       <div className="relative w-[420px] bg-white text-[#106053] rounded-lg shadow-lg">
//         <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
//           <img
//             src="/public/CIU-exam-system-logo.png"
//             alt="CIU Exam System Logo"
//             className="max-h-[120px] object-contain"
//           />
//         </div>

//         <div className="w-full p-10">
//           <div className="flex justify-center mb-6">
//             <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
//               <BiSolidUserRectangle className="text-[#106053]" size={42} />
//             </div>
//           </div>

//           <form onSubmit={handleStudentLogin}>
//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="text"
//                 placeholder="Registration Number"
//                 value={regNo}
//                 onChange={(e) => setRegNo(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Registration Number"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="text"
//                 placeholder="Academic Year"
//                 value={academicYear}
//                 onChange={(e) => setAcademicYear(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Academic Year"
//               />
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <select
//                 value={semester}
//                 onChange={(e) => setSemester(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Semester"
//               >
//                 <option value="" disabled>
//                   Select Semester
//                 </option>
//                 <option value="1">Semester 1</option>
//                 <option value="2">Semester 2</option>
//               </select>
//             </div>

//             <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
//               <input
//                 type="password"
//                 placeholder="Password (optional)"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
//                 aria-label="Password"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="flex items-center text-[16px] text-[#4f4e4e]">
//                 <input
//                   type="checkbox"
//                   checked={tabsAcknowledged}
//                   onChange={(e) => setTabsAcknowledged(e.target.checked)}
//                   className="mr-2"
//                 />
//                 I confirm all other tabs and programs are closed.
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting || !isChrome || otherTabsDetected || !tabsAcknowledged}
//               className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center rounded-[40px]"
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     ></path>
//                   </svg>
//                   Logging in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>

//           {errorMessage && (
//             <p className="text-red-600 font-bold mt-2 text-center text-sm">{errorMessage}</p>
//           )}
//           {successMessage && (
//             <p className="text-green-600 font-bold mt-2 text-center text-sm">{successMessage}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

























import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSolidUserRectangle } from "react-icons/bi";

export default function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regNo, setRegNo] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [isChrome, setIsChrome] = useState(true);

  // Check instructions and Chrome
  useEffect(() => {
    // Redirect if instructions not viewed
    if (!localStorage.getItem("instructionsViewed")) {
      navigate("/instructions", { replace: true });
    }

    // Chrome detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isChromeBrowser = /chrome/.test(userAgent) && !/edg|opr|samsungbrowser|ucbrowser/.test(userAgent);
    setIsChrome(isChromeBrowser);
    if (!isChromeBrowser) {
      setErrorMessage("Please use Google Chrome to access the exam system.");
    }

    // Debug logging
    console.log("Initial state:", { isChrome, errorMessage });
    const debugState = () => console.log("State updated:", { isChrome, errorMessage });
    const stateListener = () => debugState();
    document.addEventListener("visibilitychange", stateListener);

    return () => {
      document.removeEventListener("visibilitychange", stateListener);
    };
  }, [navigate, isChrome]);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!isChrome) {
      setErrorMessage("Please use Google Chrome to access the exam system.");
      return;
    }
    if (!regNo.trim() || !academicYear.trim() || !semester.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const apiUrl = `http://localhost:3001/api/cleared-students?acad=${academicYear}&sem=${semester}`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      let clearedStudents;
      if (typeof response.data === "string") {
        try {
          clearedStudents = JSON.parse(response.data);
        } catch (parseError) {
          throw new Error("Unable to parse server response.");
        }
      } else {
        clearedStudents = response.data;
      }

      if (!Array.isArray(clearedStudents)) {
        throw new Error("Invalid data format received from the server.");
      }

      const studentCleared = clearedStudents.some((student: any) => {
        const studentRegNo = student?.RegistrationNo?.trim().toLowerCase();
        return studentRegNo === regNo.trim().toLowerCase();
      });

      if (studentCleared) {
        setSuccessMessage("Login successful!");
        localStorage.setItem("studentRegNo", regNo.trim());
        localStorage.setItem("studentYear", academicYear.trim());
        localStorage.setItem("studentSem", semester.trim());
        try {
          const clearedRes = await axios.get(
            `http://localhost:3001/api/cleared-students?acad=${academicYear}&sem=${semester}`
          );
          let clearedStudents = clearedRes.data;
          if (typeof clearedStudents === "string") {
            try { clearedStudents = JSON.parse(clearedStudents); } catch { clearedStudents = []; }
          }
          const matchedStudent = clearedStudents.find(
            (student) => student.RegistrationNo?.trim().toLowerCase() === regNo.trim().toLowerCase()
          );
          if (matchedStudent) {
            localStorage.setItem("StudyYear", matchedStudent.StudyYear || "");
            localStorage.setItem("Semester", matchedStudent.Semester || "");
            localStorage.setItem("AcademicYear", matchedStudent.AcademicYear || "");
            localStorage.setItem("StudentName", matchedStudent.StudentName || "");
          }
        } catch (error) {
          console.error("API Error fetching cleared students:", error);
        }
        setTimeout(() => {
          navigate("/ExamInterface", {
            state: {
              regNo: regNo.trim(),
              academicYear: academicYear.trim(),
              semester: semester.trim(),
            },
          });
        }, 1000);
      } else {
        setErrorMessage("Registration number not found or not cleared.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as any).response;
        setErrorMessage(
          `Server Error: ${response.status} - ${response.statusText}`
        );
      } else if (typeof err === "object" && err !== null && "message" in err && typeof (err as any).message === "string" && (err as any).message.includes("Network Error")) {
        setErrorMessage(
          "Network error: Please check your internet connection."
        );
      } else {
        setErrorMessage((typeof err === "object" && err !== null && "message" in err) ? (err as any).message : "Unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
      <div className="relative w-[420px] bg-white text-[#106053] rounded-lg shadow-lg">
        <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
          <img
            src="/public/CIU-exam-system-logo.png"
            alt="CIU Exam System Logo"
            className="max-h-[120px] object-contain"
          />
        </div>

        <div className="w-full p-10">
          <div className="flex justify-center mb-6">
            <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
              <BiSolidUserRectangle className="text-[#106053]" size={42} />
            </div>
          </div>

          <form onSubmit={handleStudentLogin}>
            <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
              <input
                type="text"
                placeholder="Registration Number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                aria-label="Registration Number"
              />
            </div>

            <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
              <input
                type="text"
                placeholder="Academic Year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                aria-label="Academic Year"
              />
            </div>

            <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                aria-label="Semester"
              >
                <option value="" disabled>
                  Select Semester
                </option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
              <input
                type="password"
                placeholder="Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                aria-label="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isChrome}
              className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center rounded-[40px]"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {errorMessage && (
            <p className="text-red-600 font-bold mt-2 text-center text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 font-bold mt-2 text-center text-sm">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}