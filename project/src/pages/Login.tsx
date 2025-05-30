import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiSolidUserRectangle } from "react-icons/bi";
import { FaLock, FaUser } from "react-icons/fa";

export default function StudentLogin(): JSX.Element {
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState("Student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Simulated login logic
      if (identifier === "student123" && password === "password123") {
        setSuccessMessage("Login successful!");
        setTimeout(() => navigate("/exams"), 1000);
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
      <div className="relative w-[420px] h-[600px] bg-white text-[#106053]">
        <div className="grid place-items-center w-full h-[185px] bg-[#106053] text-white">
          <h1 className="text-[30px] text-center">ONLINE EXAMINATION SYSTEM</h1>
        </div>

        <div className="w-full p-10">
          <form onSubmit={handleSubmit}>
                <div className="flex justify-center mb-6">
        <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
          <BiSolidUserRectangle className="text-[#106053]" size={42} />
        </div>
      </div>
 

            <div className="relative w-full h-[50px] bg-[#ebebeb] mb-8">
              <input
                type="text"
                required
                placeholder="Reg No / Email / Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
              />
              <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
            </div>

            <div className="relative w-full h-[50px] bg-[#ebebeb] mb-8">
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
              />
              <FaLock className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
            </div>

            <div className="text-[14.5px] mb-4">
              <label>
                <input type="checkbox" className="accent-white mr-1" /> Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[45px] bg-[#106053] text-white border-none outline-none cursor-pointer text-[16px] font-bold hover:bg-[#0b3f37]"
            >
              LOGIN
            </button>

            {errorMessage && (
              <p className="text-red-600 font-bold mt-2 text-center">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-600 font-bold mt-2 text-center">{successMessage}</p>
            )}

            <div className="mt-5 mb-4 text-[14.5px] text-center">
              <Link to="/reset-password" className="text-[#106053] hover:underline">
                Forgot Password?
              </Link>
              <span> or </span>
              <Link to="/studenttoken-password-reset" className="text-[#106053] hover:underline">
                Set password using token
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
