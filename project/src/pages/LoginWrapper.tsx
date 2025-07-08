import React, { useState } from "react";
import StudentLogin from "./StudentLogin";
import Login from "./AdminLogin";

export default function UnifiedLoginWrapper(): JSX.Element {
  const [userType, setUserType] = useState<"student" | "lecturer">("student");

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setUserType("student")}
          className={`px-4 py-2 rounded-l ${
            userType === "student" ? "bg-[#106053] text-white" : "bg-gray-300 text-black"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setUserType("lecturer")}
          className={`px-4 py-2 rounded-r ${
            userType === "lecturer" ? "bg-[#106053] text-white" : "bg-gray-300 text-black"
          }`}
        >
          Lecturer / Admin
        </button>
      </div>

      {userType === "student" ? <StudentLogin /> : <Login />}
    </div>
  );
}
