import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface Props {
  onClose: () => void;
  onSuccess: () => void; // Optional: callback after success to refresh list or close modal
}

const RegCourseModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    faculty: '',
    program: '',
    courseTitle: '',
    courseCode: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [specificError, setSpecificError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (specificError) setSpecificError('');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
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
      await axios.post('https://ciu-backend.onrender.com/api/admin/create-course', formData);

      setFormData({ faculty: '', program: '', courseTitle: '', courseCode: '' });
      setIsSuccessDialogOpen(true);

      if (onSuccess) onSuccess();

      // Auto-close success dialog and modal after 2.5 seconds
      setTimeout(() => {
        setIsSuccessDialogOpen(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setSpecificError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-black text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">Create Course</h2>

        {specificError && (
          <div className="bg-red-100 text-red-700 border border-red-400 rounded p-3 mb-4">
            {specificError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pr-2">
          {[
            { label: 'Faculty', name: 'faculty', placeholder: 'Enter Faculty' },
            { label: 'Program', name: 'program', placeholder: 'Enter Program' },
            { label: 'Course Title', name: 'courseTitle', placeholder: 'Enter Course Title' },
            { label: 'Course Code', name: 'courseCode', placeholder: 'Enter Course Code' },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-teal-700">
                {label}
              </label>
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500 ${
                  errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div className="sticky bottom-0 bg-white pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              {isSubmitting ? 'Submitting...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>

      {/* Success popup */}
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle className="text-green-700 font-bold">Course Created</DialogTitle>
        <DialogContent className="text-gray-700">
          The course was successfully created.
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegCourseModal;
