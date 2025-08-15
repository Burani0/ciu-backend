
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // interface Exam {
// //   courseName: string;
// //   regno: string;
// //   courseID: string;
// //   acad_year: string;
// //   semester: number;
// //   course_status: string;
// //   prog_id: string;
// //   stud_session: string;
// //   ExamLink: string;
// //   StartTime: string;
// //   EndTime: string;
// //   ExamDate: string;
// // }

// // // Helper function to calculate duration between StartTime and EndTime
// // const calculateDuration = (startTime: string, endTime: string): string => {
// //   try {
// //     // Assuming times are in "HH:mm:ss" format
// //     const start = new Date(`1970-01-01T${startTime}Z`);
// //     const end = new Date(`1970-01-01T${endTime}Z`);

// //     // Calculate difference in milliseconds
// //     let diffMs = end.getTime() - start.getTime();

// //     // Handle negative difference (e.g., crossing midnight)
// //     if (diffMs < 0) {
// //       diffMs += 24 * 60 * 60 * 1000; // Add 24 hours
// //     }

// //     // Convert to hours and minutes
// //     const hours = Math.floor(diffMs / (1000 * 60 * 60));
// //     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

// //     // Format as "Xh Ym"
// //     return `${hours}h ${minutes}m`;
// //   } catch (error) {
// //     console.error("Error calculating duration:", error);
// //     return "N/A";
// //   }
// // };

// // const ExamInterface: React.FC = () => {
// //   const [exams, setExams] = useState<Exam[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const regNo = localStorage.getItem("studentRegNo");
// //     const year = localStorage.getItem("StudyYear");
// //     const sem = localStorage.getItem("studentSem");

// //     console.log("Retrieved from localStorage - RegNo:", regNo);
// //     console.log("Retrieved from localStorage - StudyYear:", year);
// //     console.log("Retrieved from localStorage - Semester:", sem);

// //     if (!regNo || !year || !sem) {
// //       setError("Missing login info. Please log in again.");
// //       setLoading(false);
// //       return;
// //     }

// //     const apiUrl = `https://ciu-backend.onrender.com/api/student-exams?reg=${regNo}&yr=${year}&sem=${sem}`;

// //     axios
// //       .get(apiUrl)
// //       .then((res) => {
// //         let data = res.data;

// //         // Clean malformed API response
// //         if (typeof data === "string") {
// //           data = data.replace(/^\uFEFF/, "").trim();
// //           try {
// //             data = JSON.parse(data);
// //           } catch (err) {
// //             console.error("Failed to parse exam data:", err);
// //             data = [];
// //           }
// //         }

// //         if (!Array.isArray(data)) {
// //           setExams([]);
// //         } else {
// //           setExams(data);
// //         }
// //       })
// //       .catch((err) => {
// //         console.error("Failed to fetch exams:", err);
// //         setError("Unable to load exams. Please try again later.");
// //       })
// //       .finally(() => {
// //         setLoading(false);
// //       });
// //   }, []);

// //   const handleStartExam = (exam: Exam) => {
// //     // Calculate duration
// //     const duration = calculateDuration(exam.StartTime, exam.EndTime);

// //     // Save exam info for proctoring
// //     localStorage.setItem("currentExamLink", exam.ExamLink);
// //     localStorage.setItem("currentExamName", exam.courseName);
// //     localStorage.setItem("currentExamID", exam.courseID);
// //     localStorage.setItem("studentRegNo", exam.regno);
// //     localStorage.setItem("currentExamDate", exam.ExamDate);
// //     localStorage.setItem("currentExamStartTime", exam.StartTime);
// //     localStorage.setItem("currentExamEndTime", exam.EndTime);
// //     localStorage.setItem("currentExamDuration", duration); // Store duration

// //     // Extract examNo from ExamLink if present
// //     let examNo = "";
// //     if (exam.ExamLink) {
// //       const match = exam.ExamLink.match(/ExamNo=([\w-]+)/);
// //       if (match) {
// //         examNo = match[1];
// //         localStorage.setItem("currentExamNo", examNo);
// //       }
// //     }

// //     // Log stored values to confirm
// //     console.log("Stored in localStorage:");
// //     console.log("currentExamLink:", localStorage.getItem("currentExamLink"));
// //     console.log("currentExamName:", localStorage.getItem("currentExamName"));
// //     console.log("currentExamID:", localStorage.getItem("currentExamID"));
// //     console.log("studentRegNo:", localStorage.getItem("studentRegNo"));
// //     console.log("currentExamNo:", localStorage.getItem("currentExamNo"));
// //     console.log("currentExamDate:", localStorage.getItem("currentExamDate"));
// //     console.log("currentExamStartTime:", localStorage.getItem("currentExamStartTime"));
// //     console.log("currentExamEndTime:", localStorage.getItem("currentExamEndTime"));
// //     console.log("currentExamDuration:", localStorage.getItem("currentExamDuration"));

// //     navigate("/proctoring");
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg m-4">
// //       <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1A3C1A' }}>Your Exams</h2>

// //       {loading ? (
// //         <div className="text-center py-4">Loading exams...</div>
// //       ) : error ? (
// //         <div className="text-center text-red-600 py-4">{error}</div>
// //       ) : exams.length === 0 ? (
// //         <div className="text-center py-4">No cleared exams found.</div>
// //       ) : (
// //         <div className="overflow-x-auto">
// //           <table className="w-full border-collapse">
// //             <thead className="bg-[#C1E1C1] text-black">
// //               <tr>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Exam Name</th>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Course ID</th>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Status</th>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Date</th>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Start</th>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">End</th>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Duration</th>
// //                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {exams.map((exam, index) => (
// //                 <tr key={index} className="hover:bg-gray-50 transition-colors">
// //                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.courseName}</td>
// //                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.courseID}</td>
// //                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.course_status}</td>
// //                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.ExamDate}</td>
// //                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.StartTime}</td>
// //                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.EndTime}</td>
// //                   <td className="py-2 px-2 border-b border-gray-200 text-sm">
// //                     {calculateDuration(exam.StartTime, exam.EndTime)}
// //                   </td>
// //                   <td className="py-2 px-2 border-b border-gray-200">
// //                     <button
// //                       onClick={() => handleStartExam(exam)}
// //                       className="bg-[#1A3C1A] hover:bg-[#143D14] text-white px-2 py-1 rounded-md text-xs"
// //                     >
// //                       Start Exam
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ExamInterface;





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Exam {
//   courseName: string;
//   regno: string;
//   courseID: string;
//   acad_year: string;
//   semester: number;
//   course_status: string;
//   prog_id: string;
//   stud_session: string;
//   ExamLink: string;
//   StartTime: string;
//   EndTime: string;
//   ExamDate: string;
// }

// // Helper function to calculate duration between StartTime and EndTime
// const calculateDuration = (startTime: string, endTime: string): string => {
//   try {
//     // Assuming times are in "HH:mm:ss" format
//     const start = new Date(`1970-01-01T${startTime}Z`);
//     const end = new Date(`1970-01-01T${endTime}Z`);

//     // Calculate difference in milliseconds
//     let diffMs = end.getTime() - start.getTime();

//     // Handle negative difference (e.g., crossing midnight)
//     if (diffMs < 0) {
//       diffMs += 24 * 60 * 60 * 1000; // Add 24 hours
//     }

//     // Convert to hours and minutes
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

//     // Format as "Xh Ym"
//     return `${hours}h ${minutes}m`;
//   } catch (error) {
//     console.error("Error calculating duration:", error);
//     return "N/A";
//   }
// };

// const ExamInterface: React.FC = () => {
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const regNo = localStorage.getItem("studentRegNo");
//     const year = localStorage.getItem("StudyYear");
//     const sem = localStorage.getItem("studentSem");

//     console.log("Retrieved from localStorage - RegNo:", regNo);
//     console.log("Retrieved from localStorage - StudyYear:", year);
//     console.log("Retrieved from localStorage - Semester:", sem);

//     if (!regNo || !year || !sem) {
//       setError("Missing login info. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     const apiUrl = `https://ciu-backend.onrender.com/api/student-exams?reg=${regNo}&yr=${year}&sem=${sem}`;

//     axios
//       .get(apiUrl)
//       .then((res) => {
//         let data = res.data;

//         // Clean malformed API response
//         if (typeof data === "string") {
//           data = data.replace(/^\uFEFF/, "").trim();
//           try {
//             data = JSON.parse(data);
//           } catch (err) {
//             console.error("Failed to parse exam data:", err);
//             data = [];
//           }
//         }

//         if (!Array.isArray(data)) {
//           setExams([]);
//         } else {
//           setExams(data);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to fetch exams:", err);
//         setError("Unable to load exams. Please try again later.");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const handleStartExam = (exam: Exam) => {
//     // Calculate duration
//     const duration = calculateDuration(exam.StartTime, exam.EndTime);

//     // Save exam info for proctoring
//     localStorage.setItem("currentExamLink", exam.ExamLink);
//     localStorage.setItem("currentExamName", exam.courseName);
//     localStorage.setItem("currentExamID", exam.courseID);
//     localStorage.setItem("studentRegNo", exam.regno);
//     localStorage.setItem("currentExamDate", exam.ExamDate);
//     localStorage.setItem("currentExamStartTime", exam.StartTime);
//     localStorage.setItem("currentExamEndTime", exam.EndTime);
//     localStorage.setItem("currentExamDuration", duration); // Store duration

//     // Extract examNo from ExamLink if present
//     let examNo = "";
//     if (exam.ExamLink) {
//       const match = exam.ExamLink.match(/ExamNo=([\w-]+)/);
//       if (match) {
//         examNo = match[1];
//         localStorage.setItem("currentExamNo", examNo);
//       }
//     }

//     // Log stored values to confirm
//     console.log("Stored in localStorage:");
//     console.log("currentExamLink:", localStorage.getItem("currentExamLink"));
//     console.log("currentExamName:", localStorage.getItem("currentExamName"));
//     console.log("currentExamID:", localStorage.getItem("currentExamID"));
//     console.log("studentRegNo:", localStorage.getItem("studentRegNo"));
//     console.log("currentExamNo:", localStorage.getItem("currentExamNo"));
//     console.log("currentExamDate:", localStorage.getItem("currentExamDate"));
//     console.log("currentExamStartTime:", localStorage.getItem("currentExamStartTime"));
//     console.log("currentExamEndTime:", localStorage.getItem("currentExamEndTime"));
//     console.log("currentExamDuration:", localStorage.getItem("currentExamDuration"));

//     navigate("/proctoring");
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg m-4">
//       <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1A3C1A' }}>Your Exams</h2>

//       {loading ? (
//         <div className="text-center py-4">Loading exams...</div>
//       ) : error ? (
//         <div className="text-center text-red-600 py-4">{error}</div>
//       ) : exams.length === 0 ? (
//         <div className="text-center py-4">No cleared exams found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead className="bg-[#C1E1C1] text-black">
//               <tr>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Exam Name</th>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Course ID</th>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Status</th>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Date</th>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Start</th>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">End</th>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Duration</th>
//                 <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {exams.map((exam, index) => (
//                 <tr key={index} className="hover:bg-gray-50 transition-colors">
//                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.courseName}</td>
//                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.courseID}</td>
//                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.course_status}</td>
//                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.ExamDate}</td>
//                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.StartTime}</td>
//                   <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.EndTime}</td>
//                   <td className="py-2 px-2 border-b border-gray-200 text-sm">
//                     {calculateDuration(exam.StartTime, exam.EndTime)}
//                   </td>
//                   <td className="py-2 px-2 border-b border-gray-200">
//                     <button
//                       onClick={() => handleStartExam(exam)}
//                       className="bg-[#1A3C1A] hover:bg-[#143D14] text-white px-2 py-1 rounded-md text-xs"
//                     >
//                       Start Exam
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExamInterface;
























import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Exam {
  courseName: string;
  regno: string;
  courseID: string;
  acad_year: string;
  semester: number;
  course_status: string;
  prog_id: string;
  stud_session: string;
  ExamLink: string;
  StartTime: string;
  EndTime: string;
  ExamDate: string;
}

// Helper function to calculate duration between StartTime and EndTime
const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    // Assuming times are in "HH:mm:ss" format
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);

    // Calculate difference in milliseconds
    let diffMs = end.getTime() - start.getTime();

    // Handle negative difference (e.g., crossing midnight)
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000; // Add 24 hours
    }

    // Convert to hours and minutes
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format as "Xh Ym"
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "N/A";
  }
};

const ExamInterface: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const regNo = localStorage.getItem("studentRegNo");
    const year = localStorage.getItem("StudyYear");
    const sem = localStorage.getItem("studentSem");

    console.log("Retrieved from localStorage - RegNo:", regNo);
    console.log("Retrieved from localStorage - StudyYear:", year);
    console.log("Retrieved from localStorage - Semester:", sem);

    if (!regNo || !year || !sem) {
      setError("Missing login info. Please log in again.");
      setLoading(false);
      return;
    }

    const apiUrl = `http://localhost:3001/api/student-exams?reg=${regNo}&yr=${year}&sem=${sem}`;

    axios
      .get(apiUrl)
      .then(async (res) => {
        let data = res.data;

        // Clean malformed API response
        if (typeof data === "string") {
          data = data.replace(/^\uFEFF/, "").trim();
          try {
            data = JSON.parse(data);
          } catch (err) {
            console.error("Failed to parse exam data:", err);
            data = [];
          }
        }

        if (!Array.isArray(data)) {
          setExams([]);
        } else {
          setExams(data);

          // Check submission status for each exam
          const statusPromises = data.map(async (exam: Exam) => {
            let examNo = "";
            if (exam.ExamLink) {
              const match = exam.ExamLink.match(/ExamNo=([\w-]+)/);
              if (match) {
                examNo = match[1];
              }
            }
            if (!examNo) {
              console.warn(`No examNo found for exam with courseID: ${exam.courseID}`);
              return { key: `${examNo}-${exam.courseID}`, hasSubmitted: false };
            }
            try {
              const response = await axios.get(
                `http://localhost:3001/api/exams/check_submission/${regNo}/${examNo}/${exam.courseID}`
              );
              return { key: `${examNo}-${exam.courseID}`, hasSubmitted: response.data.hasSubmitted };
            } catch (error) {
              console.error(`Error checking submission for exam ${examNo}:`, error);
              return { key: `${examNo}-${exam.courseID}`, hasSubmitted: false };
            }
          });

          const statuses = await Promise.all(statusPromises);
          const statusMap = statuses.reduce((acc, { key, hasSubmitted }) => {
            acc[key] = hasSubmitted;
            return acc;
          }, {} as { [key: string]: boolean });
          setSubmissionStatus(statusMap);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch exams:", err);
        setError("Unable to load exams. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartExam = (exam: Exam) => {
    // Calculate duration
    const duration = calculateDuration(exam.StartTime, exam.EndTime);

    // Save exam info for proctoring
    localStorage.setItem("currentExamLink", exam.ExamLink);
    localStorage.setItem("currentExamName", exam.courseName);
    localStorage.setItem("currentExamID", exam.courseID);
    localStorage.setItem("studentRegNo", exam.regno);
    localStorage.setItem("currentExamDate", exam.ExamDate);
    localStorage.setItem("currentExamStartTime", exam.StartTime);
    localStorage.setItem("currentExamEndTime", exam.EndTime);
    localStorage.setItem("currentExamDuration", duration); // Store duration

    // Extract examNo from ExamLink if present
    let examNo = "";
    if (exam.ExamLink) {
      const match = exam.ExamLink.match(/ExamNo=([\w-]+)/);
      if (match) {
        examNo = match[1];
        localStorage.setItem("currentExamNo", examNo);
      }
    }

    // Log stored values to confirm
    console.log("Stored in localStorage:");
    console.log("currentExamLink:", localStorage.getItem("currentExamLink"));
    console.log("currentExamName:", localStorage.getItem("currentExamName"));
    console.log("currentExamID:", localStorage.getItem("currentExamID"));
    console.log("studentRegNo:", localStorage.getItem("studentRegNo"));
    console.log("currentExamNo:", localStorage.getItem("currentExamNo"));
    console.log("currentExamDate:", localStorage.getItem("currentExamDate"));
    console.log("currentExamStartTime:", localStorage.getItem("currentExamStartTime"));
    console.log("currentExamEndTime:", localStorage.getItem("currentExamEndTime"));
    console.log("currentExamDuration:", localStorage.getItem("currentExamDuration"));

    navigate("/proctoring");
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg m-4">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1A3C1A' }}>
        Your Exams
      </h2>

      {loading ? (
        <div className="text-center py-4">Loading exams...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-4">{error}</div>
      ) : exams.length === 0 ? (
        <div className="text-center py-4">No cleared exams found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#C1E1C1] text-black">
              <tr>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Exam Name</th>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Course ID</th>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Status</th>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Date</th>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Start</th>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">End</th>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Duration</th>
                <th className="py-2 px-2 text-left border-b border-gray-300 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => {
                let examNo = "";
                if (exam.ExamLink) {
                  const match = exam.ExamLink.match(/ExamNo=([\w-]+)/);
                  if (match) {
                    examNo = match[1];
                  }
                }
                const isSubmitted = submissionStatus[`${examNo}-${exam.courseID}`] || false;

                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.courseName}</td>
                    <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.courseID}</td>
                    <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.course_status}</td>
                    <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.ExamDate}</td>
                    <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.StartTime}</td>
                    <td className="py-2 px-2 border-b border-gray-200 text-sm">{exam.EndTime}</td>
                    <td className="py-2 px-2 border-b border-gray-200 text-sm">
                      {calculateDuration(exam.StartTime, exam.EndTime)}
                    </td>
                    <td className="py-2 px-2 border-b border-gray-200">
                      <button
                        onClick={() => handleStartExam(exam)}
                        disabled={isSubmitted}
                        className={`px-2 py-1 rounded-md text-xs ${
                          isSubmitted
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-[#1A3C1A] hover:bg-[#143D14] text-white"
                        }`}
                      >
                        {isSubmitted ? "Exam Already Taken" : "Start Exam"}
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
  );
};

export default ExamInterface;


