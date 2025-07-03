


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";





// interface Answer {
//   question: string;
//   answer: string;
// }

// interface Submission {
//   _id: string;
//   studentRegNo: string;
//   examName: string;
//   courseId: string;         // still used internally
//   courseCode?: string;      // NEW: optionally displayed for human-friendly output
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
//     doc.text(`Course: ${submission.courseCode || submission.courseId}`, 14, 40);
//     doc.text(
//       `Submission Time: ${new Date(submission.submissionTime).toLocaleString()}`,
//       14,
//       50
//     );
  
//     // Start answers at y = 60
//     submission.answers.forEach((a, i) => {
//       const y = 60 + i * 20;
//       doc.text(`${i + 1}. ${a.question}`, 14, y);
//       doc.text(`Answer: ${a.answer}`, 14, y + 7);
//     });
  
//     doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6 text-[#0F533D]">
//          Submitted Exams
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
//                   <td className="px-4 py-2">{sub.courseCode || sub.courseId}</td>
//                   {/* <td>{sub.courseCode || sub.courseId?.courseCode || 'N/A'}</td> */}
//                   <td className="px-4 py-2">{sub.examName}</td>
//                   <td className="px-4 py-2">{sub.studentRegNo}</td>
//                   <td className="px-4 py-2">
//                     {new Date(sub.submissionTime).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={() => navigate(`/answers/${sub._id}`)}
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
//               <strong>Course:</strong> {selected.courseCode || selected.courseId}
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

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import Header from '../Lecturer/Headerpop';
// import Sidebar from '../Lecturer/Sidebarpop';
// import MobileMenu from '../Lecturer/MobileMenu';
// import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

// interface Answer {
//   question: string;
//   answer: string;
// }

// interface Submission {
//   _id: string;
//   studentRegNo: string;
//   examName: string;
//   courseId: string;
//   courseCode?: string;
//   answers: Answer[];
//   submissionTime: string;
// }

