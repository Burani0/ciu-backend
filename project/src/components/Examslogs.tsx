import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from '../components/admin/Headerpop';
import Sidebar from '../components/admin/SideBarpop';
import MobileMenu from '../components/admin/MobileMenu';
import { SidebarProvider1 } from '../components/admin/SidebarContext';

const Examslogs = () => {
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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://ciu-backend.onrender.com/api/exams/fetch_exam_logs');
      setLogs(response.data);
    } catch (error) {
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setError('');
    try {
      const response = await axios.get(
        'https://ciu-backend.onrender.com/api/exams/fetch_exam_logs?download=true&format=pdf',
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exam_logs.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download PDF');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value.toLowerCase());
  };

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <SidebarProvider1>
      <div className="font-['Roboto'] m-0 p-0">
        <div className={`flex flex-col h-screen ${isMobileMenuOpen ? 'pointer-events-none' : ''}`}>
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex flex-1 overflow-scroll flex-col md:flex-row">
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
                <h1 className="text-3xl font-bold mb-6 text-[#0F533D]">Exam Activity Logs</h1>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filterText}
                    onChange={handleFilterChange}
                    className="border border-gray-300 p-2 rounded w-full sm:w-64"
                  />
                  <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white w-full sm:w-auto ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white w-full sm:w-auto ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    Download PDF
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading logs...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-md shadow-sm text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                          <th className="border px-4 py-2">Student Reg No</th>
                          <th className="border px-4 py-2">Exam No</th>
                          <th className="border px-4 py-2">Course ID</th>
                          <th className="border px-4 py-2">Log Entries</th>

                        </tr>
                      </thead>
                      <tbody>
  {filteredLogs.map((log, index) => (
    <tr key={index} className="hover:bg-gray-50 text-gray-800">
      <td className="border px-4 py-2">{log.studentRegNo}</td>
      <td className="border px-4 py-2">{log.examNo}</td>
      <td className="border px-4 py-2">{log.courseId}</td>
      <td className="border px-4 py-2 whitespace-pre-wrap">
        {log.logEntries.map((entry, i) => (
          <div key={i} className="mb-2">
            <div><strong>{i + 1}. Event Type:</strong> {entry.eventType}</div>
            {Object.entries(entry.details).map(([key, value]) => (
              <div key={key} className="ml-4">
                <strong>{key}:</strong> {key === 'timestamp' ? formatTimestamp(value) : value?.toString()}
              </div>
            ))}
          </div>
        ))}
      </td>
    </tr>
  ))}
  {filteredLogs.length === 0 && (
    <tr>
      <td colSpan={4} className="text-center py-6 text-gray-500">
        No matching logs found.
      </td>
    </tr>
  )}
</tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-600">
                  <p>Total logs: {filteredLogs.length}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider1>
  );
};

export default Examslogs;
