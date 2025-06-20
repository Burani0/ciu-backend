import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Answer {
  question: string;
  answer: string;
}

interface Submission {
  _id: string;
  studentRegNo: string;
  examName: string;
  courseId: string;
  answers: Answer[];
  submissionTime: string;
}

const LecturerSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const navigate = useNavigate();

  const lecturerId = localStorage.getItem("lecturerId");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `https://ciu-backend.onrender.com/api/lecturers/${lecturerId}/submissions`
        );
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    if (lecturerId) fetchSubmissions();
  }, [lecturerId]);

  const handleDownloadPDF = (submission: Submission) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Exam Submission: ${submission.examName}`, 14, 20);
    doc.text(`Student Reg No: ${submission.studentRegNo}`, 14, 30);
    doc.text(`Course: ${submission.courseId}`, 14, 40);
    doc.text(`Submission Time: ${new Date(submission.submissionTime).toLocaleString()}`, 14, 50);

    const rows = submission.answers.map((a, i) => [i + 1, a.question, a.answer]);

    doc.autoTable({
      head: [["#", "Question", "Answer"]],
      body: rows,
      startY: 60,
    });

    doc.save(`${submission.studentRegNo}_${submission.examName}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#0F533D]">Exam Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-[#E6F1EB] text-[#106053]">
            <tr>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Exam</th>
              <th className="px-4 py-2">Student Reg No</th>
              <th className="px-4 py-2">Submitted At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className="text-center border-b hover:bg-gray-50">
                <td className="px-4 py-2">{sub.courseId}</td>
                <td className="px-4 py-2">{sub.examName}</td>
                <td className="px-4 py-2">{sub.studentRegNo}</td>
                <td className="px-4 py-2">{new Date(sub.submissionTime).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {/* <button
                    onClick={() => setSelected(sub)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    View
                  </button> */}
                  <button
                    onClick={() => navigate(`/lecturer/view-exam/${sub._id}`)}
                    className="text-blue-600 hover:underline mr-4"
                    >
                    View
                    </button>
                  <button
                    onClick={() => handleDownloadPDF(sub)}
                    className="text-green-600 hover:underline"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* View Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">Submission Details</h3>
            <p><strong>Exam:</strong> {selected.examName}</p>
            <p><strong>Student:</strong> {selected.studentRegNo}</p>
            <p><strong>Course:</strong> {selected.courseId}</p>
            <p><strong>Submitted at:</strong> {new Date(selected.submissionTime).toLocaleString()}</p>

            <div className="mt-4">
              {selected.answers.map((ans, idx) => (
                <div key={idx} className="mb-3">
                  <p className="font-semibold">{idx + 1}. {ans.question}</p>
                  <p className="ml-4 text-gray-700">{ans.answer}</p>
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
    </div>
  );
};

export default LecturerSubmissions;
