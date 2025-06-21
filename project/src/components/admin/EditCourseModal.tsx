import React, { useEffect, useState } from "react";

interface FormData {
  faculty: string;
  program: string;
  courseTitle: string;
  courseCode: string;
}

interface EditCourseModalProps {
  onClose: () => void;
  onSuccess: () => void;
  courseId: string;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  onClose,
  onSuccess,
  courseId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    faculty: "",
    program: "",
    courseTitle: "",
    courseCode: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `https://ciu-backend.onrender.com/api/admin/courses/${courseId}`
        );
        if (!response.ok) throw new Error("Failed to fetch course");
        const data = await response.json();
        setFormData({
          faculty: data.faculty || "",
          program: data.program || "",
          courseTitle: data.courseTitle || "",
          courseCode: data.courseCode || "",
        });
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://ciu-backend.onrender.com/api/admin/courses/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update course");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-red-500 text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mt-8 mb-2">
          Edit Course
        </h2>

        <div className="overflow-y-auto max-h-[75vh] px-6 pb-4 rounded-b-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Faculty
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Program
              </label>
              <input
                type="text"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;
