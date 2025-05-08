import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket, joinRoom, leaveRoom, onStream } from '../config/socket';

function Viewer() {
  const { roomId } = useParams();
  const imgRef= useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setError('Room ID is required');
      return;
    }

    // Join the room as viewer
    joinRoom(roomId);

    // Listen for video streams
    onStream((data: string) => {
      console.log("Received stream data:", data); // Debugging log
      if (imgRef.current) {
        imgRef.current.src = data; // Assign Base64 data to <img>
      }
    });
    return () => {
      // Cleanup on component unmount
      leaveRoom();
    };
  }, [roomId]);

  return (
    <div>
    <h1>Viewer</h1>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <img ref={imgRef} alt="Live Stream" />
  </div>
  );
}

export default Viewer;



