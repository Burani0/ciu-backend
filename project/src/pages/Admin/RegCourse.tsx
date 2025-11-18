
import React, { useState,  ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const RegCourseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    facultyName: '',
    courseName: '',
    courseUnits: '',
    courseUnitsCode: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [specificError, setSpecificError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (specificError) setSpecificError('');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const fields = ['facultyName', 'courseName', 'courseUnits', 'courseUnitsCode'];

    fields.forEach((field) => {
      if (!formData[field as keyof typeof formData].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')[0].toUpperCase()}${field
          .slice(1)
          .replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    const units = formData.courseUnits.split(',').map((u) => u.trim());
    if (units.some((u) => !u)) newErrors.courseUnits = 'Invalid course units format';

    const codes = formData.courseUnitsCode.split(',').map((c) => c.trim());
    if (codes.some((c) => !c)) newErrors.courseUnitsCode = 'Invalid course unit codes format';

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSpecificError('');
    setErrors({});
    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        facultyName: formData.facultyName.trim(),
        courseName: formData.courseName.trim(),
        courseUnits: formData.courseUnits.split(',').map((u) => u.trim()),
        courseUnitCode: formData.courseUnitsCode.split(',').map((c) => c.trim()),
      };

      const response = await fetch('https://examiner.ciu.ac.ug/coursesAdd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/admin-courses', {
          state: { successMessage: 'Course successfully registered!' },
        });
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setSpecificError(
            errorData.message ||
              'A course with this name already exists in the specified faculty'
          );
        } else {
          setErrors(errorData.errors || {});
        }
      }
    } catch (error) {
      console.error('Error registering course:', error);
      setSpecificError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Register Course</h2>

        {specificError && (
          <div className="bg-red-100 text-red-700 border border-red-400 rounded p-3 mb-4">
            {specificError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Faculty Name', name: 'facultyName', placeholder: 'Enter Faculty Name' },
            { label: 'Course Name', name: 'courseName', placeholder: 'Enter Course Name' },
            {
              label: 'Course Units',
              name: 'courseUnits',
              placeholder: 'Enter multiple course units (comma-separated)',
            },
            {
              label: 'Course Units Code',
              name: 'courseUnitsCode',
              placeholder: 'Enter multiple course unit codes (comma-separated)',
            },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegCourseModal;
