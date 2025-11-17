import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiSolidUserRectangle } from 'react-icons/bi';
import { FaUser, FaKey } from 'react-icons/fa';

const Cleartoken = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-fill username from login page
  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
    }
  }, [location.state]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://examiner.ciu.ac.ug/api/admin/cleartoken', {
        username,
        token,
      });
  
      // Extract admin info from response.data
      const { adminId, username: adminUsername, email } = response.data;
  
      localStorage.setItem('adminVerified', 'true');
      localStorage.setItem('adminId', adminId);
      localStorage.setItem('adminUsername', adminUsername);
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('token', token);
  
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
      <div className="relative w-[420px] h-[600px] bg-white text-[#106053]">
        <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6] text-white">
          <img
            src="/public/CIU-exam-system-logo.png"
            alt="CIU Exam System Logo"
            className="max-h-[120px] object-contain"
          />
        </div>

        <form onSubmit={handleVerify} className="w-full p-10">
          <div className="flex justify-center mb-6">
            <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
              <BiSolidUserRectangle className="text-[#106053]" size={42} />
            </div>
          </div>

          <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
            />
            <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
          </div>

          <div className="relative w-full h-[50px] bg-[#d6d6d6] mb-8">
            <input
              type="text"
              placeholder="Token from email"
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
              className="w-full h-full bg-transparent border-none outline-none border-[2px] border-white/10 rounded-[40px] text-[16px] text-black px-[20px] pr-[45px] placeholder:text-[#4f4e4e]"
            />
            <FaKey className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px]" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[45px] bg-[#106053] text-white border-none outline-none cursor-pointer text-[16px] font-bold hover:bg-[#0b3f37] flex items-center justify-center disabled:opacity-50"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? 'Verifying...' : 'Verify Token'}
          </button>

          {error && (
            <p className="text-red-600 font-bold mt-2 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Cleartoken;
