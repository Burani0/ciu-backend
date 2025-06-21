import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface EditLecturerModalProps {
  onClose: () => void;
  onSuccess: () => void;
  lecturerId: string;
}

interface CourseOption {
  value: string;
  label: string;
}

const EditLecturerModal: React.FC<EditLecturerModalProps> = ({
  onClose,
  onSuccess,
  lecturerId,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    universityNumber: '',
    password: '',
  });

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchLecturerAndCourses = async () => {
      try {
        const [lecturerRes, coursesRes] = await Promise.all([
          axios.get(`https://ciu-backend.onrender.com/api/admin/lecturers/${lecturerId}`),
          axios.get('https://ciu-backend.onrender.com/api/admin/courses'),
        ]);

        const lecturer = lecturerRes.data;
        const allCourses = coursesRes.data.map((course: any) => ({
          label: course.courseTitle,
          value: course._id,
        }));

        setFormData({
          firstName: lecturer.firstName || '',
          lastName: lecturer.lastName || '',
          email: lecturer.email || '',
          universityNumber: lecturer.universityNumber || '',
          password: lecturer.password || '',
        });

        const assigned = allCourses.filter((c: CourseOption) =>
          lecturer.assignedCourses?.includes(c.value)
        );

        setCourses(allCourses);
        setSelectedCourses(assigned);
      } catch (error) {
        console.error('Error fetching lecturer or courses:', error);
      }
    };

    fetchLecturerAndCourses();
  }, [lecturerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await axios.put(`https://ciu-backend.onrender.com/api/admin/lecturers/${lecturerId}`, {
        ...formData,
        assignedCourses: selectedCourses.map((c) => c.value),
      });

      setSuccessMsg('Lecturer updated successfully!');
      onSuccess();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Update failed.');
    } finally {
      setIsSubmitting(false);
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
          Edit Lecturer
        </h2>

        <div className="overflow-y-auto max-h-[75vh] px-6 pb-4 rounded-b-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                First Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Last Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                University Number
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                name="universityNumber"
                value={formData.universityNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Assigned Courses
              </label>
              <Select
                options={courses}
                isMulti
                value={selectedCourses}
                onChange={(selected) => setSelectedCourses(selected || [])}
                placeholder="Search or select courses..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: 'rgb(20 184 166)',
                    boxShadow: 'none',
                    '&:hover': { borderColor: 'rgb(13 148 136)' },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#E6F1EB' : 'white',
                    color: 'black',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: 'rgb(20 184 166)',
                    color: 'white',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: 'white',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: 'white',
                    ':hover': {
                      backgroundColor: 'rgb(13 148 136)',
                      color: 'white',
                    },
                  }),
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>

            {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
            {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLecturerModal;
