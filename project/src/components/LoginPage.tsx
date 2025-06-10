import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [universityNumber, setUniversityNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:3001/api/auth/login', {
  //       universityNumber,
  //       password,
  //     });

  //     localStorage.setItem("lecturerId", response.data._id);
  //     console.log("Stored lecturerId:", response.data._id);


  //     alert(response.data.message); // optional
  //     navigate('/verify-token'); // 🔁 redirect here
  //   } catch (error: any) {
  //     alert(error.response.data.message);
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        universityNumber,
        password,
      });
  
      alert(response.data.message); // Token sent to email
      navigate('/verify-token'); // redirect to verify token page
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lecturer Login</h1>
      <input
        className="w-full border p-2 mb-4"
        placeholder="University Number"
        value={universityNumber}
        onChange={(e) => setUniversityNumber(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;