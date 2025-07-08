import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { joinRoom, leaveRoom, onStream, socket } from '../config/socket';
import { Monitor, ScrollText, Users } from 'lucide-react';

interface StreamData {
  streamerId: string;
  data: string;
  lastUpdated: number;
}

function Viewer() {
  const { roomId } = useParams();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fitAll, setFitAll] = useState(true);
  const [roomInfo, setRoomInfo] = useState({ viewerCount: 0, streamerCount: 0 });

  useEffect(() => {
    if (!roomId) {
      setError('Room ID is required');
      return;
    }

    joinRoom(roomId);

    onStream((streamData: { streamerId: string; data: string }) => {
      const { streamerId, data } = streamData;
      setStreams((prev) => {
        const existingIndex = prev.findIndex((stream) => stream.streamerId === streamerId);
        const newStream: StreamData = {
          streamerId,
          data,
          lastUpdated: Date.now(),
        };

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = newStream;
          return updated;
        } else {
          return [...prev, newStream];
        }
      });
    });

    socket.on('room-update', (data: { viewerCount: number; streamerCount: number }) => {
      setRoomInfo(data);
    });

    const cleanupInterval = setInterval(() => {
      setStreams((prev) => {
        const now = Date.now();
        return prev.filter((stream) => now - stream.lastUpdated < 10000);
      });
    }, 5000);

    return () => {
      leaveRoom();
      clearInterval(cleanupInterval);
      socket.off('room-update');
    };
  }, [roomId]);

  const toggleLayout = () => setFitAll((prev) => !prev);

  return (
    <div className="p-6 text-white bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#106053]">Live Viewer Dashboard</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-[#106053]">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{roomInfo.viewerCount} Invigilators</span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor size={16} />
              <span>{roomInfo.streamerCount} Students</span>
            </div>
          </div>
        </div>
        <button
          onClick={toggleLayout}
          className="bg-[#106053] hover:bg-[#004d47] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {fitAll ? <ScrollText size={18} /> : <Monitor size={18} />}
          {fitAll ? 'Scroll Mode' : 'Fit All Mode'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4 p-4 bg-red-100 rounded">
          {error}
        </div>
      )}

      {streams.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <Monitor size={48} className="mx-auto mb-4 opacity-50" />
          <p>No active sessions in this room</p>
          <p className="text-sm mt-2">Waiting for students to join...</p>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            fitAll ? 'auto-fit-grid' : 'scroll-grid max-h-[80vh] overflow-y-auto'
          }`}
          style={{
            gridTemplateColumns: fitAll
              ? 'repeat(auto-fit, minmax(300px, 1fr))'
              : 'repeat(auto-fill, 320px)',
          }}
        >
          {streams.map((stream) => (
            <div
              key={stream.streamerId}
              className="relative w-full bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-[#106053] text-white px-3 py-2 text-sm">
                <span className="font-medium">Student {stream.streamerId.slice(-6)}</span>
                <span className="ml-2 text-xs opacity-75">
                  {new Date(stream.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
              <div className="relative" style={{ paddingTop: '75%' }}>
                <img
                  src={stream.data}
                  alt={`Stream from ${stream.streamerId}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() =>
                    console.error('Image load error for stream:', stream.streamerId)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Viewer;
