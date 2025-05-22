import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Eye } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const handleJoinAsStreamer = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/exam/${roomId.trim()}`);
    }
  };

  const handleJoinAsViewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/view/${roomId.trim()}`);
    }
  };

  return (
<div className="max-w-4xl mx-auto mt-10 p-6">
<div className="bg-[#10211f] rounded-xl shadow-md p-8">
  <h1 className="text-3xl font-bold text-[#edf2f7] mb-6 text-center">
    Welcome to ProctorStream
  </h1>

  <div className="mb-8">
    <p className="text-[#a0aec0] text-center">
      Enter a room ID to start or join a proctoring session
    </p>
  </div>

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
        Join as Streamer
      </button>

      <button
        onClick={handleJoinAsViewer}
        className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#48bb78] hover:bg-[#38a169]"
      >
        <Eye className="h-5 w-5 mr-2" />
        Join as Viewer
      </button>
    </div>
  </form>
</div>
</div>
);
}

export default Home;