import React, { useEffect, useRef, useState } from 'react';
import { Minimize2, Maximize2 } from 'lucide-react';
import { joinRoom, leaveRoom, onStream } from '../config/socket';
 // Tailwind or CSS module if converted

type Student = {
  id: number;
  name: string;
  roomId: string; // unique room per student
};

const students: Student[] = [
  { id: 1, name: 'Student 1', roomId: 'student-1' },
  { id: 2, name: 'Student 2', roomId: 'student-2' },
  { id: 3, name: 'Student 3', roomId: 'student-3' },
  { id: 4, name: 'Student 4', roomId: 'student-4' },
  { id: 5, name: 'Student 5', roomId: 'student-5' },
  { id: 6, name: 'Student 6', roomId: 'student-6' },
];

type VideoRefs = {
  [roomId: string]: React.RefObject<HTMLImageElement>;
};

const LecturerDashboard: React.FC = () => {
  const [minimized, setMinimized] = useState<{ [id: number]: boolean }>({});
  const videoRefs: VideoRefs = {};

  // Assign refs for each student's video element
  students.forEach((student) => {
    videoRefs[student.roomId] = useRef<HTMLImageElement>(null);
  });

  useEffect(() => {
    // Join each student's room
    students.forEach((student) => joinRoom(student.roomId));

    // Listen to all incoming streams
    onStream((data: { roomId: string; data: string }) => {
      const ref = videoRefs[data.roomId];
      if (ref && ref.current) {
        ref.current.src = data.data;
      }
    });

    // Cleanup on unmount
    return () => {
      students.forEach((student) => leaveRoom());
    };
  }, []);

  const toggleMinimize = (id: number) => {
    setMinimized((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Live Exam Monitoring</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className={`rounded-lg shadow-md border p-4 relative bg-white ${
              minimized[student.id] ? 'h-24 overflow-hidden' : 'h-auto'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">{student.name}</span>
              <button onClick={() => toggleMinimize(student.id)}>
                {minimized[student.id] ? <Maximize2 /> : <Minimize2 />}
              </button>
            </div>
            <div className="w-full bg-black aspect-video">
              <img
                ref={videoRefs[student.roomId]}
                alt={`${student.name}'s stream`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerDashboard;
