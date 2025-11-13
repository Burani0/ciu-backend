// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from '../Lecturer/Headerpop';
// import Sidebar from '../Lecturer/Sidebarpop';
// import MobileMenu from '../Lecturer/MobileMenu';
// import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

// export default function LecturerDashboard() {
//   const [academicYear, setAcademicYear] = useState('2024/2025');
//   const [semester, setSemester] = useState('1');
//   const [startDate, setStartDate] = useState('2025-06-09');
//   const [timetable, setTimetable] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isMobile, setIsMobile] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 991);
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize();

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const fetchTimetable = async () => {
//     if (!academicYear || !semester || !startDate) {
//       setError('Please fill all fields');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     try {
//       const url = `https://ciu-backend.onrender.com/api/exam-timetable?acadyr=${academicYear}&sem=${semester}&StartDate=${startDate}`;
//       const response = await axios.get(url);

//       setTimetable(response.data);
//     } catch (err: any) {
//       setError('Failed to fetch timetable');
//       setTimetable([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SidebarProvider2>
//       <div className="flex flex-col h-screen font-['Roboto']">
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
//          <main className="flex-1 p-6 bg-gray-100 text-black overflow-y-auto">
//               <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-4">
//                 <h1 className="text-2xl font-semibold mb-6 text-[#0F533D]">
//                   Lecturer: View Your Exam Timetable
//                 </h1>

//                 {error && (
//                   <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     <strong>Error:</strong> {error}
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                   <input
//                     type="text"
//                     placeholder="Academic Year (e.g. 2024/2025)"
//                     value={academicYear}
//                     onChange={(e) => setAcademicYear(e.target.value)}
//                     className="border border-gray-300 p-2 rounded text-black"
//                   />
//                   <select
//                     value={semester}
//                     onChange={(e) => setSemester(e.target.value)}
//                     className="border border-gray-300 p-2 rounded text-black"
//                   >
//                     <option value="">Select Semester</option>
//                     <option value="1">Semester 1</option>
//                     <option value="2">Semester 2</option>
//                   </select>
//                   <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="border border-gray-300 p-2 rounded text-black"
//                   />
//                   <button
//                     onClick={fetchTimetable}
//                     className={`bg-[#0F533D] hover:bg-[#0D4735] text-white p-2 rounded ${
//                       loading ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                     disabled={loading}
//                   >
//                     {loading ? 'Fetching...' : 'Fetch Timetable'}
//                   </button>
//                 </div>

//                 {loading && (
//                   <div className="text-center py-8">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     <p className="mt-2 text-gray-600">Loading timetable...</p>
//                   </div>
//                 )}

//                 {!loading && timetable.length > 0 && (
//                   <div className="overflow-x-auto mt-4">
//                     <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden text-sm">
//                       <thead>
//                         <tr>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             Exam Date
//                           </th>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             Course Code
//                           </th>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             Course Name
//                           </th>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             Start Time
//                           </th>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             End Time
//                           </th>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             Lecturer
//                           </th>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             Status
//                           </th>
//                           <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
//                             Action
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {timetable.map((item, idx) => {
//                           const now = new Date();
//                           const start = new Date(`${item.ExamDate}T${item.StartTime}`);
//                           const end = new Date(`${item.ExamDate}T${item.EndTime}`);
//                           let status = '';
//                           if (now < start) status = 'Upcoming';
//                           else if (now >= start && now <= end) status = 'Ongoing';
//                           else status = 'Completed';

//                           const statusColor =
//                             status === 'Ongoing'
//                               ? 'text-green-600'
//                               : status === 'Upcoming'
//                               ? 'text-blue-600'
//                               : 'text-gray-500';

//                           return (
//                             <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
//                               <td className="px-4 py-3 text-center">{item.ExamDate}</td>
//                               <td className="px-4 py-3 text-center">{item.CourseCode}</td>
//                               <td className="px-4 py-3 text-center">{item.CourseName}</td>
//                               <td className="px-4 py-3 text-center">{item.StartTime}</td>
//                               <td className="px-4 py-3 text-center">{item.EndTime}</td>
//                               <td className="px-4 py-3 text-center">{item.LecturerName}</td>
//                               <td className={`px-4 py-3 text-center font-semibold ${statusColor}`}>
//                                 {status}
//                               </td>
//                               <td className="px-4 py-3 text-center">
//                                 <button
//                                   onClick={() => handleInvigilate(item.CourseCode)}
//                                   className="bg-[#0F533D] hover:bg-[#0D4735] text-white px-3 py-1 rounded text-sm"
//                                 >
//                                   Invigilate
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </main>
//         </div>
//       </div>
//     </SidebarProvider2>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Lecturer/Headerpop';
import Sidebar from '../Lecturer/Sidebarpop';
import MobileMenu from '../Lecturer/MobileMenu';
import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

export default function LecturerDashboard() {
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [semester, setSemester] = useState('1');
  const [startDate, setStartDate] = useState('2025-06-09');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const fetchTimetable = async () => {
    if (!academicYear || !semester || !startDate) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const url = `http://localhost:3001/api/exam-timetable?acadyr=${academicYear}&sem=${semester}&StartDate=${startDate}`;
      const response = await axios.get(url);
      setTimetable(response.data);
    } catch (err: any) {
      setError('Failed to fetch timetable');
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvigilate = (courseId: string) => {
    localStorage.setItem('courseId', courseId);
    navigate('/join-viewer');
  };

  return (
    <SidebarProvider2>
      <div className="font-['Roboto'] m-0 p-0 bg-white min-h-screen text-black">
        <div className="flex flex-col h-screen">
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex flex-1 w-full overflow-hidden">
            {!isMobile && <Sidebar />}
            {isMobile && (
              <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            )}
            <main className="flex-1 p-6 bg-gray-100 text-black overflow-y-auto">
              <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-4">
                <h1 className="text-2xl font-semibold mb-6 text-[#0F533D]">
                  Lecturer: View Your Exam Timetable
                </h1>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Academic Year (e.g. 2024/2025)"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-black"
                  />
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-black"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-black"
                  />
                  <button
                    onClick={fetchTimetable}
                    className={`bg-[#0F533D] hover:bg-[#0D4735] text-white p-2 rounded ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Fetching...' : 'Fetch Timetable'}
                  </button>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading timetable...</p>
                  </div>
                )}

                {!loading && timetable.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden text-sm">
                      <thead>
                        <tr>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            Exam Date
                          </th>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            Course Code
                          </th>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            Course Name
                          </th>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            Start Time
                          </th>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            End Time
                          </th>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            Lecturer
                          </th>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            Status
                          </th>
                          <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase border-b border-gray-200">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.map((item, idx) => {
                          const now = new Date();
                          const start = new Date(`${item.ExamDate}T${item.StartTime}`);
                          const end = new Date(`${item.ExamDate}T${item.EndTime}`);
                          let status = '';
                          if (now < start) status = 'Upcoming';
                          else if (now >= start && now <= end) status = 'Ongoing';
                          else status = 'Completed';

                          const statusColor =
                            status === 'Ongoing'
                              ? 'text-green-600'
                              : status === 'Upcoming'
                              ? 'text-blue-600'
                              : 'text-gray-500';

                          return (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-4 py-3 text-center">{item.ExamDate}</td>
                              <td className="px-4 py-3 text-center">{item.CourseCode}</td>
                              <td className="px-4 py-3 text-center">{item.CourseName}</td>
                              <td className="px-4 py-3 text-center">{item.StartTime}</td>
                              <td className="px-4 py-3 text-center">{item.EndTime}</td>
                              <td className="px-4 py-3 text-center">{item.LecturerName}</td>
                              <td className={`px-4 py-3 text-center font-semibold ${statusColor}`}>
                                {status}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleInvigilate(item.CourseCode)}
                                  className="bg-[#0F533D] hover:bg-[#0D4735] text-white px-3 py-1 rounded text-sm"
                                >
                                  Invigilate
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider2>
  );
}
