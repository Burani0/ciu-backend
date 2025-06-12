// import { useState, useEffect, FC } from 'react';
// import Header from '../../components/admin/Headerpop';
// import Sidebar from '../../components/admin/SideBarpop';
// import MobileMenu from "../../components/admin/MobileMenu";
// import axios from 'axios';
// import { SidebarProvider1 } from '../../components/admin/SidebarContext'; // Adjust path to your Sidebar context file
// import DashboardCard from '../../components/admin/DashboardCard';

// interface CountResponse {
//   count: number;
// }

// const Dashboard: FC = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   const [studentCount, setStudentCount] = useState<number>(0);
//   const [programCount, setProgramCount] = useState<number>(0);
//   const [lecturerCount, setLecturerCount] = useState<number>(0);
//   const [courseCount, setCourseCount] = useState<number>(0);
//   const [courseUnitCount, setCourseUnitCount] = useState<number>(0);
//   const [ongoingAssessmentsCount, setOngoingAssessmentsCount] = useState<number>(0);
//   const [upcomingAssessmentsCount, setUpcomingAssessmentsCount] = useState<number>(0);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize();

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   useEffect(() => {
//     const fetchStudentCount = async () => {
//       try {
//         const response = await axios.get<CountResponse>('http://localhost:3000/students/count/students');
//         setStudentCount(response.data.count || 0);
//       } catch (error) {
//         console.error("Error fetching student count:", error);
//       }
//     };

//     const fetchProgramCount = async () => {
//       try {
//         const response = await axios.get<CountResponse>('http://localhost:3000/students/count/programs');
//         setProgramCount(response.data.count || 0);
//       } catch (error) {
//         console.error("Error fetching program count:", error);
//       }
//     };

//     const fetchLecturerCount = async () => {
//       try {
//         const response = await axios.get<number>('http://localhost:3000/lecturerReg/count');
//         setLecturerCount(response.data);
//       } catch (error) {
//         console.error("Error fetching lecturer count:", error);
//       }
//     };

//     const fetchCourseCount = async () => {
//       try {
//         const response = await axios.get<number>('http://localhost:3000/coursesAdd/count');
//         setCourseCount(response.data);
//       } catch (error) {
//         console.error("Error fetching course count:", error);
//       }
//     };

//     const fetchCourseUnitCount = async () => {
//       try {
//         const response = await axios.get<CountResponse>('http://localhost:3000/coursesAdd/units/count');
//         setCourseUnitCount(response.data.count);
//       } catch (error) {
//         console.error("Error fetching course unit count:", error);
//       }
//     };

//     const fetchOngoingAssessmentsCount = async () => {
//       try {
//         const response = await axios.get<number>('http://localhost:3000/exam-paper/ongoing');
//         setOngoingAssessmentsCount(response.data);
//       } catch (error) {
//         console.error("Error fetching ongoing assessments count:", error);
//       }
//     };

//     const fetchUpcomingAssessmentsCount = async () => {
//       try {
//         const response = await axios.get<number>('http://localhost:3000/exam-paper/upcoming');
//         setUpcomingAssessmentsCount(response.data);
//       } catch (error) {
//         console.error("Error fetching upcoming assessments count:", error);
//       }
//     };

//     fetchStudentCount();
//     fetchProgramCount();
//     fetchLecturerCount();
//     fetchCourseCount();
//     fetchCourseUnitCount();
//     fetchOngoingAssessmentsCount();
//     fetchUpcomingAssessmentsCount();
//   }, []);

//   return (
//     <div className="font-['Roboto'] m-0 p-0">
//         <SidebarProvider1>
//       <div className={`flex flex-col h-screen ${isMobileMenuOpen ? 'pointer-events-none' : ''}`}>
//         <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//         <div className="flex flex-1 overflow-scroll flex-col md:flex-row">
//           {!isMobile && <Sidebar />}
//           {isMobile && (
//             <>
//               <div
//                 className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[998] ${isMobileMenuOpen ? 'block' : 'hidden'}`}
//                 onClick={toggleMobileMenu}
//               ></div>
//               <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
//             </>
//           )}
//           <main className={`flex-1 overflow-auto text-[#105F53] p-6 md:p-4 ${isMobileMenuOpen ? 'opacity-50 transition-opacity duration-300 ease-in-out' : ''}`}>
//             <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
//             <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-1">
              
//               <DashboardCard title="Registered Lecturers" value={lecturerCount} icon="👨‍💻" />
//               <DashboardCard title="Registered Courses" value={courseCount} icon="📖" />
    
//               <DashboardCard title="Ongoing Exams/Assessments" value={ongoingAssessmentsCount} icon="📝" />
//               <DashboardCard title="Upcoming Exams/Assessments" value={upcomingAssessmentsCount} icon="📝" />
//             </div>
//           </main>
          
//         </div>
        
//       </div>
//       </SidebarProvider1>
//     </div>
    
//   );
// };

// export default Dashboard;

import { useState, useEffect, FC, ChangeEvent } from 'react';
import axios from 'axios';
import Header from '../../components/admin/Headerpop';
import Sidebar from '../../components/admin/SideBarpop';
import MobileMenu from '../../components/admin/MobileMenu';
import { SidebarProvider1 } from '../../components/admin/SidebarContext';
import DashboardCard from '../../components/admin/DashboardCard';

interface DashboardData {
  totalCourses: number;
  totalLecturers: number;
}

interface Log {
  _id?: string;
  universityNumber: string;
  loginTime: string;
}

const Dashboard: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCourses: 0,
    totalLecturers: 0,
  });

  const [logs, setLogs] = useState<Log[]>([]);
  const [filters, setFilters] = useState({ universityNumber: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Dashboard data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get<DashboardData>('http://localhost:3001/api/admin/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  // Logs fetch
  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/admin/login-logs', {
        params: filters,
        timeout: 10000,
      });
      setLogs(response.data);
    } catch (error: any) {
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

  useEffect(() => {
    fetchLogs();
  }, []);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="font-['Roboto'] m-0 p-0">
      <SidebarProvider1>
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
                <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
              </>
            )}
            <main className="flex-1 overflow-auto text-[#105F53] p-6 md:p-4">
              <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

              {/* Dashboard Cards */}
              <div className="flex flex-col md:flex-row gap-6 mb-10">
                <DashboardCard title="Registered Lecturers" value={dashboardData.totalLecturers} icon="👨‍💻" />
                <DashboardCard title="Registered Courses" value={dashboardData.totalCourses} icon="📖" />
              </div>

              {/* Logs Section */}
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
                    className={`px-2 py-1 rounded text-white text-base w-auto ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
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
                            <td colSpan={2} className="text-center py-6 text-gray-500">
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
      </SidebarProvider1>
    </div>
  );
};

export default Dashboard;
