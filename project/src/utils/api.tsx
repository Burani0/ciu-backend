export const fetchLecturerWithCourses = async (lecturerId: string) => {
    const res = await fetch(`https://ciu-backend.onrender.com/api/admin/lecturers/${lecturerId}`);
    if (!res.ok) throw new Error("Failed to fetch lecturer");
    return res.json();
  };