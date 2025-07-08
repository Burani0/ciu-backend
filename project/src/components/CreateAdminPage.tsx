import React, { useState } from 'react';
import axios from 'axios';

const CreateAdminPage = () => {
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleCreate = async () => {
    try {
      await axios.post('https://ciu-backend.onrender.com/api/admin/create-admin', {
        first_name,
        last_name,
        username,
        email,
        password,
      });
      alert('Admin created');
      setFirst_name('');
      setLast_name('');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating admin');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Admin</h1>
      <input
        className="w-full border p-2 mb-4"
        placeholder="First name"
        value={first_name}
        onChange={(e) => setFirst_name(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Lastname"
        value={last_name}
        onChange={(e) => setLast_name(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <input
          className="w-full border p-2 mb-4"
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
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
      <button className="bg-green-600 text-white px-4 py-2" onClick={handleCreate}>
        Create Admin
      </button>
    </div>
  );
};

export default CreateAdminPage;