// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// interface Answer {
//   question: string;
//   answer: string;
// }

// interface Submission {
//   _id: string;
//   studentRegNo: string;
//   examName: string;
//   courseId: string;
//   answers: Answer[];
//   submissionTime: string;
// }

// const LecturerSubmissions = () => {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [selected, setSelected] = useState<Submission | null>(null);
//   const navigate = useNavigate();

//   const lecturerId = localStorage.getItem("lecturerId");

//   useEffect(() => {
//     console.log('Lecturer ID:', lecturerId);
//     const fetchSubmissions = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3001/api/exams/lecturer/${lecturerId}/submissions`




//         );
//         const data = await res.json();
//         setSubmissions(data);
//       } catch (err) {
//         console.error("Error fetching submissions:", err);
//       }
//     };

//     if (lecturerId) fetchSubmissions();
//   }, [lecturerId]);

//   const handleDownloadPDF = (submission: Submission) => {
//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.text(`Exam Submission: ${submission.examName}`, 14, 20);
//     doc.text(`Student Reg No: ${submission.studentRegNo}`, 14, 30);
//     doc.text(`Course: ${submission.courseId}`, 14, 40);
//     doc.text(`Submission Time: ${new Date(submission.submissionTime).toLocaleString()}`, 14, 50);

//     const rows = submission.answers.map((a, i) => [i + 1, a.question, a.answer]);

//     doc.autoTable({
//       head: [["#", "Question", "Answer"]],
//       body: rows,
//       startY: 60,
//     });

//     doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6 text-[#0F533D]">Exam Submissions</h2>

//       {submissions.length === 0 ? (
//         <p>No submissions found.</p>
//       ) : (
//         <table className="w-full table-auto border border-gray-300 rounded-md overflow-hidden">
//           <thead className="bg-[#E6F1EB] text-[#106053]">
//             <tr>
//               <th className="px-4 py-2">Course</th>
//               <th className="px-4 py-2">Exam</th>
//               <th className="px-4 py-2">Student Reg No</th>
//               <th className="px-4 py-2">Submitted At</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {submissions.map((sub) => (
//               <tr key={sub._id} className="text-center border-b hover:bg-gray-50">
//                 <td className="px-4 py-2">{sub.courseId}</td>
//                 <td className="px-4 py-2">{sub.examName}</td>
//                 <td className="px-4 py-2">{sub.studentRegNo}</td>
//                 <td className="px-4 py-2">{new Date(sub.submissionTime).toLocaleString()}</td>
//                 <td className="px-4 py-2">
//                   {/* <button
//                     onClick={() => setSelected(sub)}
//                     className="text-blue-600 hover:underline mr-4"
//                   >
//                     View
//                   </button> */}
//                   <button
//                     onClick={() => navigate(`/lecturer/view-exam/${sub._id}`)}
//                     className="text-blue-600 hover:underline mr-4"
//                     >
//                     View
//                     </button>
//                   <button
//                     onClick={() => handleDownloadPDF(sub)}
//                     className="text-green-600 hover:underline"
//                   >
//                     Download PDF
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* View Modal */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-lg">
//             <h3 className="text-xl font-bold mb-4">Submission Details</h3>
//             <p><strong>Exam:</strong> {selected.examName}</p>
//             <p><strong>Student:</strong> {selected.studentRegNo}</p>
//             <p><strong>Course:</strong> {selected.courseId}</p>
//             <p><strong>Submitted at:</strong> {new Date(selected.submissionTime).toLocaleString()}</p>

//             <div className="mt-4">
//               {selected.answers.map((ans, idx) => (
//                 <div key={idx} className="mb-3">
//                   <p className="font-semibold">{idx + 1}. {ans.question}</p>
//                   <p className="ml-4 text-gray-700">{ans.answer}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="text-right mt-6">
//               <button
//                 onClick={() => setSelected(null)}
//                 className="bg-[#0F533D] text-white px-4 py-2 rounded hover:bg-[#0c4030]"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LecturerSubmissions;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// interface Answer {
//   question: string;
//   answer: string;
// }

// interface Submission {
//   _id: string;
//   studentRegNo: string;
//   examName: string;
//   courseId: string;
//   answers: Answer[];
//   submissionTime: string;
// }

// const LecturerSubmissions = () => {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [selected, setSelected] = useState<Submission | null>(null);
//   const navigate = useNavigate();

//   const lecturerId = localStorage.getItem("lecturerId");

//   useEffect(() => {
//     console.log("Lecturer ID:", lecturerId);

//     const fetchSubmissions = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3001/api/exams/lecturer/${lecturerId}/submissions`
//         );

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log("Fetched data:", data);

//         if (Array.isArray(data)) {
//           setSubmissions(data);
//         } else {
//           console.error("Expected array but got:", data);
//           setSubmissions([]);
//         }
//       } catch (err) {
//         console.error("Error fetching submissions:", err);
//         setSubmissions([]);
//       }
//     };

