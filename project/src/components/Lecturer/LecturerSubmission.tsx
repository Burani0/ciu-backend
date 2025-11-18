
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
          `https://examiner.ciu.ac.ug/api/exams/lecturer/${lecturerId}/submissions`
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
                              {/* <p><strong>Question {q.questionNumber}:</strong> {q.answer}</p> */}
                              <div>
                                <strong>Question {q.questionNumber}:</strong>
                                <pre className="whitespace-pre-wrap mt-1 text-gray-800">{q.answer}</pre>
                              </div>

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
