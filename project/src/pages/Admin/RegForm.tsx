import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/admin/Headerpop';
import Sidebar from '../../components/admin/SideBarpop';
import MobileMenu from '../../components/admin/MobileMenu';

interface Course {
  id: number;
  courseName: string;
}

const RegForm: React.FC = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    registrationNo: '',
    role: 'student',
    dateTime: '',
    courseId: '',
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/coursesAdd');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z]+@student\.ciu\.ac\.ug$/;
    if (!emailRegex.test(user.email)) {
      alert("Email format should be 'firstname@student.ciu.ac.ug'");
      return;
    }

    if (!user.courseId) {
      alert('Course ID should not be empty');
      return;
    }

    const userData = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      registrationNo: user.registrationNo,
      role: user.role,
      dateTime: user.dateTime,
      courseId: parseInt(user.courseId),
    };

    try {
      const response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      alert('User registered successfully!');
      navigate('/table');
      setUser({
        firstName: '',
        lastName: '',
        email: '',
        registrationNo: '',
        role: 'student',
        dateTime: '',
        courseId: '',
      });
    } catch (error: any) {
      alert(`Error creating user: ${error.message}`);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        {isMobile && <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />}

        <div className="flex flex-1 items-center justify-center p-4">
          <div className="bg-white/95 p-8 rounded-xl shadow-lg w-full max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-[#065c4c] mb-6">User Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-[#106053] uppercase mb-1">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    value={user.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 border border-[#106053] text-base"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-[#106053] uppercase mb-1">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    value={user.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 border border-[#106053] text-base"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-[#106053] uppercase mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    placeholder="firstname@student.ciu.ac.ug"
                    className="w-full px-4 py-3 border border-[#106053] text-base"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-[#106053] uppercase mb-1">Course</label>
                  <select
                    name="courseId"
                    value={user.courseId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#106053] text-base bg-white text-gray-800"
                  >
                    <option value="">Select a Course</option>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.courseName}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading courses...</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-[#106053] uppercase mb-1">Registration No</label>
                  <input
                    name="registrationNo"
                    type="text"
                    value={user.registrationNo}
                    onChange={handleChange}
                    required
                    placeholder="Enter your registration number"
                    className="w-full px-4 py-3 border border-[#106053] text-base"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-[#106053] uppercase mb-1">Role</label>
                  <input
                    name="role"
                    type="text"
                    value={user.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#106053] text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#106053] uppercase mb-1">Date & Time</label>
                <input
                  name="dateTime"
                  type="datetime-local"
                  value={user.dateTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#106053] text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white text-base font-bold rounded bg-[#106053] hover:bg-[#0c4b42] transition-colors duration-300"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegForm;
