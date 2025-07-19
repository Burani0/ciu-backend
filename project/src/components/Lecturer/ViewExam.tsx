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
//       console.log("Submission answers:", data.answers);
//       setSubmission(data);
//       setScores(Array(data.answers.length).fill(0));
//       console.log("Fetched submission data:", data);
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
//       // doc.text(`${idx + 1}. ${ans.question}`, 10, y);
//       doc.text(`${idx + 1}. Question ${ans.questionNumber}`, 10, y);
//       doc.text(`Answer: ${ans.answer}`, 10, y + 7);
//       doc.text(`Score: ${scores[idx] || 0}`, 10, y + 14);
//     });

//     doc.save(`${submission.studentRegNo}_marked_exam.pdf`);
//   };

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   if (!submission) return <p className="p-6">Loading...</p>;

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
//                   className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[998] ${isMobileMenuOpen ? 'block' : 'hidden'}`}
//                   onClick={toggleMobileMenu}
//                 ></div>
//                 <MobileMenu isOpen={isMobileMenuOpen} />
//               </>
//             )}
//             <main className="flex-1 p-6 bg-gray-100">
//               <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-4">
//                 <h2 className="text-2xl font-bold mb-4 text-[#0F533D]">Exam: {submission.examName}</h2>
//                 <p><strong>Student:</strong> {submission.studentRegNo}</p>
//                 <p><strong>Course:</strong> {submission.courseCode || submission.courseId}</p>
//                 <p><strong>Submitted at:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>

//                 <div className="mt-6 space-y-6">
//                   {(() => {
//                     // Group answers by section
//                     const sections: Record<string, any[]> = {};
//                     submission.answers.forEach((ans: any, idx: number) => {
//                       if (!sections[ans.section]) {
//                         sections[ans.section] = [];
//                       }
//                       sections[ans.section].push({ ...ans, idx });
//                     });

