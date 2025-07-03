import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

function JoinViewer() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const courseId = localStorage.getItem('courseId');
    if (courseId) {
      setRoomId(courseId);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/view/${roomId.trim()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-[#10211f] rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#edf2f7] mb-4 text-center">CIU Exam Monitoring System</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 rounded-md bg-[#3d5754] text-[#edf2f7] border border-[#2d3748] focus:ring-2 focus:ring-[#4fddc8]"
          required
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-[#48bb78] hover:bg-[#38a169] text-white p-2 rounded-md"
        >
          <Eye className="w-5 h-5 mr-2" />
          Invigilate Exam
        </button>
      </form>
    </div>
  );
}

export default JoinViewer;
