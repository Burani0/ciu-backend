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
      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome to ProctorStream
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-300 text-center">
            Enter a room ID to start or join a proctoring session
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter room ID"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleJoinAsStreamer}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Camera className="h-5 w-5 mr-2" />
              Join as Streamer
            </button>

            <button
              onClick={handleJoinAsViewer}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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