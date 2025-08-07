import { useEffect, useState } from 'react';
import { socket } from '../config/socket';

export default function Notifications() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('new-log-entry', (entry) => {
      setLogs((prev) => [entry, ...prev]);
    });

    return () => socket.off('new-log-entry');
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Real-Time Exam Logs</h1>
      <ul className="space-y-2">
        {logs.map((log, index) => (
          <li key={index} className="bg-white shadow p-4 rounded">
            <div className="text-sm font-semibold">{log.studentRegNo} - {log.examNo}</div>
            <div className="text-xs text-gray-600">{log.eventType} @ {new Date(log.timestamp).toLocaleTimeString()}</div>
            <pre className="text-xs mt-1">{JSON.stringify(log.details, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
