// ViewExam.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewExam = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      const res = await fetch(`https://ciu-backend.onrender.com/api/exam/fetch_exam_by_id/${submissionId}`);
      const data = await res.json();
      setSubmission(data);
    };

    fetchSubmission();
  }, [submissionId]);

  if (!submission) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#0F533D]">Exam: {submission.examName}</h2>
      <p><strong>Student:</strong> {submission.studentRegNo}</p>
      <p><strong>Course:</strong> {submission.courseId}</p>
      <p><strong>Submitted at:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>

      <div className="mt-6 space-y-4">
        {submission.answers.map((ans: any, idx: number) => (
          <div key={idx}>
            <p className="font-semibold">{idx + 1}. {ans.question}</p>
            <p className="text-gray-700 ml-4">{ans.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewExam;
