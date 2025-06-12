// import React, { useEffect, useState } from 'react';
// import * as jwt_decode from 'jwt-decode';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// type ExamEntry = {
//   CourseCode: string;
//   CourseName: string;
//   Venue: string;
//   StartTime: string;
//   EndTime: string;
//   Lecturer: string;
//   Date: string;
// };

// const LecturerTimetable = () => {
//   const [timetable, setTimetable] = useState<ExamEntry[]>([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
   
//       const decoded: any = jwt_decode(token);
//       const universityNumber = decoded.universityNumber;

//       const fetchTimetable = async () => {
//         try {
//           const response = await axios.get(
//             'https://eadmin.ciu.ac.ug/API/ExamTimeTableAPI.aspx?acadyr=2024/2025&sem=1&StartDate=2025/06/09'
//           );
//           const filtered = response.data.filter(
//             (entry: ExamEntry) =>
//               entry.Lecturer &&
//               entry.Lecturer.toLowerCase().includes(universityNumber.toLowerCase())
//           );
//           setTimetable(filtered);
//         } catch (err) {
//           console.error('Error fetching timetable:', err);
//           setError('Failed to fetch timetable');
//         }
//       };

//       fetchTimetable();
//     } catch (err) {
//       console.error('Invalid token:', err);
//       navigate('/login');
//     }
//   }, [navigate]);

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Your Exam Timetable</h1>

//       {error && <div className="text-red-600 mb-4">{error}</div>}

//       {timetable.length === 0 ? (
//         <p>No timetable entries found for you.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Course Code</th>
//                 <th className="border px-4 py-2">Course Name</th>
//                 <th className="border px-4 py-2">Venue</th>
//                 <th className="border px-4 py-2">Start Time</th>
//                 <th className="border px-4 py-2">End Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {timetable.map((entry, index) => (
//                 <tr key={index} className="text-center">
//                   <td className="border px-4 py-2">{entry.Date}</td>
//                   <td className="border px-4 py-2">{entry.CourseCode}</td>
//                   <td className="border px-4 py-2">{entry.CourseName}</td>
//                   <td className="border px-4 py-2">{entry.Venue}</td>
//                   <td className="border px-4 py-2">{entry.StartTime}</td>
//                   <td className="border px-4 py-2">{entry.EndTime}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LecturerTimetable;

// import React, { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';

// type ExamEntry = {
//   CourseCode: string;
//   CourseName: string;
//   Venue: string;
//   StartTime: string;
//   EndTime: string;
//   Lecturer: string;
//   Date: string;
// };

// const LecturerTimetable = () => {
//   const [timetable, setTimetable] = useState<ExamEntry[]>([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       setError('No access token found');
//       return;
//     }

//     try {
//         const decoded: any = jwtDecode(token);

//       const universityNumber = decoded.universityNumber;

//       const fetchTimetable = async () => {
//         try {
//           const response = await axios.get(
//             'https://eadmin.ciu.ac.ug/API/ExamTimeTableAPI.aspx?acadyr=2024/2025&sem=1&StartDate=2025/06/09'
//           );

//           const filtered = response.data.filter(
//             (entry: ExamEntry) =>
//               entry.Lecturer &&
//               entry.Lecturer.toLowerCase().includes(universityNumber.toLowerCase())
//           );

//           setTimetable(filtered);
//         } catch (err) {
//           console.error('Error fetching timetable:', err);
//           setError('Failed to fetch timetable');
//         }
//       };

//       fetchTimetable();
//     } catch (err) {
//       console.error('Invalid token:', err);
//       setError('Invalid token. Please login again.');
//     }
//   }, []);

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Your Exam Timetable</h1>

//       {error && <div className="text-red-600 mb-4">{error}</div>}

//       {timetable.length === 0 && !error ? (
//         <p>No timetable entries found for you.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Course Code</th>
//                 <th className="border px-4 py-2">Course Name</th>
//                 <th className="border px-4 py-2">Venue</th>
//                 <th className="border px-4 py-2">Start Time</th>
//                 <th className="border px-4 py-2">End Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {timetable.map((entry, index) => (
//                 <tr key={index} className="text-center">
//                   <td className="border px-4 py-2">{entry.Date}</td>
//                   <td className="border px-4 py-2">{entry.CourseCode}</td>
//                   <td className="border px-4 py-2">{entry.CourseName}</td>
//                   <td className="border px-4 py-2">{entry.Venue}</td>
//                   <td className="border px-4 py-2">{entry.StartTime}</td>
//                   <td className="border px-4 py-2">{entry.EndTime}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LecturerTimetable;


import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Lecturer/Headerpop';
import Sidebar from '../Lecturer/Sidebarpop';
import MobileMenu from '../Lecturer/MobileMenu';
import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

const Timetable = () => {
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [semester, setSemester] = useState('1');
  const [startDate, setStartDate] = useState('2025-06-09');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchTimetable = async () => {
    if (!academicYear || !semester || !startDate) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const url = `https://eadmin.ciu.ac.ug/API/ExamTimeTableAPI.aspx?acadyr=${encodeURIComponent(academicYear)}&sem=${encodeURIComponent(semester)}&StartDate=${encodeURIComponent(startDate)}`;
      const response = await axios.get(url);

      setTimetable(response.data);
    } catch (err: any) {
      setError('Failed to fetch timetable');
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <SidebarProvider2>
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
                <h1 className="text-3xl font-bold mb-6 text-[#0F533D]">Fetch Exam Timetable</h1>

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
                    className="border border-gray-300 p-2 rounded"
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
                    className="border border-gray-300 p-2 rounded"
                  />
                  <button
                    onClick={fetchTimetable}
                    className={`bg-blue-600 hover:bg-blue-700 text-white p-2 rounded ${
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
    <table className="w-full border border-gray-300 rounded-md shadow-sm text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border px-4 py-2">Exam Date</th>
          <th className="border px-4 py-2">Course Code</th>
          <th className="border px-4 py-2">Course Name</th>
          <th className="border px-4 py-2">Start Time</th>
          <th className="border px-4 py-2">End Time</th>
          <th className="border px-4 py-2">Lecturer</th>
        </tr>
      </thead>
      <tbody>
        {timetable.map((item, idx) => (
          <tr key={idx} className="hover:bg-gray-50 text-gray-800">
            <td className="border px-4 py-2">{item.ExamDate}</td>
            <td className="border px-4 py-2">{item.CourseCode}</td>
            <td className="border px-4 py-2">{item.CourseName}</td>
            <td className="border px-4 py-2">{item.StartTime}</td>
            <td className="border px-4 py-2">{item.EndTime}</td>
            <td className="border px-4 py-2">{item.LecturerName}</td>
          </tr>
        ))}
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
};

export default Timetable;
