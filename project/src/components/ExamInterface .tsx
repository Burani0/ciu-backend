import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Exam {
  id: number;
  name: string;
  startTime: Date;
}

const mockExams: Exam[] = [
  { id: 1, name: "Math Exam", startTime: new Date(Date.now() + 5 * 60 * 1000) },
  { id: 2, name: "Science Exam", startTime: new Date(Date.now() + 15 * 60 * 1000) },
  { id: 3, name: "History Exam", startTime: new Date(Date.now() - 2 * 60 * 1000) },
];

const ExamInterface : React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setExams(mockExams);
  }, []);

  const isAccessible = (startTime: Date): boolean => {
    const now = new Date();
    const diff = (startTime.getTime() - now.getTime()) / 1000 / 60;
    return diff <= 10 && diff >= -60;
  };

  const handleStartExam = () => {
    navigate("/proctoring");
  };

  return (
    // <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    //   <h2 className="text-2xl font-bold mb-6 text-center">Your Exams</h2>
    //   <table className="min-w-full border border-gray-200 rounded overflow-hidden">
    //     <thead className="bg-gray-100">
    //       <tr>
    //         <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Exam Name</th>
    //         <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Start Time</th>
    //         <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Action</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {exams.map((exam) => (
    //         <tr key={exam.id} className="hover:bg-gray-50">
    //           <td className="py-3 px-4 border-b">{exam.name}</td>
    //           <td className="py-3 px-4 border-b">{exam.startTime.toLocaleTimeString()}</td>
    //           <td className="py-3 px-4 border-b">
    //             {isAccessible(exam.startTime) ? (
    //               <button
    //                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    //                 onClick={handleStartExam}
    //               >
    //                 Start Exam
    //               </button>
    //             ) : (
    //               <span className="text-sm text-red-500">Not yet available</span>
    //             )}
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
   
    <div className="max-w-4xl mx-auto mt-24 bg-white rounded-xl shadow-lg overflow-hidden">
    <h2 className="text-[1.8rem] font-semibold mb-6 text-center text-[#106053]">
      Your Exams
    </h2>
    <div className="overflow-x-auto max-h-[400px]">
      <table className="w-full border-collapse">
        <thead className="bg-[#106053] text-white sticky top-0 z-10">
          <tr>
            <th className="py-4 px-6 text-left">Exam Name</th>
            <th className="py-4 px-6 text-left">Start Time</th>
            <th className="py-4 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} className="hover:bg-[#f1f5f9] transition-colors">
              <td className="py-4 px-6 border-b border-gray-200">{exam.name}</td>
              <td className="py-4 px-6 border-b border-gray-200">
                {exam.startTime.toLocaleTimeString()}
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                {isAccessible(exam.startTime) ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    onClick={handleStartExam}
                  >
                    Start Exam
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">Not yet available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  


  );
};

export default ExamInterface ;
