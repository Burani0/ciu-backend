
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket, joinRoom, leaveRoom, emitStream } from '../config/socket';

function Streamer() {
  const { roomId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startStreaming = async () => {
      try {
        if (!roomId) throw new Error('Room ID is required');
  
        joinRoom(roomId);
  
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
  
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
  
        // Use canvas for frame capture
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        const sendFrame = () => {
          if (videoRef.current && context) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
            const frameData = canvas.toDataURL('image/jpeg'); // Capture frame as Base64
            emitStream(frameData); // Send frame to server
          }
        };
  
        const interval = setInterval(sendFrame, 100); // Capture frames every 100ms
        return () => clearInterval(interval);
      } catch (err) {
        setError(err.message || 'Error accessing media devices');
      }
    };
  
    startStreaming();
  
    return () => {
      leaveRoom();
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [roomId]);
  return (
    <div>
      <h1>Streamer</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
}

export default Streamer;


