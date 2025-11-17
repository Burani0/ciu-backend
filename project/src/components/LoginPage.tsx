// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const [universityNumber, setUniversityNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
  

//   // const handleLogin = async () => {
//   //   try {
//   //     const response = await axios.post('http://localhost:3001/api/auth/login', {
//   //       universityNumber,
//   //       password,
//   //     });

//   //     localStorage.setItem("lecturerId", response.data._id);
//   //     console.log("Stored lecturerId:", response.data._id);


//   //     alert(response.data.message); // optional
//   //     navigate('/verify-token'); // 🔁 redirect here
//   //   } catch (error: any) {
//   //     alert(error.response.data.message);
//   //   }
//   // };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/auth/login', {
//         universityNumber,
//         password,
//       });
  
//       alert(response.data.message); // Token sent to email
//       navigate('/verify-token'); // redirect to verify token page
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Login failed');
//     }
//   };
  

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Lecturer Login</h1>
//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="University Number"
//         value={universityNumber}
//         onChange={(e) => setUniversityNumber(e.target.value)}
//       />
//       <input
//         className="w-full border p-2 mb-4"
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button className="bg-blue-600 text-white px-4 py-2" onClick={handleLogin}>
//         Login
//       </button>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [universityNumber, setUniversityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('https://examiner.ciu.ac.ug/api/auth/login', {
        universityNumber,
        password,
      });

      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 2000);
      setTimeout(() => navigate('/verify-token'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setTimeout(() => setError(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Lecturer Login</h1>

      <form onSubmit={handleLogin}>
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
        <button
          type="submit"
          disabled={loading || !universityNumber || !password}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {(message || error) && (
        <div
          className={`
            fixed top-18 left-1/2 transform -translate-x-1/2 
            px-6 py-3 rounded shadow-lg text-center 
            transition-opacity duration-500
            ${message ? 'bg-gray-300 text-gray-900' : ''}
            ${error ? 'bg-gray-300 text-red-700' : ''}
          `}
          style={{opacity: message || error ? 1 : 0}}
        >
          {message || error}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
