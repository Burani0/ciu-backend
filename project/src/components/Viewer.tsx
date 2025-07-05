import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket, joinRoom, leaveRoom, onStream, onRoomUpdate } from '../config/socket';
import { Monitor, ScrollText } from 'lucide-react';

interface StreamData {
  id: string;
  data: string;
  streamerId: string;
  timestamp: number;
}

interface StreamerInfo {
  streamerId: string;
  isActive: boolean;
}

interface RoomUpdate {
  streamerCount: number;
  streamers: StreamerInfo[];
}

function Viewer() {
  const { roomId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [streams, setStreams] = useState<Map<string, string>>(new Map());
  const [roomInfo, setRoomInfo] = useState<RoomUpdate | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Map<string, number>>(new Map());
  const [fitAll, setFitAll] = useState(true);
  const streamRefs = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    if (!roomId) {
      setError('Room ID is required');
      return;
    }

    joinRoom(roomId, 'viewer');

    onStream((streamData: StreamData) => {
      setStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.set(streamData.streamerId, streamData.data);
        return newStreams;
      });

      setLastUpdate(prev => {
        const newUpdate = new Map(prev);
        newUpdate.set(streamData.streamerId, streamData.timestamp);
        return newUpdate;
      });

      const imgElement = streamRefs.current.get(streamData.streamerId);
      if (imgElement) {
        imgElement.src = streamData.data;
      }
    });

    onRoomUpdate((data: RoomUpdate) => {
      setRoomInfo({
        streamerCount: data.streamerCount,
        streamers: Array.isArray(data.streamers) ? data.streamers : [],
      });

      setStreams(prev => {
        const newStreams = new Map(prev);
        const activeStreamerIds = new Set(data.streamers.map(s => s.streamerId));
        for (const [streamerId] of newStreams) {
          if (!activeStreamerIds.has(streamerId)) {
            newStreams.delete(streamerId);
            streamRefs.current.delete(streamerId);
          }
        }
        return newStreams;
      });
    });

    return () => {
      leaveRoom();
    };
  }, [roomId]);

  const setStreamRef = (streamerId: string) => (element: HTMLImageElement | null) => {
    if (element) {
      streamRefs.current.set(streamerId, element);
      const currentStream = streams.get(streamerId);
      if (currentStream) {
        element.src = currentStream;
      }
    } else {
      streamRefs.current.delete(streamerId);
    }
  };

  const getStreamStatus = (streamerId: string) => {
    const lastUpdateTime = lastUpdate.get(streamerId);
    if (!lastUpdateTime) return 'No Data';
    const timeDiff = Date.now() - lastUpdateTime;
    if (timeDiff > 5000) return 'Disconnected';
    if (timeDiff > 2000) return 'Poor Connection';
    return 'Active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Poor Connection': return '#FF9800';
      case 'Disconnected': return '#F44336';
      default: return '#757575';
    }
  };

  const toggleLayout = () => setFitAll(prev => !prev);

  return (
    <div style={{ padding: '20px' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#106053]">Live Viewer Dashboard</h1>
        <button
          onClick={toggleLayout}
          className="bg-[#106053] hover:bg-[#004d47] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {fitAll ? <ScrollText size={18} /> : <Monitor size={18} />}
          {fitAll ? 'Scroll Mode' : 'Fit All Mode'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {roomInfo && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3>Exam Statistics</h3>
          <p><strong>Active Students:</strong> {roomInfo.streamerCount}</p>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: fitAll 
          ? 'repeat(auto-fit, minmax(150px, 1fr))'
          : 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginTop: '20px',
        ...(fitAll ? {} : { maxHeight: '80vh', overflowY: 'auto' })
      }}>
        {(roomInfo?.streamers ?? []).map((streamerInfo) => {
          const status = getStreamStatus(streamerInfo.streamerId);
          return (
            <div key={streamerInfo.streamerId} style={{
              border: '2px solid #ddd',
              borderRadius: '12px',
              padding: fitAll ? '10px' : '15px',
              background: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h3 style={{ margin: 0, fontSize: fitAll ? '14px' : '18px' }}>
                  Student: {streamerInfo.streamerId}
                </h3>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: getStatusColor(status)
                }}>
                  {status}
                </span>
              </div>

              <div style={{ 
                width: '100%', 
                height: fitAll ? '150px' : '300px',
                background: '#000',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {streams.has(streamerInfo.streamerId) ? (
                  <img 
                    ref={setStreamRef(streamerInfo.streamerId)}
                    alt={`Stream from ${streamerInfo.streamerId}`}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: fitAll ? 'cover' : 'contain'
                    }}
                    onError={() => console.error(`Failed to load stream for ${streamerInfo.streamerId}`)}
                  />
                ) : (
                  <div style={{ 
                    color: '#fff', 
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    <p>Waiting for stream...</p>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid #333',
                      borderTop: '4px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '10px auto'
                    }}></div>
                  </div>
                )}
              </div>

              {!fitAll && (
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  color: '#666',
                  textAlign: 'center'
                }}>
                  {lastUpdate.has(streamerInfo.streamerId) && (
                    <p>Last Update: {new Date(lastUpdate.get(streamerInfo.streamerId)!).toLocaleTimeString()}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {roomInfo && roomInfo.streamerCount === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '2px dashed #ddd'
        }}>
          <h3 style={{ color: '#666' }}>No Active Students</h3>
          <p style={{ color: '#999' }}>Waiting for students to join the exam...</p>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Viewer;
