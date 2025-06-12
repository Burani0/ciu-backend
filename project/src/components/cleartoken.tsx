import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cleartoken = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/cleartoken', {
        username,
        token,
      });

      // Optionally store auth status or lecturer ID here
      localStorage.setItem('adminVerified', 'true');

      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Verify Login Token</h1>

      <input
        className="w-full border p-2 mb-4"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Enter token from email"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button className="bg-green-600 text-white px-4 py-2" onClick={handleVerify}>
        Verify Token
      </button>
    </div>
  );
};

export default  Cleartoken;
