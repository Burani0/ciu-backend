import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Header from '../components/Lecturer/Headerpop';
import Sidebar from '../components/Lecturer/Sidebarpop';
import MobileMenu from '../components/Lecturer/MobileMenu';
import { SidebarProvider2 } from '../components/Lecturer/SidebarContext2';

const Notifications = () => {
  const [logs, setLogs] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
  window.addEventListener("resize", handleResize);
  handleResize();
  return () => window.removeEventListener("resize", handleResize);
}, []);


  useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    setLogs((prevLogs) =>
      prevLogs.filter((log) => now - log.displayedAt < 3 * 60 * 60 * 1000)
    );
  }, 60 * 1000); // check every 1 minute
  return () => clearInterval(interval);
}, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/exams/fetch_exam_logs');
       const logsWithTimestamp = response.data.map((log) => ({
      ...log,
      displayedAt: Date.now()
    }));

    setLogs(logsWithTimestamp);
  } catch (error) {
    setError('Failed to fetch logs');
  } finally {
    setLoading(false);
  }
};
   

  const filteredLogs = logs.filter((log) =>
    log.studentRegNo.toLowerCase().includes(filterText) ||
    log.examNo.toLowerCase().includes(filterText) ||
    log.courseId.toLowerCase().includes(filterText) ||
    log.logEntries.some((entry) =>
      entry.eventType.toLowerCase().includes(filterText) ||
      Object.values(entry.details).some((d) =>
        d?.toString().toLowerCase().includes(filterText)
      )
    )
  );

  // Get all individual log entries within last 3 hours, sort by timestamp, then take latest 30
  const getAllLogEntries = (logs) => {
    const now = Date.now();
    const threeHoursAgo = now - (3 * 60 * 60 * 1000); // 3 hours in milliseconds
    const allEntries = [];
    
    logs.forEach((log, logIndex) => {
      log.logEntries.forEach((entry, entryIndex) => {
        const entryTimestamp = entry.timestamp || log.timestamp || log.displayedAt || Date.now();
        const timestampMs = new Date(entryTimestamp).getTime();
        
        // Only include entries from the last 3 hours
        if (timestampMs >= threeHoursAgo) {
          allEntries.push({
            ...entry,
            studentRegNo: log.studentRegNo,
            examNo: log.examNo,
            courseId: log.courseId,
            logIndex,
            entryIndex,
            sortTimestamp: entryTimestamp
          });
        }
      });
    });
    
    // Sort by timestamp (newest first) and take only the latest 30
    return allEntries
      .sort((a, b) => new Date(b.sortTimestamp) - new Date(a.sortTimestamp))
      .slice(0, 30);
  };

  const latest30Entries = getAllLogEntries(filteredLogs);

  return (
    <SidebarProvider2>
      <div className="font-['Roboto'] m-0 p-0 bg-white min-h-screen text-black">
        <div className="flex flex-col h-screen">
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex flex-1 w-full overflow-hidden">
            {!isMobile && <Sidebar />}
            {isMobile && (
              <>
                <div
                  className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[998] ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                  onClick={toggleMobileMenu}
                ></div>
                <MobileMenu isOpen={isMobileMenuOpen} />
              </>
            )}
            <main className="flex-1 p-6 bg-gray-100">
              <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg mt-4">
                <h1 className="text-3xl font-bold mb-6 text-[#0F533D]">Notifications</h1>

                <div className="mt-4 text-sm text-gray-600">
                  <p></p>
                </div>

                

            {loading ? (
  <div className="text-center py-8">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <p className="mt-2 text-gray-600">Loading logs...</p>
  </div>
) : (
  <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 pb-4">
    {latest30Entries.length > 0 ? (
      latest30Entries.map((entry, index) => {
        // Choose color based on event type
        let bgClass = "bg-blue-100 border-blue-300 text-blue-800"; // default primary
        if (entry.eventType === "timer_update") bgClass = "bg-green-100 border-green-300 text-green-800";
        else if (entry.eventType === "security_violation") bgClass = "bg-red-100 border-red-300 text-red-800";
        else if (entry.eventType === "warning") bgClass = "bg-yellow-100 border-yellow-300 text-yellow-800";
        else if (entry.eventType === "info") bgClass = "bg-sky-100 border-sky-300 text-sky-800";

        let message = `Student with registration number ${entry.studentRegNo} doing Exam No: ${entry.examNo} with Course ID: ${entry.courseId}`;

        if (entry.eventType === "timer_update" && entry.details.remainingTime) {
          message += ` has ${entry.details.remainingTime} left.`;
        } else if (entry.eventType === "security_violation" && entry.details.violationType) {
          message += ` has a security violation of ${entry.details.violationType.replace("_", " ")}.`;
        }

        return (
          <div
            key={`latest-${index}`}
            className={`${bgClass} border rounded p-3 shadow-sm flex-shrink-0`}
          >
            <p className="text-sm font-medium">{message}</p>
            {entry.sortTimestamp && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(entry.sortTimestamp).toLocaleString()}
              </p>
            )}
          </div>
        );
      })
    ) : (
      <p className="text-center text-gray-500">No notifications found in the last 3 hours.</p>
    )}
  </div>
)}

                <div className="mt-4 text-sm text-gray-600">
                  <p>Displaying: {latest30Entries.length} notifications</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider2>
  );
};

export default Notifications;