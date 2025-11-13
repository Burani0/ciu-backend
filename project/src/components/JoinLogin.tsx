import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiSolidUserRectangle } from "react-icons/bi";
import { FaLock, FaUser } from "react-icons/fa";

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<"admin" | "student">("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [regNo, setRegNo] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  const handleAdminLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const adminResponse = await axios.post('http://localhost:3001/api/admin/admin-login', {
        username: identifier,
        password,
      });
      alert(adminResponse.data.message);
      // Pass the username to the cleartoken page
      return navigate('/cleartoken', { state: { username: identifier } });
    } catch {
      try {
        const lecturerResponse = await axios.post('http://localhost:3001/api/auth/login', {
          universityNumber: identifier,
          password,
        });
        alert(lecturerResponse.data.message);
        // Pass the university number as username to the verify-token page
        return navigate('/verify-token', { state: { username: identifier } });
      } catch {
        setErrorMessage('Invalid credentials for both admin and lecturer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!regNo.trim() || !academicYear.trim() || !semester.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const apiUrl = `https://ciu-backend.onrender.com/api/cleared-students?acad=${academicYear}&sem=${semester}`;
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
            `https://ciu-backend.onrender.com/api/cleared-students?acad=${academicYear}&sem=${semester}`
          );
          let clearedStudents = clearedRes.data;
          if (typeof clearedStudents === "string") {
            try { clearedStudents = JSON.parse(clearedStudents); } catch { clearedStudents = []; }
          }
          const matchedStudent = clearedStudents.find(
            (student: any) => student.RegistrationNo?.trim().toLowerCase() === regNo.trim().toLowerCase()
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
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response) {
        setErrorMessage(
          `Server Error: ${err.response.status} - ${err.response.statusText}`
        );
      } else if (err.message.includes("Network Error")) {
        setErrorMessage(
          "Network error: Please check your internet connection."
        );
      } else {
        setErrorMessage(err.message || "Unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
      <div className="relative w-[420px] bg-white text-[#106053]">
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

          <div className="flex items-center justify-center mb-6">
            <span className="text-sm mr-2">{loginMode === "admin" ? "Admin/Lecturer" : "Student"}</span>
            <button
              onClick={() => setLoginMode(loginMode === "admin" ? "student" : "admin")}
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
                loginMode === "admin" ? "bg-[#106053]" : "bg-gray-400"
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  loginMode === "admin" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {loginMode === "admin" ? (
            <>
              <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
                <input
                  type="text"
                  placeholder="Username / University Number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                />
                <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
              </div>

              <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#106053] hover:text-[#0b3f37]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                onClick={handleAdminLogin}
                disabled={isSubmitting}
                className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center"
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
            </>
          ) : (
            <form onSubmit={handleStudentLogin}>
              <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
                <input
                  type="text"
                  placeholder="Registration Number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                />
              </div>

              <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
                <input
                  type="text"
                  placeholder="Academic Year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                />
              </div>

              <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                >
                  <option value="" disabled>Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>

              <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#106053] hover:text-[#0b3f37]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center"
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
          )}

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