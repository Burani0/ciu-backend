import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

function JoinStreamer() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/exam/${roomId.trim()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-[#10211f] rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#edf2f7] mb-4 text-center">Join as Streamer</h2>
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
          className="w-full flex items-center justify-center bg-[#6366f1] hover:bg-[#4c51bf] text-white p-2 rounded-md"
        >
          <Camera className="w-5 h-5 mr-2" />
          Start Streaming
        </button>
      </form>
    </div>
  );
}

export default JoinStreamer;
