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
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleCreate = async () => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:3001/api/admin/create-admin', {
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

      // Auto-close popup and modal after 3.5 seconds
      setTimeout(() => {
        setIsSuccessDialogOpen(false);
        onClose();
      }, 3500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error creating admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mb-4">Create Admin</h2>
        <div className="space-y-4">
          {[
            { label: 'First Name', value: first_name, setter: setFirst_name, type: 'text' },
            { label: 'Last Name', value: last_name, setter: setLast_name, type: 'text' },
            { label: 'Username', value: username, setter: setUsername, type: 'text' },
            { label: 'Email', value: email, setter: setEmail, type: 'email' },
            { label: 'Password', value: password, setter: setPassword, type: 'password' },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm font-semibold text-teal-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
                placeholder={field.label}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
              />
            </div>
          ))}

          {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}

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