//     if (lecturerId) fetchSubmissions();
//   }, [lecturerId]);

//   const handleDownloadPDF = (submission: Submission) => {
//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.text(`Exam Submission: ${submission.examName}`, 14, 20);
//     doc.text(`Student Reg No: ${submission.studentRegNo}`, 14, 30);
//     doc.text(`Course: ${submission.courseId}`, 14, 40);
//     doc.text(
//       `Submission Time: ${new Date(
//         submission.submissionTime
//       ).toLocaleString()}`,
//       14,
//       50
//     );

//     const rows = submission.answers.map((a, i) => [i + 1, a.question, a.answer]);

//     doc.autoTable({
//       head: [["#", "Question", "Answer"]],
//       body: rows,
//       startY: 60,
//     });

//     doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6 text-[#0F533D]">
//         Exam Submissions
//       </h2>

//       {Array.isArray(submissions) && submissions.length === 0 ? (
//         <p>No submissions found.</p>
//       ) : (
//         <table className="w-full table-auto border border-gray-300 rounded-md overflow-hidden">
//           <thead className="bg-[#E6F1EB] text-[#106053]">
//             <tr>
//               <th className="px-4 py-2">Course</th>
//               <th className="px-4 py-2">Exam</th>
//               <th className="px-4 py-2">Student Reg No</th>
//               <th className="px-4 py-2">Submitted At</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(submissions) &&
//               submissions.map((sub) => (
//                 <tr
//                   key={sub._id}
//                   className="text-center border-b hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-2">{sub.courseId}</td>
//                   <td className="px-4 py-2">{sub.examName}</td>
//                   <td className="px-4 py-2">{sub.studentRegNo}</td>
//                   <td className="px-4 py-2">
//                     {new Date(sub.submissionTime).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={() => navigate(`/lecturer/view-exam/${sub._id}`)}
//                       className="text-blue-600 hover:underline mr-4"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => handleDownloadPDF(sub)}
//                       className="text-green-600 hover:underline"
//                     >
//                       Download PDF
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       )}

//       {/* View Modal */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-lg">
//             <h3 className="text-xl font-bold mb-4">Submission Details</h3>
//             <p>
//               <strong>Exam:</strong> {selected.examName}
//             </p>
//             <p>
//               <strong>Student:</strong> {selected.studentRegNo}
//             </p>
//             <p>
//               <strong>Course:</strong> {selected.courseId}
//             </p>
//             <p>
//               <strong>Submitted at:</strong>{" "}
//               {new Date(selected.submissionTime).toLocaleString()}
//             </p>

//             <div className="mt-4">
//               {selected.answers.map((ans, idx) => (
//                 <div key={idx} className="mb-3">
//                   <p className="font-semibold">
//                     {idx + 1}. {ans.question}
//                   </p>
//                   <p className="ml-4 text-gray-700">{ans.answer}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="text-right mt-6">
//               <button
//                 onClick={() => setSelected(null)}
//                 className="bg-[#0F533D] text-white px-4 py-2 rounded hover:bg-[#0c4030]"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LecturerSubmissions;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExamSubmission {
  _id: string;
  studentRegNo: string;
  examNo: string;
  examName: string;
  courseId: string;
  submissionTime: string;
  // answers excluded here for list view, loaded on detail page
}

const LecturerSubmissions = () => {
  const [exams, setExams] = useState<ExamSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const lecturerId = localStorage.getItem('lecturerId');

  useEffect(() => {
    if (!lecturerId) {
      navigate('/login');
      return;
    }

    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/exams/lecturer/${lecturerId}/submissions`);
        if (!res.ok) throw new Error(`Error fetching exams: ${res.statusText}`);
        const data = await res.json();
        setExams(data);
      } catch (err) {
        setError('Failed to load exam submissions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [lecturerId, navigate]);

  const viewExamDetails = (examId: string) => {
    navigate(`/lecturer/exams/${examId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submitted Exams</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && exams.length === 0 && <p>No submitted exams found for your courses.</p>}
      {!loading && exams.length > 0 && (
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Student Reg No</th>
              <th className="p-2 border">Exam Name</th>
              <th className="p-2 border">Exam No</th>
              <th className="p-2 border">Course ID</th>
              <th className="p-2 border">Submission Time</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id} className="hover:bg-gray-100 cursor-pointer">
                <td className="p-2 border">{exam.studentRegNo}</td>
                <td className="p-2 border">{exam.examName}</td>
                <td className="p-2 border">{exam.examNo}</td>
                <td className="p-2 border">{exam.courseId}</td>
                <td className="p-2 border">{new Date(exam.submissionTime).toLocaleString()}</td>
                <td className="p-2 border">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => viewExamDetails(exam._id)}
                  >
                    View Answers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LecturerSubmissions;
