import  { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardCard from '../Lecturer/DashboardCard';

interface Metric {
  title: string;
  value: number;
  icon: string;
}

export default function LecturerDashboardContent() {
  const [lecturerMetrics, setLecturerMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ciu-backend.onrender.com/exam-paper/count');
        const { data } = response;

        setLecturerMetrics([
          { title: "Courses", value: data.coursesCount, icon: "📘" },
          { title: "Students Enrolled", value: data.studentsCount, icon: "👩‍🎓" },
          { title: "Question Banks", value: data.questionBankCount, icon: "📝" },
          { title: "Upcoming Exams", value: data.upcomingExamsCount, icon: "📝" },
          { title: "Ongoing Exams", value: data.ongoingAssessmentCount, icon: "📝" },
        ]);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div className="flex-1 ml-0 p-5 border-transparent">
          <h2 className="text-[24px] font-bold mb-5 text-[#106053]">
            Lecturer Dashboard
          </h2>
          <div className="grid grid-cols-4 gap-5">
            {lecturerMetrics.map((metric, index) => (
              <DashboardCard
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