//                     return Object.entries(sections).map(([sectionName, answers]) => (
//                       <div key={sectionName} className="mb-6 border rounded p-4">
//                         <h3 className="font-bold text-lg mb-2">Section {sectionName}:</h3>
//                         <div className="ml-4 space-y-4">
//                           {answers.map((ans: any) => (
//                             <div key={ans.idx}>
//                               <p className="font-semibold">
//                                 Question {ans.questionNumber}: {ans.answer}, Score{" "}
//                                 <select
//                                   value={scores[ans.idx]}
//                                   onChange={(e) => handleScoreChange(ans.idx, Number(e.target.value))}
//                                   className="px-2 py-1 border rounded bg-white text-sm inline-block ml-2"
//                                 >
//                                   <option value={0}>--</option>
//                                   {[...Array(25)].map((_, i) => (
//                                     <option key={i + 1} value={i + 1}>
//                                       {i + 1}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ));
//                   })()}
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
      const res = await fetch(`https://ciu-backend.onrender.com/api/exams/fetch_exam_by_id/${submissionId}`);
      const data = await res.json();
      console.log("Submission answers:", data.answers);
      setSubmission(data);

      const totalQuestions = data.answers.reduce((acc: number, section: any) => acc + section.questions.length, 0);
      setScores(Array(totalQuestions).fill(0));

      console.log("Fetched submission data:", data);
    };

    fetchSubmission();
  }, [submissionId]);

  const handleScoreChange = (index: number, score: number) => {
    const updatedScores = [...scores];
    updatedScores[index] = Number(score);
    setScores(updatedScores);
  };

  const totalScore = scores.reduce((a, b) => Number(a) + Number(b), 0);

  // const downloadPDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text(`Exam: ${submission.examName}`, 10, 10);
  //   doc.setFontSize(12);
  //   doc.text(`Student: ${submission.studentRegNo}`, 10, 20);
  //   doc.text(`Course: ${submission.courseCode || submission.courseId}`, 10, 30);
  //   doc.text(`Submitted at: ${new Date(submission.submissionTime).toLocaleString()}`, 10, 40);
  //   doc.text(`Total Score: ${totalScore}`, 10, 50);

  //   let y = 60;
  //   let flatIndex = 0;
  //   submission.answers.forEach((section: any) => {
  //     doc.text(`Section ${section.section}`, 10, y);
  //     y += 10;
  //     section.questions.forEach((q: any) => {
  //       doc.text(`Q${q.questionNumber}: ${q.answer}`, 10, y);
  //       doc.text(`Score: ${scores[flatIndex] || 0}`, 150, y);
  //       y += 10;
  //       flatIndex++;
  //     });
  //   });

  //   doc.save(`${submission.studentRegNo}_marked_exam.pdf`);
  // };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 10;
    const marginRight = 10;
    const pageWidth = doc.internal.pageSize.width;
    const usableWidth = pageWidth - marginLeft - marginRight;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    let y = 10;
  
    doc.setFontSize(16);
    doc.text(`Exam: ${submission.examName}`, marginLeft, y);
    y += lineHeight;
    doc.setFontSize(12);
    doc.text(`Student: ${submission.studentRegNo}`, marginLeft, y);
    y += lineHeight;
    doc.text(`Course: ${submission.courseCode || submission.courseId}`, marginLeft, y);
    y += lineHeight;
    doc.text(`Submitted at: ${new Date(submission.submissionTime).toLocaleString()}`, marginLeft, y);
    y += lineHeight;
    doc.text(`Total Score: ${totalScore}`, marginLeft, y);
    y += lineHeight + 5;
  
    let flatIndex = 0;
  
    submission.answers.forEach((section: any) => {
      if (y + lineHeight > pageHeight - marginRight) {
        doc.addPage();
        y = marginLeft;
      }
  
      doc.setFont(undefined, 'bold');
      doc.text(`Section ${section.section}`, marginLeft, y);
      y += lineHeight;
      doc.setFont(undefined, 'normal');
  
      section.questions.forEach((q: any) => {
        const score = scores[flatIndex] || 0;
        const baseText = `Q${q.questionNumber}): ${q.answer}`;
        const wrappedLines = doc.splitTextToSize(baseText, usableWidth - 35); // leave room for "Mrk: X"
        
        // Page break if needed
        if (y + wrappedLines.length * lineHeight > pageHeight - marginRight) {
          doc.addPage();
          y = marginLeft;
        }
  
        wrappedLines.forEach((line: string, i: number) => {
          doc.text(line, marginLeft, y);
  
          // Only last line has the mark
          if (i === wrappedLines.length - 1) {
            const scoreLabel = `score: ${score}`;
            const textWidth = doc.getTextWidth(scoreLabel);
            doc.text(scoreLabel, pageWidth - marginRight - textWidth, y);
          }
  
          y += lineHeight;
        });
  
        y += 2;
        flatIndex++;
      });
  
      y += 4;
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
                  {(() => {
                    let flatIndex = 0;
                    return submission.answers.map((section: any, sectionIndex: number) => (
                      <div key={sectionIndex} className="mb-6 border rounded p-4">
                        <h3 className="font-bold text-lg mb-2">Section {section.section}:</h3>
                        <div className="ml-4 space-y-4">
                          {section.questions.map((q: any, questionIndex: number) => {
                            const index = flatIndex++;
                            return (
                              // <div key={questionIndex}>
                              //   <p className="font-semibold">
                              //     Question {q.questionNumber}: {q.answer}, Score{" "}
                              //     <select
                              //       value={scores[index]}
                              //       onChange={(e) => handleScoreChange(index, Number(e.target.value))}
                              //       className="px-2 py-1 border rounded bg-white text-sm inline-block ml-2"
                              //     >
                              //       <option value={0}>--</option>
                              //       {[...Array(25)].map((_, i) => (
                              //         <option key={i + 1} value={i + 1}>
                              //           {i + 1}
                              //         </option>
                              //       ))}
                              //     </select>
                              //   </p>
                              // </div>
                              <div key={questionIndex}>
  <div className="font-semibold whitespace-pre-line">
    Question {q.questionNumber}: {q.answer}
  </div>
  <div className="mt-1">
    Score{" "}
    <select
      value={scores[index]}
      onChange={(e) => handleScoreChange(index, Number(e.target.value))}
      className="px-2 py-1 border rounded bg-white text-sm inline-block ml-2"
    >
      <option value={0}>--</option>
      {[...Array(25)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  </div>
</div>

                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
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
