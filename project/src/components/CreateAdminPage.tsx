import React, { useState } from 'react';
import axios from 'axios';

const CreateAdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/create-admin', {
        username,
        password,
      });
      alert('Admin created');
      setUsername('');
      setPassword('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating admin');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Admin</h1>
      <input
        className="w-full border p-2 mb-4"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2" onClick={handleCreate}>
        Create Admin
      </button>
    </div>
  );
};

export default CreateAdminPage;
