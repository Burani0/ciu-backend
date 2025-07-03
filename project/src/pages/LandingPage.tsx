import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="font-sans flex flex-col justify-center items-center min-h-screen bg-[#ebebeb] p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">ONLINE EXAMINATION SYSTEM</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl p-2 justify-items-center">
        <div className="grid grid-rows-[auto_1fr_auto] bg-white rounded-lg shadow-md text-center">
          <div className="flex justify-between items-center p-2 md:p-2">
            <p className="text-2xl md:text-[28px] font-bold text-gray-800">Administrator</p>
            <img src="\public\ciu-logo-2.png" alt="" className="w-[50px] md:w-[70px]" />
          </div>
          <div className="flex justify-center items-center">
            <img src="\public\Landing Page Admin Pic.png.jpeg" alt="Logo" className="w-4/5 md:w-[70%]" />
          </div>
          <Link
            to="/adminlogin"
            className="flex justify-center items-center w-full py-2 mt-1 font-bold text-[#105f53] bg-white hover:bg-[#105f53] hover:text-white transition"
          >
            Get Started
          </Link>
        </div>


        <div className="grid grid-rows-[auto_1fr_auto] bg-white rounded-lg shadow-md text-center">
          <div className="flex justify-between items-center p-2 md:p-2">
            <p className="text-2xl md:text-[28px] font-bold text-gray-800">Student</p>
            <img src="\public\ciu-logo-2.png" alt="" className="w-[50px] md:w-[70px]" />
          </div>
          <div className="flex justify-center items-center">
            <img src="\public\Landing Page Student Pic.png.jpeg" alt="Logo" className="w-4/5 md:w-[70%]" />
          </div>
          <Link
            to="/StudentLogin"
            className="flex justify-center items-center w-full py-2 mt-1 font-bold text-[#105f53] bg-white hover:bg-[#105f53] hover:text-white transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
