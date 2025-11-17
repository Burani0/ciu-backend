


import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Select from 'react-select';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface CourseOption {
  value: string;
  label: string;
  code: string;
}

const CreateLecturerModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [universityNumber, setUniversityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('https://examiner.ciu.ac.ug/api/admin/courses');
        const formatted = res.data.map((course: any) => ({
          label: course.courseTitle,
          value: course._id,
          code: course.courseCode,
        }));
        setCourses(formatted);
      } catch (err) {
        console.error('Error fetching courses', err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await axios.post('https://examiner.ciu.ac.ug/api/admin/register-lecturer', {
        firstName,
        lastName,
        email,
        universityNumber,
        password,
        courseIds: selectedCourses.map((course) => course.value),
        courseCodes: selectedCourses.map((course) => course.code),
      });
      setSuccessMsg('Lecturer registered successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setUniversityNumber('');
      setPassword('');
      setSelectedCourses([]);
      onSuccess();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-red-500 text-xl"
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mt-8 mb-2">
          Register Lecturer
        </h2>
        <div className="overflow-y-auto max-h-[75vh] px-6 pb-4 rounded-b-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                First Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Last Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                University Number
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                placeholder="University Number"
                value={universityNumber}
                onChange={(e) => setUniversityNumber(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-teal-700 hover:text-teal-900"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1">
                Assign Courses
              </label>
              <Select
                options={courses}
                isMulti
                value={selectedCourses}
                onChange={(selected) => setSelectedCourses(selected || [])}
                className="text-sm"
                classNamePrefix="react-select"
                placeholder="Search or select courses..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "rgb(20 184 166)",
                    boxShadow: "none",
                    "&:hover": { borderColor: "rgb(13 148 136)" },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#E6F1EB" : "white",
                    color: "black",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "rgb(20 184 166)",
                    color: "white",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "white",
                    ":hover": {
                      backgroundColor: "rgb(13 148 136)",
                      color: "white",
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
              {isSubmitting ? 'Registering...' : 'Register Lecturer'}
            </button>

            {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
            {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLecturerModal;