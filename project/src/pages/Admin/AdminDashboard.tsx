
import { useState, useEffect, FC } from 'react';
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

const Dashboard: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCourses: 0,
    totalLecturers: 0,
  });

  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [semester, setSemester] = useState('1');
  const [startDate, setStartDate] = useState('2025-06-09');
  const [timetable, setTimetable] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get<DashboardData>('https://examiner.ciu.ac.ug/api/admin/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  const fetchTimetable = async () => {
    if (!academicYear || !semester || !startDate) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const url = `https://examiner.ciu.ac.ug/api/exam-timetable?acadyr=${academicYear}&sem=${semester}&StartDate=${startDate}`;
      const response = await axios.get(url);
      setTimetable(response.data);
    } catch (err: any) {
      setError('Failed to fetch timetable');
      setTimetable([]);
    } finally {
      setLoading(false);
    }
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
                  className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[998] ${
                    isMobileMenuOpen ? 'block' : 'hidden'
                  }`}
                  onClick={toggleMobileMenu}
                ></div>
                <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
              </>
            )}
            <main className="flex-1 overflow-auto text-[#105F53] p-6 md:p-4">
              <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

              <div className="flex flex-col md:flex-row gap-6 mb-10">
                <DashboardCard title="Registered Lecturers" value={dashboardData.totalLecturers} icon="👨‍💻" />
                <DashboardCard title="Registered Courses" value={dashboardData.totalCourses} icon="📖" />
              </div>

              <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-4">
                <h1 className="text-3xl font-bold mb-6 text-[#0F533D]">Exam Timetable</h1>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Academic Year"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full sm:w-48"
                  />
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full sm:w-44"
                  />
                  <button
                    onClick={fetchTimetable}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0F533D] hover:bg-[#0D4735]'
                    }`}
                  >
                    {loading ? 'Loading...' : 'Fetch'}
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading timetable...</p>
                  </div>
                ) : timetable.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                          <th className="border px-4 py-3">Date</th>
                          <th className="border px-4 py-3">Course Code</th>
                          <th className="border px-4 py-3">Course Name</th>
                          <th className="border px-4 py-3">Start Time</th>
                          <th className="border px-4 py-3">End Time</th>
                          <th className="border px-4 py-3">Lecturer</th>
                          <th className="border px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.map((entry, index) => {
                          const start = new Date(`${entry.ExamDate} ${entry.StartTime}`);
                          const end = new Date(`${entry.ExamDate} ${entry.EndTime}`);
                          const now = new Date();

                          let status = '';
                          if (now < start) {
                            status = 'Upcoming';
                          } else if (now >= start && now <= end) {
                            status = 'Ongoing';
                          } else {
                            status = 'Complete';
                          }

                          return (
                            <tr key={index} className="hover:bg-gray-50 text-gray-800">
                              <td className="border px-4 py-2">{entry.ExamDate}</td>
                              <td className="border px-4 py-2">{entry.CourseCode}</td>
                              <td className="border px-4 py-2">{entry.CourseName}</td>
                              <td className="border px-4 py-2">{entry.StartTime}</td>
                              <td className="border px-4 py-2">{entry.EndTime}</td>
                              <td className="border px-4 py-2">{entry.LecturerName}</td>
                              <td className="border px-4 py-2 font-medium">
                                {status === 'Ongoing' && <span className="text-green-600">{status}</span>}
                                {status === 'Upcoming' && <span className="text-yellow-600">{status}</span>}
                                {status === 'Complete' && <span className="text-gray-500">{status}</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-4">No timetable data found.</p>
                )}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider1>
    </div>
  );
};

export default Dashboard;
