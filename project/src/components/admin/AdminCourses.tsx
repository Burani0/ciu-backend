import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import Header from "../../components/admin/Headerpop";
import Sidebar from "../../components/admin/SideBarpop";
import MobileMenu from "../../components/admin/MobileMenu";
import { SidebarProvider1 } from "../../components/admin/SidebarContext";
import EditCourseModal from "./EditCourseModal";

const BASE_URL = "http://localhost:3001/api/admin";

interface Course {
  _id: string;
  faculty: string;
  program: string;
  courseTitle: string[] | string;
  courseCode: string[] | string;
}

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/courses`);
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((course) =>
        course.courseTitle.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, courses]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    try {
      await axios.delete(`${BASE_URL}/courses/${selectedCourse._id}`);
      setCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
      setFilteredCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
    } catch (err) {
      console.error("Error deleting course:", err);
    }
    setDialogOpen(false);
  };

  const handleEditClick = (id: string) => {
    setEditCourseId(id);
    setShowEditModal(true);
  };

  return (
    <SidebarProvider1>
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
              <div className="flex justify-between items-center py-5">
                <button
                  className="bg-[#0F533D] text-white py-3 px-6 min-w-[200px] text-base"
                  onClick={() => (window.location.href = "/regCourse")}
                >
                  Add New Course
                </button>
                <input
                  type="text"
                  placeholder="Search by course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-3 px-4 border border-gray-300 rounded text-base text-gray-600 w-[300px]"
                />
              </div>

              <h2 className="text-2xl font-semibold mb-4">Courses</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg">
                  <thead>
                    <tr className="bg-gray-100 text-[#106053] text-center font-bold uppercase">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Faculty</th>
                      <th className="py-3 px-4">Program</th>
                      <th className="py-3 px-4">Course Title</th>
                      <th className="py-3 px-4">Course Code</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course, index) => (
                      <tr key={course._id} className="text-center hover:bg-gray-100">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{course.faculty}</td>
                        <td className="py-2 px-4">
                          <ul>
                            {[course.program].flat().map((prog, i) => (
                              <li key={i}>• {prog}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-2 px-4">
                          <ul>
                            {[course.courseTitle].flat().map((title, i) => (
                              <li key={i}>• {title}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-2 px-4">
                          <ul>
                            {[course.courseCode].flat().map((code, i) => (
                              <li key={i}>• {code}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-2 px-4 flex justify-center gap-2">
                          <button onClick={() => handleEditClick(course._id)}>
                            <FaEdit className="text-[#106053] hover:text-[#0B3F37] text-lg" />
                          </button>
                          <button onClick={() => handleDeleteClick(course)}>
                            <FaTrash className="text-red-600 hover:text-[#990808] text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Delete Dialog */}
              <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete the course <strong>{selectedCourse?.courseTitle}</strong>?
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={confirmDelete} color="error" variant="contained">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Edit Modal */}
              {showEditModal && editCourseId && (
                <EditCourseModal
                  courseId={editCourseId}
                  onClose={() => setShowEditModal(false)}
                  onSuccess={() => {
                    axios.get(`${BASE_URL}/courses`).then((res) => {
                      setCourses(res.data);
                      setFilteredCourses(res.data);
                    });
                  }}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider1>
  );
};

export default AdminCourses;