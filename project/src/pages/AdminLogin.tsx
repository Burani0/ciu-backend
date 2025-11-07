
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiSolidUserRectangle } from "react-icons/bi";
import { FaLock, FaUser } from "react-icons/fa";

export default function AdminLogin(): JSX.Element {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identifier, setIdentifier] = useState("");
 


  const handleAdminLogin = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const adminResponse = await axios.post('https://examiner.ciu.ac.ug/api/admin/admin-login', {
        username: identifier,
        password,
      });
      alert(adminResponse.data.message);
      return navigate('/cleartoken', { state: { username: identifier } });
    } catch {
      try {
        const lecturerResponse = await axios.post('https://examiner.ciu.ac.ug/api/auth/login', {
          universityNumber: identifier,
          password,
        });
        alert(lecturerResponse.data.message);
        return navigate('/verify-token', { state: { username: identifier } });
      } catch {
        setErrorMessage("Invalid credentials for both admin and lecturer.");
      }
    }
    setIsSubmitting(false);
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

          {errorMessage && (
            <p className="text-red-600 font-bold mt-2 text-center text-sm">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}