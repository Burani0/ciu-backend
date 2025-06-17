import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { BiSolidUserRectangle } from "react-icons/bi";
import { FaLock, FaUser } from "react-icons/fa";


const StudentLogin = () => {
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState("Student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const adminResponse = await axios.post('https://ciu-backend.onrender.com/api/admin/admin-login', {
        username: identifier,
        password,
      });
      alert(adminResponse.data.message);
      return navigate('/cleartoken');
    } catch {
      try {
        const lecturerResponse = await axios.post('https://ciu-backend.onrender.com/api/auth/login', {
          universityNumber: identifier,
          password,
        });
        alert(lecturerResponse.data.message);
        return navigate('/verify-token');
      } catch {
        setErrorMessage('Invalid credentials for both admin and lecturer.');
      }
    }
  };

  return (
    <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
      <div className="relative w-[420px] h-[600px] bg-white text-[#106053]">
        <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6] text-white">
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
            />
            <FaLock className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
          </div>

          <button
            onClick={handleLogin}
            className="w-full h-[45px] bg-[#106053] text-white border-none outline-none cursor-pointer text-[16px] font-bold hover:bg-[#0b3f37]"
          >
            Login
          </button>

          {errorMessage && (
            <p className="text-red-600 font-bold mt-2 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;


