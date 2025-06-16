import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../components/admin/Headerpop';
import Sidebar from '../components/admin/SideBarpop';
import MobileMenu from '../components/admin/MobileMenu';
import { SidebarProvider1 } from '../components/admin/SidebarContext';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ universityNumber: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/admin/login-logs', {
        params: filters,
        timeout: 10000
      });
      setLogs(response.data);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please check if the server is running.');
      } else if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setError('API endpoint not found.');
        } else {
          setError(`Server error: ${status} - ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        setError('Network error. Please check if the server is running.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const params = new URLSearchParams(filters);
      params.append('download', 'true');
      params.append('format', 'pdf');
      const downloadUrl = `http://localhost:3001/api/admin/login-logs?${params.toString()}`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      setError('Failed to download PDF');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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
              <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-4">
                <h1 className="text-3xl font-bold mb-6 text-[#0F533D]">Lecturer Login Logs</h1>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                  <input
                    type="text"
                    name="universityNumber"
                    placeholder="University Number"
                    value={filters.universityNumber}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded w-full sm:w-48"
                  />
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded w-full sm:w-44"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded w-full sm:w-44"
                  />
                  <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white w-full sm:w-auto ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {loading ? 'Loading...' : 'Search'}
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
                    <table className="w-full border border-gray-300 rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                          <th className="border px-4 py-3">University Number</th>
                          <th className="border px-4 py-3">Login Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, index) => (
                          <tr key={log._id || index} className="hover:bg-gray-50 text-gray-800">
                            <td className="border px-4 py-2">{log.universityNumber}</td>
                            <td className="border px-4 py-2">{new Date(log.loginTime).toLocaleString()}</td>
                          </tr>
                        ))}
                        {logs.length === 0 && !loading && (
                          <tr>
                            <td colSpan="2" className="text-center py-6 text-gray-500">
                              {error ? 'Failed to load logs.' : 'No logs found.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-600">
                  <p>Total logs: {logs.length}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider1>
  );
};

export default Logs;
