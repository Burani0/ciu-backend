import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface CreateAdminModalProps {
  onClose: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onClose }) => {
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleCreate = async () => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await axios.post('https://examiner.ciu.ac.ug/api/admin/create-admin', {
        first_name,
        last_name,
        username,
        email,
        password,
      });

      // Show styled success popup
      setIsSuccessDialogOpen(true);

      // Reset form fields
      setFirst_name('');
      setLast_name('');
      setUsername('');
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error creating admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-black text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mb-4">Create Admin</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">First Name</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="First name"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Last Name</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Last name"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Username</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Email</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-teal-700 mb-1">Password</label>
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
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
          >
            {isSubmitting ? 'Creating...' : 'Create Admin'}
          </button>
        </div>
      </div>

      {/* Styled MUI popup dialog */}
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle className="text-green-700 font-bold">Admin Created</DialogTitle>
        <DialogContent className="text-gray-700">
          The admin was successfully created.
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAdminModal;