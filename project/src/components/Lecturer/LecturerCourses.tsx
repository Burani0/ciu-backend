import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Lecturer/Headerpop";
import Sidebar from "../Lecturer/Sidebarpop";
import MobileMenu from "../Lecturer/MobileMenu";
import { SidebarProvider2 } from "../Lecturer/SidebarContext2";

interface Course {
  _id: string;
  faculty: string;
  program: string;
  courseTitle: string;
  courseCode: string;
}

const LectCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const lecturerId = localStorage.getItem('lecturerId');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!lecturerId) {
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
  try {
    const res = await fetch(`https://ciu-backend.onrender.com/api/admin/lecturers/${lecturerId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const courseIds = data.assignedCourses || [];

    const coursePromises = courseIds.map(async (courseId: string) => {
      const res = await fetch(`https://ciu-backend.onrender.com/api/admin/courses/${courseId}`);
      if (!res.ok) throw new Error(`Failed to fetch course ${courseId}`);
      return await res.json();
    });

    const coursesData = await Promise.all(coursePromises);
    setCourses(coursesData);
  } catch (error) {
    console.error("Failed to fetch lecturer courses", error);
  }
};


    fetchCourses();
  }, [lecturerId, navigate]);

  const filteredCourses = courses.filter((course) =>
    // course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  (course?.courseTitle ?? '').toLowerCase().includes(searchTerm.toLowerCase())

  );

  return (
    <SidebarProvider2>
      <div className="flex flex-col h-screen w-full font-['Roboto']">
        <div className="flex-1">
          <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
          <div className="flex">
            {!isMobile && <Sidebar />}
            {isMobile && (
              <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            )}
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#0F533D]">Assigned Courses</h2>
                <input
                  type="text"
                  placeholder="Search by course title..."
                  className="px-3 py-2 border border-gray-300 rounded text-sm w-[250px] text-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
                <thead>
                  <tr>
                    {["Faculty", "Program", "Course Title", "Course Code"].map((col, index) => (
                      <th
                        key={index}
                        className="bg-[#E6F1EB] text-[#106053] px-4 py-3 text-center font-bold uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="text-center border-b hover:bg-gray-100">
                      <td className="py-2">{course.faculty}</td>
                      <td className="py-2">{course.program}</td>
                      <td className="py-2">{course.courseTitle}</td>
                      <td className="py-2">{course.courseCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider2>
  );
};

export default LectCourses;