// const LecturerSubmissions = () => {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [selected, setSelected] = useState<Submission | null>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const lecturerId = localStorage.getItem("lecturerId");

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3001/api/exams/lecturer/${lecturerId}/submissions`
//         );
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         setSubmissions(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Error fetching submissions:", err);
//         setSubmissions([]);
//       }
//     };

//     if (lecturerId) fetchSubmissions();
//   }, [lecturerId]);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleDownloadPDF = (submission: Submission) => {
//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.text(`Exam Submission: ${submission.examName}`, 14, 20);
//     doc.text(`Student Reg No: ${submission.studentRegNo}`, 14, 30);
//     doc.text(`Course: ${submission.courseCode || submission.courseId}`, 14, 40);
//     doc.text(
//       `Submission Time: ${new Date(submission.submissionTime).toLocaleString()}`,
//       14,
//       50
//     );

//     submission.answers.forEach((a, i) => {
//       const y = 60 + i * 20;
//       doc.text(`${i + 1}. ${a.question}`, 14, y);
//       doc.text(`Answer: ${a.answer}`, 14, y + 7);
//     });

//     doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
//   };

//   return (
//     <SidebarProvider2>
//       <div className="font-['Roboto'] m-0 p-0">
//         <div className={`flex flex-col h-screen ${isMobileMenuOpen ? 'pointer-events-none' : ''}`}>
//           <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//           <div className="flex flex-1 overflow-scroll flex-col md:flex-row">
//             {!isMobile && <Sidebar />}
//             {isMobile && (
//               <>
//                 <div
//                   className={`fixed inset-0 bg-black bg-opacity-50 z-[998] ${isMobileMenuOpen ? 'block' : 'hidden'}`}
//                   onClick={toggleMobileMenu}
//                 ></div>
//                 <MobileMenu isOpen={isMobileMenuOpen} />
//               </>
//             )}
//             <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
//               <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-4">
//                 <h2 className="text-2xl font-bold mb-6 text-[#0F533D]">Submitted Exams</h2>

//                 {Array.isArray(submissions) && submissions.length === 0 ? (
//                   <p>No submissions found.</p>
//                 ) : (
//                   <table className="w-full table-auto border border-gray-300 rounded-md overflow-hidden">
//                     <thead className="bg-[#E6F1EB] text-[#106053]">
//                       <tr>
//                         <th className="px-4 py-2">Course</th>
//                         <th className="px-4 py-2">Exam</th>
//                         <th className="px-4 py-2">Student Reg No</th>
//                         <th className="px-4 py-2">Submitted At</th>
//                         <th className="px-4 py-2">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {submissions.map((sub) => (
//                         <tr
//                           key={sub._id}
//                           className="text-center border-b hover:bg-gray-50"
//                         >
//                           <td className="px-4 py-2">{sub.courseCode || sub.courseId}</td>
//                           <td className="px-4 py-2">{sub.examName}</td>
//                           <td className="px-4 py-2">{sub.studentRegNo}</td>
//                           <td className="px-4 py-2">
//                             {new Date(sub.submissionTime).toLocaleString()}
//                           </td>
//                           <td className="px-4 py-2">
//                             <button
//                               onClick={() => navigate(`/answers/${sub._id}`)}
//                               className="text-blue-600 hover:underline mr-4"
//                             >
//                               View
//                             </button>
//                             <button
//                               onClick={() => handleDownloadPDF(sub)}
//                               className="text-green-600 hover:underline"
//                             >
//                               Download PDF
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}

//                 {selected && (
//                   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                     <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-lg">
//                       <h3 className="text-xl font-bold mb-4">Submission Details</h3>
//                       <p><strong>Exam:</strong> {selected.examName}</p>
//                       <p><strong>Student:</strong> {selected.studentRegNo}</p>
//                       <p><strong>Course:</strong> {selected.courseCode || selected.courseId}</p>
//                       <p><strong>Submitted at:</strong> {new Date(selected.submissionTime).toLocaleString()}</p>
//                       <div className="mt-4">
//                         {selected.answers.map((ans, idx) => (
//                           <div key={idx} className="mb-3">
//                             <p className="font-semibold">{idx + 1}. {ans.question}</p>
//                             <p className="ml-4 text-gray-700">{ans.answer}</p>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="text-right mt-6">
//                         <button
//                           onClick={() => setSelected(null)}
//                           className="bg-[#0F533D] text-white px-4 py-2 rounded hover:bg-[#0c4030]"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </main>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider2>
//   );
// };

// export default LecturerSubmissions;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import { Eye, Download } from 'lucide-react';
// import Header from '../Lecturer/Headerpop';
// import Sidebar from '../Lecturer/Sidebarpop';
// import MobileMenu from '../Lecturer/MobileMenu';
// import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

// interface Answer {
//   question: string;
//   answer: string;
// }

// interface Submission {
//   _id: string;
//   studentRegNo: string;
//   examName: string;
//   courseId: string;
//   courseCode?: string;
//   answers: Answer[];
//   submissionTime: string;
// }

// const LecturerSubmissions = () => {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [selected, setSelected] = useState<Submission | null>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const lecturerId = localStorage.getItem("lecturerId");

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3001/api/exams/lecturer/${lecturerId}/submissions`
//         );
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         setSubmissions(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Error fetching submissions:", err);
//         setSubmissions([]);
//       }
//     };

//     if (lecturerId) fetchSubmissions();
//   }, [lecturerId]);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleDownloadPDF = (submission: Submission) => {
//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.text(`Exam Submission: ${submission.examName}`, 14, 20);
//     doc.text(`Student Reg No: ${submission.studentRegNo}`, 14, 30);
//     doc.text(`Course: ${submission.courseCode || submission.courseId}`, 14, 40);
//     doc.text(
//       `Submission Time: ${new Date(submission.submissionTime).toLocaleString()}`,
//       14,
//       50
//     );

//     submission.answers.forEach((a, i) => {
//       const y = 60 + i * 20;
//       doc.text(`${i + 1}. ${a.question}`, 14, y);
//       doc.text(`Answer: ${a.answer}`, 14, y + 7);
//     });

//     doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
//   };

//   return (
//     <SidebarProvider2>
//       <div className="font-['Roboto'] m-0 p-0 bg-white min-h-screen">
//         <div className="flex flex-col h-screen">
//           <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//           <div className="flex flex-1 w-full overflow-hidden">
//             {!isMobile && <Sidebar />}
//             {isMobile && (
//               <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
//             )}
//             <main className="flex flex-col w-full max-w-[1200px] mx-auto p-6 overflow-y-auto">
//               <h2 className="mb-4 text-xl font-semibold text-[#0F533D] text-left">
//                 Submitted Exams
//               </h2>

//               {submissions.length === 0 ? (
//                 <p className="text-center py-6 text-gray-500 italic">No submissions found.</p>
//               ) : (
//                 <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden">
//                   <thead>
//                     <tr>
//                       <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
//                         Course
//                       </th>
//                       <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
//                         Exam
//                       </th>
//                       <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
//                         Student Reg No
//                       </th>
//                       <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
//                         Submitted At
//                       </th>
//                       <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {submissions.map((sub) => (
//                       <tr
//                         key={sub._id}
//                         className="hover:bg-[#E6F1EB] transition-colors duration-200"
//                       >
//                         <td className="px-4 py-3 text-center text-gray-800">{sub.courseCode || sub.courseId}</td>
//                         <td className="px-4 py-3 text-center text-gray-800">{sub.examName}</td>
//                         <td className="px-4 py-3 text-center text-gray-800">{sub.studentRegNo}</td>
//                         <td className="px-4 py-3 text-center text-gray-800">
//                           {new Date(sub.submissionTime).toLocaleString()}
//                         </td>
//                         {/* <td className="flex justify-center gap-3 px-4 py-3">
//                           <button
//                             onClick={() => navigate(`/answers/${sub._id}`)}
//                             className="text-[#0F533D] hover:underline"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => handleDownloadPDF(sub)}
//                             className="text-green-600 hover:underline"
//                           >
//                             Download PDF
//                           </button>
//                         </td> */}
//                         <td className="flex justify-center gap-3 px-4 py-3">
//                           <button
//                             onClick={() => navigate(`/answers/${sub._id}`)}
//                             title="View Submission"
//                             className="text-[#2b4a40] hover:text-[#0C4030]"
//                           >
//                             <Eye className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDownloadPDF(sub)}
//                             title="Download as PDF"
//                             className="text-green-600 hover:text-green-700"
//                           >
//                             <Download className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}

//               {selected && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                   <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-lg">
//                     <h3 className="text-xl font-bold mb-4">Submission Details</h3>
//                     <p><strong>Exam:</strong> {selected.examName}</p>
//                     <p><strong>Student:</strong> {selected.studentRegNo}</p>
//                     <p><strong>Course:</strong> {selected.courseCode || selected.courseId}</p>
//                     <p><strong>Submitted at:</strong> {new Date(selected.submissionTime).toLocaleString()}</p>
//                     <div className="mt-4">
//                       {selected.answers.map((ans, idx) => (
//                         <div key={idx} className="mb-3">
//                           <p className="font-semibold">{idx + 1}. {ans.question}</p>
//                           <p className="ml-4 text-gray-700">{ans.answer}</p>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="text-right mt-6">
//                       <button
//                         onClick={() => setSelected(null)}
//                         className="bg-[#0F533D] text-white px-4 py-2 rounded hover:bg-[#0c4030]"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </main>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider2>
//   );
// };

// export default LecturerSubmissions;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { Eye, Download } from 'lucide-react';
import Header from '../Lecturer/Headerpop';
import Sidebar from '../Lecturer/Sidebarpop';
import MobileMenu from '../Lecturer/MobileMenu';
import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

interface Question {
  questionNumber: number;
  answer: string;
}

interface Section {
  section: string | number;
  questions: Question[];
}

interface Submission {
  _id: string;
  studentRegNo: string;
  examName: string;
  courseId: string;
  courseCode?: string;
  answers: Section[];  // Nested sections and questions like ViewExam
  submissionTime: string;
}

const LecturerSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const lecturerId = localStorage.getItem("lecturerId");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/exams/lecturer/${lecturerId}/submissions`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setSubmissions([]);
      }
    };

    if (lecturerId) fetchSubmissions();
  }, [lecturerId]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Download PDF adjusted to nested answers structure
  // const handleDownloadPDF = (submission: Submission) => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(14);
  //   doc.text(`Exam Submission: ${submission.examName}`, 14, 20);
  //   doc.text(`Student Reg No: ${submission.studentRegNo}`, 14, 30);
  //   doc.text(`Course: ${submission.courseCode || submission.courseId}`, 14, 40);
  //   doc.text(
  //     `Submission Time: ${new Date(submission.submissionTime).toLocaleString()}`,
  //     14,
  //     50
  //   );

  //   let y = 60;
  //   submission.answers.forEach((section) => {
  //     doc.text(`Section ${section.section}`, 14, y);
  //     y += 10;
  //     section.questions.forEach((q) => {
  //       doc.text(`${q.questionNumber}. ${q.answer}`, 14, y);
  //       y += 10;
  //     });
  //     y += 5;
  //   });

  //   doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
  // };
  // ✅ Only the `handleDownloadPDF` function is updated
const handleDownloadPDF = (submission: Submission) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 14;
  const lineHeight = 7;
  let y = 20;

  doc.setFontSize(14);
  doc.text(`Exam Submission: ${submission.examName}`, margin, y);
  y += lineHeight;
  doc.text(`Student Reg No: ${submission.studentRegNo}`, margin, y);
  y += lineHeight;
  doc.text(`Course: ${submission.courseCode || submission.courseId}`, margin, y);
  y += lineHeight;
  doc.text(
    `Submission Time: ${new Date(submission.submissionTime).toLocaleString()}`,
    margin,
    y
  );
  y += lineHeight + 4;

  submission.answers.forEach((section) => {
    if (y + lineHeight * 2 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(12);
    doc.text(`Section ${section.section}`, margin, y);
    y += lineHeight;

    section.questions.forEach((q) => {
      const fullAnswer = `${q.questionNumber}). ${q.answer}`;
      const wrappedText = doc.splitTextToSize(fullAnswer, 180); // Wrap long text

      // Add new page if this block would overflow
      if (y + wrappedText.length * lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.text(wrappedText, margin, y);
      y += wrappedText.length * lineHeight + 2;
    });

    y += 4;
  });

  doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
};


  return (
    <SidebarProvider2>
      <div className="font-['Roboto'] m-0 p-0 bg-white min-h-screen">
        <div className="flex flex-col h-screen">
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex flex-1 w-full overflow-hidden">
            {!isMobile && <Sidebar />}
            {isMobile && (
              <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            )}
            <main className="flex flex-col w-full max-w-[1200px] mx-auto p-6 overflow-y-auto">
              <h2 className="mb-4 text-xl font-semibold text-[#0F533D] text-left">
                Submitted Exams
              </h2>

              {submissions.length === 0 ? (
                <p className="text-center py-6 text-gray-500 italic">No submissions found.</p>
              ) : (
                <table className="w-full border-collapse bg-white rounded-md shadow-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Course
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Exam
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Student Reg No
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Submitted At
                      </th>
                      <th className="bg-[#E6F1EB] text-[#0F533D] px-4 py-3 text-center font-semibold uppercase tracking-wide border-b border-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr
                        key={sub._id}
                        className="hover:bg-[#E6F1EB] transition-colors duration-200"
                      >
                        <td className="px-4 py-3 text-center text-gray-800">{sub.courseCode || sub.courseId}</td>
                        <td className="px-4 py-3 text-center text-gray-800">{sub.examName}</td>
                        <td className="px-4 py-3 text-center text-gray-800">{sub.studentRegNo}</td>
                        <td className="px-4 py-3 text-center text-gray-800">
                          {new Date(sub.submissionTime).toLocaleString()}
                        </td>
                        {/* <td className="flex justify-center gap-3 px-4 py-3">
                          <button
                            onClick={() => setSelected(sub)}
                            title="View Submission"
                            className="text-[#2b4a40] hover:text-[#0C4030]"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(sub)}
                            title="Download as PDF"
                            className="text-green-600 hover:text-green-700"
                          >
                            <Download className="w-5 h-5" />
                          </button> */}

                          <td className="flex justify-center gap-3 px-4 py-3">
                           <button
                            onClick={() => navigate(`/answers/${sub._id}`)}
                            title="View Submission"
                            className="text-[#2b4a40] hover:text-[#0C4030]"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(sub)}
                            title="Download as PDF"
                            className="text-green-600 hover:text-green-700"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-lg overflow-y-auto max-h-[80vh]">
                    <h3 className="text-xl font-bold mb-4">Submission Details</h3>
                    <p><strong>Exam:</strong> {selected.examName}</p>
                    <p><strong>Student:</strong> {selected.studentRegNo}</p>
                    <p><strong>Course:</strong> {selected.courseCode || selected.courseId}</p>
                    <p><strong>Submitted at:</strong> {new Date(selected.submissionTime).toLocaleString()}</p>
                    <div className="mt-4 space-y-6 max-h-[60vh] overflow-y-auto border p-4 rounded">
                      {selected.answers.map((section, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-2">Section {section.section}:</h4>
                          {section.questions.map((q, qIdx) => (
                            <div key={qIdx} className="mb-3 ml-4">
                              <p><strong>Question {q.questionNumber}:</strong> {q.answer}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="text-right mt-6">
                      <button
                        onClick={() => setSelected(null)}
                        className="bg-[#0F533D] text-white px-4 py-2 rounded hover:bg-[#0c4030]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider2>
  );
};

export default LecturerSubmissions;
