// // ViewExam.tsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const ViewExam = () => {
//   const { submissionId } = useParams();
//   const [submission, setSubmission] = useState<any>(null);

//   useEffect(() => {
//     const fetchSubmission = async () => {
//       const res = await fetch(`http://localhost:3001/api/exams/fetch_exam_by_id/${submissionId}`);
//       const data = await res.json();
//       setSubmission(data);
//     };

//     fetchSubmission();
//   }, [submissionId]);

//   if (!submission) return <p>Loading...</p>;

//   // return (
//   //   <div className="p-6">
//   //     <h2 className="text-2xl font-bold mb-4 text-[#0F533D]">Exam: {submission.examName}</h2>
//   //     <p><strong>Student:</strong> {submission.studentRegNo}</p>
//   //     {/* <p><strong>Course:</strong> {submission.courseId}</p> */}
//   //     <p><strong>Course:</strong> {submission.courseId?.courseCode || 'N/A'}</p>
//   //     <p><strong>Submitted at:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>

//   //     <div className="mt-6 space-y-4">
//   //       {submission.answers.map((ans: any, idx: number) => (
//   //         <div key={idx}>
//   //           <p className="font-semibold">{idx + 1}. {ans.question}</p>
//   //           <p className="text-gray-700 ml-4">{ans.answer}</p>
//   //         </div>
//   //       ))}
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 text-[#0F533D]">Exam: {submission.examName}</h2>
//       <p><strong>Student:</strong> {submission.studentRegNo}</p>
//       {/* <p><strong>Course:</strong> {submission.courseId?.courseCode || 'N/A'}</p> */}
//       <p><strong>Course:</strong> {submission.courseCode || submission.courseId}</p>
//       <p><strong>Submitted at:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>
  
//       <div className="mt-6 space-y-4">
//         {submission.answers.map((ans: any, idx: number) => (
//           <div key={idx}>
//             <p className="font-semibold">{idx + 1}. {ans.question}</p>
//             <p className="text-gray-700 ml-4">{ans.answer}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
  
// };

// export default ViewExam;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import jsPDF from "jspdf";

// const ViewExam = () => {
//   const { submissionId } = useParams();
//   const [submission, setSubmission] = useState<any>(null);
//   const [scores, setScores] = useState<number[]>([]);

//   useEffect(() => {
//     const fetchSubmission = async () => {
//       const res = await fetch(`http://localhost:3001/api/exams/fetch_exam_by_id/${submissionId}`);
//       const data = await res.json();
//       setSubmission(data);
//       setScores(Array(data.answers.length).fill(0)); // Initialize scores to 0
//     };

//     fetchSubmission();
//   }, [submissionId]);

//   const handleScoreChange = (index: number, score: number) => {
//     const updatedScores = [...scores];
//     updatedScores[index] = Number(score);
//     setScores(updatedScores);
//   };

//   // const totalScore = scores.reduce((a, b) => a + b, 0);
//   const totalScore = scores.reduce((a, b) => Number(a) + Number(b), 0);


//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Exam: ${submission.examName}`, 10, 10);
//     doc.setFontSize(12);
//     doc.text(`Student: ${submission.studentRegNo}`, 10, 20);
//     doc.text(`Course: ${submission.courseCode || submission.courseId}`, 10, 30);
//     doc.text(`Submitted at: ${new Date(submission.submissionTime).toLocaleString()}`, 10, 40);
//     doc.text(`Total Score: ${totalScore}`, 10, 50);

//     submission.answers.forEach((ans: any, idx: number) => {
//       const y = 60 + idx * 20;
//       doc.text(`${idx + 1}. ${ans.question}`, 10, y);
//       doc.text(`Answer: ${ans.answer}`, 10, y + 7);
//       doc.text(`Score: ${scores[idx] || 0}`, 10, y + 14);
//     });

//     doc.save(`${submission.studentRegNo}_marked_exam.pdf`);
//   };

//   if (!submission) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 text-[#0F533D]">Exam: {submission.examName}</h2>
//       <p><strong>Student:</strong> {submission.studentRegNo}</p>
//       <p><strong>Course:</strong> {submission.courseCode || submission.courseId}</p>
//       <p><strong>Submitted at:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>

//       <div className="mt-6 space-y-6">
//         {submission.answers.map((ans: any, idx: number) => (
//           <div key={idx} className="border rounded p-4">
//             <p className="font-semibold">{idx + 1}. {ans.question}</p>
//             <p className="text-gray-700 ml-4">{ans.answer}</p>

//             <div className="mt-2 ml-4 flex gap-2 items-center">
//               <span className="text-sm font-medium">Score:</span>
//               {[1, 2, 3, 4, 5].map((val) => (
//                 <button
//                   key={val}
//                   onClick={() => handleScoreChange(idx, val)}
//                   className={`px-2 py-1 rounded border text-sm ${
//                     scores[idx] === val ? "bg-green-500 text-white" : "bg-gray-100"
//                   }`}
//                 >
//                   {val}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 flex items-center justify-between">
//         <p className="text-lg font-bold text-green-800">Total Score: {totalScore}</p>
//         <button
//           onClick={downloadPDF}
//           className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewExam;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import jsPDF from "jspdf";
// import Header from '../Lecturer/Headerpop';
// import Sidebar from '../Lecturer/Sidebarpop';
// import MobileMenu from '../Lecturer/MobileMenu';
// import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

// const ViewExam = () => {
//   const { submissionId } = useParams();
//   const [submission, setSubmission] = useState<any>(null);
//   const [scores, setScores] = useState<number[]>([]);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const fetchSubmission = async () => {
//       const res = await fetch(`http://localhost:3001/api/exams/fetch_exam_by_id/${submissionId}`);
//       const data = await res.json();
//       setSubmission(data);
//       setScores(Array(data.answers.length).fill(0));
//     };

//     fetchSubmission();
//   }, [submissionId]);

//   const handleScoreChange = (index: number, score: number) => {
//     const updatedScores = [...scores];
//     updatedScores[index] = Number(score);
//     setScores(updatedScores);
//   };

//   const totalScore = scores.reduce((a, b) => Number(a) + Number(b), 0);

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Exam: ${submission.examName}`, 10, 10);
//     doc.setFontSize(12);
//     doc.text(`Student: ${submission.studentRegNo}`, 10, 20);
//     doc.text(`Course: ${submission.courseCode || submission.courseId}`, 10, 30);
//     doc.text(`Submitted at: ${new Date(submission.submissionTime).toLocaleString()}`, 10, 40);
//     doc.text(`Total Score: ${totalScore}`, 10, 50);

//     submission.answers.forEach((ans: any, idx: number) => {
//       const y = 60 + idx * 20;
//       doc.text(`${idx + 1}. ${ans.question}`, 10, y);
//       doc.text(`Answer: ${ans.answer}`, 10, y + 7);
//       doc.text(`Score: ${scores[idx] || 0}`, 10, y + 14);
//     });

//     doc.save(`${submission.studentRegNo}_marked_exam.pdf`);
//   };

//   if (!submission) return <p>Loading...</p>;

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
//                 <h2 className="text-2xl font-bold mb-4 text-[#0F533D]">Exam: {submission.examName}</h2>
//                 <p><strong>Student:</strong> {submission.studentRegNo}</p>
//                 <p><strong>Course:</strong> {submission.courseCode || submission.courseId}</p>
//                 <p><strong>Submitted at:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>

//                 <div className="mt-6 space-y-6">
//                   {submission.answers.map((ans: any, idx: number) => (
//                     <div key={idx} className="border rounded p-4">
//                       <p className="font-semibold">{idx + 1}. {ans.question}</p>
//                       <p className="text-gray-700 ml-4">{ans.answer}</p>

//                       <div className="mt-2 ml-4 flex gap-2 items-center">
//                         <span className="text-sm font-medium">Score:</span>
//                         {[1, 2, 3, 4, 5].map((val) => (
//                           <button
//                             key={val}
//                             onClick={() => handleScoreChange(idx, val)}
//                             className={`px-2 py-1 rounded border text-sm ${
//                               scores[idx] === val ? "bg-green-500 text-white" : "bg-gray-100"
//                             }`}
//                           >
//                             {val}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-6 flex items-center justify-between">
//                   <p className="text-lg font-bold text-green-800">Total Score: {totalScore}</p>
//                   <button
//                     onClick={downloadPDF}
//                     className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
//                   >
//                     Download PDF
//                   </button>
//                 </div>
//               </div>
//             </main>
//           </div>
//         </div>
//       </div>
//     </SidebarProvider2>
//   );
// };

// export default ViewExam;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import Header from '../Lecturer/Headerpop';
import Sidebar from '../Lecturer/Sidebarpop';
import MobileMenu from '../Lecturer/MobileMenu';
import { SidebarProvider2 } from '../Lecturer/SidebarContext2';

const ViewExam = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState<any>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      const res = await fetch(`http://localhost:3001/api/exams/fetch_exam_by_id/${submissionId}`);
      const data = await res.json();
      setSubmission(data);
      setScores(Array(data.answers.length).fill(0));
    };

    fetchSubmission();
  }, [submissionId]);

  const handleScoreChange = (index: number, score: number) => {
    const updatedScores = [...scores];
    updatedScores[index] = Number(score);
    setScores(updatedScores);
  };

  const totalScore = scores.reduce((a, b) => Number(a) + Number(b), 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Exam: ${submission.examName}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Student: ${submission.studentRegNo}`, 10, 20);
    doc.text(`Course: ${submission.courseCode || submission.courseId}`, 10, 30);
    doc.text(`Submitted at: ${new Date(submission.submissionTime).toLocaleString()}`, 10, 40);
    doc.text(`Total Score: ${totalScore}`, 10, 50);

    submission.answers.forEach((ans: any, idx: number) => {
      const y = 60 + idx * 20;
      doc.text(`${idx + 1}. ${ans.question}`, 10, y);
      doc.text(`Answer: ${ans.answer}`, 10, y + 7);
      doc.text(`Score: ${scores[idx] || 0}`, 10, y + 14);
    });

    doc.save(`${submission.studentRegNo}_marked_exam.pdf`);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  if (!submission) return <p className="p-6">Loading...</p>;

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
                <h2 className="text-2xl font-bold mb-4 text-[#0F533D]">Exam: {submission.examName}</h2>
                <p><strong>Student:</strong> {submission.studentRegNo}</p>
                <p><strong>Course:</strong> {submission.courseCode || submission.courseId}</p>
                <p><strong>Submitted at:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>

                <div className="mt-6 space-y-6">
                  {submission.answers.map((ans: any, idx: number) => (
                    <div key={idx} className="border rounded p-4">
                      <p className="font-semibold">{idx + 1}. {ans.question}</p>
                      <p className="text-gray-700 ml-4">{ans.answer}</p>

                      <div className="mt-2 ml-4 flex gap-2 items-center">
                        <span className="text-sm font-medium">Score:</span>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleScoreChange(idx, val)}
                            className={`px-2 py-1 rounded border text-sm ${
                              scores[idx] === val ? "bg-green-500 text-white" : "bg-gray-100"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-lg font-bold text-green-800">Total Score: {totalScore}</p>
                  <button
                    onClick={downloadPDF}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider2>
  );
};

export default ViewExam;
