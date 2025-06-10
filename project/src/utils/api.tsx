export const fetchLecturerWithCourses = async (lecturerId: string) => {
    const res = await fetch(`http://localhost:3001/api/admin/lecturers/${lecturerId}`);
    if (!res.ok) throw new Error("Failed to fetch lecturer");
    return res.json();
  };