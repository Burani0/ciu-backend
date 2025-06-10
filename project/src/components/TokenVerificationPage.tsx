import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TokenVerificationPage = () => {
  const [universityNumber, setUniversityNumber] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const storedLecturerId = localStorage.getItem('lecturerId');
    if (!storedLecturerId) {
      navigate('/login');
    }
  }, [navigate]);

  // const handleVerify = async () => {
  //   try {
  //     await axios.post('http://localhost:3001/api/auth/verify', {
  //       universityNumber,
  //       token,
  //     });
      
  //     localStorage.setItem('lecturerId', response.data._id);
  //     // Optionally store auth status or lecturer ID here
  //     localStorage.setItem('lecturerVerified', 'true');

  //     navigate('/lecturer');
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || 'Verification failed');
  //   }
  // };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify', {
        universityNumber,
        token,
      });
  
      localStorage.setItem('lecturerId', response.data.lecturerId);
      localStorage.setItem('lecturerVerified', 'true');
  
      navigate('/lecturer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Verify Login Token</h1>

      <input
        className="w-full border p-2 mb-4"
        placeholder="University Number"
        value={universityNumber}
        onChange={(e) => setUniversityNumber(e.target.value)}
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

export default TokenVerificationPage;
