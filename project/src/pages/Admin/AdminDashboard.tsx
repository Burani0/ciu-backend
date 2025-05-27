import { useState, useEffect, FC } from 'react';
import Header from '../../components/admin/Headerpop';
import Sidebar from '../../components/admin/SideBarpop';
import MobileMenu from "../../components/admin/MobileMenu";
import axios from 'axios';
import { SidebarProvider1 } from '../../components/admin/SidebarContext'; // Adjust path to your Sidebar context file
import DashboardCard from '../../components/admin/DashboardCard';

interface CountResponse {
  count: number;
}

const Dashboard: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [studentCount, setStudentCount] = useState<number>(0);
  const [programCount, setProgramCount] = useState<number>(0);
  const [lecturerCount, setLecturerCount] = useState<number>(0);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [courseUnitCount, setCourseUnitCount] = useState<number>(0);
  const [ongoingAssessmentsCount, setOngoingAssessmentsCount] = useState<number>(0);
  const [upcomingAssessmentsCount, setUpcomingAssessmentsCount] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get<CountResponse>('http://localhost:3000/students/count/students');
        setStudentCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    const fetchProgramCount = async () => {
      try {
        const response = await axios.get<CountResponse>('http://localhost:3000/students/count/programs');
        setProgramCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching program count:", error);
      }
    };

    const fetchLecturerCount = async () => {
      try {
        const response = await axios.get<number>('http://localhost:3000/lecturerReg/count');
        setLecturerCount(response.data);
      } catch (error) {
        console.error("Error fetching lecturer count:", error);
      }
    };

    const fetchCourseCount = async () => {
      try {
        const response = await axios.get<number>('http://localhost:3000/coursesAdd/count');
        setCourseCount(response.data);
      } catch (error) {
        console.error("Error fetching course count:", error);
      }
    };

    const fetchCourseUnitCount = async () => {
      try {
        const response = await axios.get<CountResponse>('http://localhost:3000/coursesAdd/units/count');
        setCourseUnitCount(response.data.count);
      } catch (error) {
        console.error("Error fetching course unit count:", error);
      }
    };

    const fetchOngoingAssessmentsCount = async () => {
      try {
        const response = await axios.get<number>('http://localhost:3000/exam-paper/ongoing');
        setOngoingAssessmentsCount(response.data);
      } catch (error) {
        console.error("Error fetching ongoing assessments count:", error);
      }
    };

    const fetchUpcomingAssessmentsCount = async () => {
      try {
        const response = await axios.get<number>('http://localhost:3000/exam-paper/upcoming');
        setUpcomingAssessmentsCount(response.data);
      } catch (error) {
        console.error("Error fetching upcoming assessments count:", error);
      }
    };

    fetchStudentCount();
    fetchProgramCount();
    fetchLecturerCount();
    fetchCourseCount();
    fetchCourseUnitCount();
    fetchOngoingAssessmentsCount();
    fetchUpcomingAssessmentsCount();
  }, []);

  return (
    <div className="font-['Roboto'] m-0 p-0">
        <SidebarProvider1>
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
              <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            </>
          )}
          <main className={`flex-1 overflow-auto text-[#105F53] p-6 md:p-4 ${isMobileMenuOpen ? 'opacity-50 transition-opacity duration-300 ease-in-out' : ''}`}>
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-1">
              <DashboardCard title="Registered Students" value={studentCount} icon="🎓" />
              <DashboardCard title="Registered Lecturers" value={lecturerCount} icon="👨‍💻" />
              <DashboardCard title="Registered Courses" value={courseCount} icon="📖" />
              <DashboardCard title="Registered Course Units" value={courseUnitCount} icon="📖" />
              <DashboardCard title="Ongoing Exams/Assessments" value={ongoingAssessmentsCount} icon="📝" />
              <DashboardCard title="Upcoming Exams/Assessments" value={upcomingAssessmentsCount} icon="📝" />
            </div>
          </main>
          
        </div>
        
      </div>
      </SidebarProvider1>
    </div>
    
  );
};

export default Dashboard;
