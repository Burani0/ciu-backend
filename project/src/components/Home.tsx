
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const examLink = localStorage.getItem("currentExamFullLink");
    const examName = localStorage.getItem("currentExamName");
    const examID = localStorage.getItem("currentExamID");
    const studentRegNo = localStorage.getItem("studentRegNo");
    const examNo = localStorage.getItem("currentExamNo");
    const examDuration = localStorage.getItem("currentExamDuration");

    // Log stored values to confirm
    console.log("Home Page - Stored in localStorage:");
    console.log("currentExamName:", examName);
    console.log("currentExamID:", examID);
    console.log("studentRegNo:", studentRegNo);
    console.log("currentExamNo:", examNo);
    console.log("currentExamFullLink:", examLink);
    console.log("currentExamDuration:", examDuration);

    // Set roomId using currentExamID as primary, fallback to ExamNo from examLink
    if (examID && examID.trim()) {
      setRoomId(examID.trim());
    } else if (examLink) {
      const match = examLink.match(/ExamNo=([\w-]+)/);
      if (match && match[1]) {
        setRoomId(match[1]);
      } else {
        setError("Invalid exam link format. Cannot extract ExamNo.");
      }
    } else {
      setError("No exam link or exam ID found in localStorage.");
    }
  }, []);

  const handleJoinAsStreamer = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      // Re-log values before navigation
      const examName = localStorage.getItem("currentExamName");
      const examID = localStorage.getItem("currentExamID");
      const studentRegNo = localStorage.getItem("studentRegNo");
      const examNo = localStorage.getItem("currentExamNo");
      const examLink = localStorage.getItem("currentExamFullLink");
      const examDuration = localStorage.getItem("currentExamDuration");

      console.log("Joining as Streamer - Stored in localStorage:");
      console.log("currentExamName:", examName);
      console.log("currentExamID:", examID);
      console.log("studentRegNo:", studentRegNo);
      console.log("currentExamNo:", examNo);
      console.log("currentExamFullLink:", examLink);
      console.log("currentExamDuration:", examDuration);

      navigate(`/exam/${roomId.trim()}`);
    } else {
      setError("Please ensure a valid Room ID is available.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-[#10211f] rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#edf2f7] mb-6 text-center">
          CIU Exam Mornitoring System
        </h1>

        <div className="mb-8">
          <p className="text-[#a0aec0] text-center">
            
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <form className="space-y-6 mt-6">
          <div>
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-[#a0aec0] mb-1"
            >
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="mt-1 block w-full rounded-md bg-[#3d5754] border border-[#2d3748] text-[#edf2f7] p-2 focus:border-[#4fddc8] focus:outline-none focus:ring-2 focus:ring-[#4fddc8]"
              placeholder="Enter room ID"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={handleJoinAsStreamer}
              className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#6366f1] hover:bg-[#4c51bf]"
            >
              <Camera className="h-5 w-5 mr-2" />
              Join Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;