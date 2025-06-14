// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const TokenVerificationPage = () => {
//   const [universityNumber, setUniversityNumber] = useState('');
//   const [token, setToken] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();


//   useEffect(() => {
//     const storedLecturerId = localStorage.getItem('lecturerId');
//     if (!storedLecturerId) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   // const handleVerify = async () => {
//   //   try {
//   //     await axios.post('http://localhost:3001/api/auth/verify', {
//   //       universityNumber,
//   //       token,
//   //     });
      
//   //     localStorage.setItem('lecturerId', response.data._id);
//   //     // Optionally store auth status or lecturer ID here
//   //     localStorage.setItem('lecturerVerified', 'true');

//   //     navigate('/lecturer');
//   //   } catch (err: any) {
//   //     setError(err.response?.data?.message || 'Verification failed');
//   //   }
//   // };

//   const handleVerify = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/auth/verify', {
//         universityNumber,
//         token,
//       });
  
//       localStorage.setItem('lecturerId', response.data.lecturerId);
//       localStorage.setItem('lecturerVerified', 'true');
  
//       navigate('/lecturer');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Verification failed');
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">Verify Login Token</h1>

//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="University Number"
//         value={universityNumber}
//         onChange={(e) => setUniversityNumber(e.target.value)}
//       />
//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="Enter token from email"
//         value={token}
//         onChange={(e) => setToken(e.target.value)}
//       />

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <button className="bg-green-600 text-white px-4 py-2" onClick={handleVerify}>
//         Verify Token
//       </button>
//     </div>
//   );
// };

// export default TokenVerificationPage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const TokenVerificationPage = () => {
//   const [universityNumber, setUniversityNumber] = useState('');
//   const [token, setToken] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedLecturerId = localStorage.getItem('lecturerId');
//     if (!storedLecturerId) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault(); // prevent default form submission
//     try {
//       const response = await axios.post('http://localhost:3001/api/auth/verify', {
//         universityNumber,
//         token,
//       });

//       localStorage.setItem('lecturerId', response.data.lecturerId);
//       localStorage.setItem('lecturerVerified', 'true');

//       navigate('/lecturer');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Verification failed');

//       // Auto-hide error after 2 seconds
//       setTimeout(() => {
//         setError('');
//       }, 2000);
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto relative">
//       <h1 className="text-xl font-bold mb-4">Verify Login Token</h1>

//       <form onSubmit={handleVerify}>
//         <input
//           className="w-full border p-2 mb-4"
//           placeholder="University Number"
//           value={universityNumber}
//           onChange={(e) => setUniversityNumber(e.target.value)}
//         />
//         <input
//           className="w-full border p-2 mb-4"
//           placeholder="Enter token from email"
//           value={token}
//           onChange={(e) => setToken(e.target.value)}
//         />

//         <button
//           type="submit"
//           className="bg-green-600 text-white px-4 py-2"
//         >
//           Verify Token
//         </button>
//       </form>

//       {error && (
//         <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-50">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TokenVerificationPage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import * as jwt_decode from 'jwt-decode';

// interface DecodedToken {
//   id: string;
//   universityNumber: string;
//   email: string;
//   iat: number;
//   exp: number;
// }

// const TokenVerificationPage = () => {
//   const [universityNumber, setUniversityNumber] = useState('');
//   const [token, setToken] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedLecturerId = localStorage.getItem('lecturerId');
//     if (!storedLecturerId) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault(); // prevent default form submission
//     try {
//       const response = await axios.post('http://localhost:3001/api/auth/verify', {
//         universityNumber,
//         token,
//       });

//       // ✅ Save JWT token
//       const accessToken = response.data.access_token;
//       localStorage.setItem('access_token', accessToken);

//       // ✅ Decode and store data from JWT
//       const decoded: DecodedToken = jwt_decode.default(accessToken);
//       localStorage.setItem('universityNumber', decoded.universityNumber);
//       localStorage.setItem('lecturerEmail', decoded.email);

//       // ✅ Preserve your existing storage logic
//       localStorage.setItem('lecturerId', response.data.lecturerId);
//       localStorage.setItem('lecturerVerified', 'true');

//       navigate('/lecturer');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Verification failed');

//       // Auto-hide error after 2 seconds
//       setTimeout(() => {
//         setError('');
//       }, 2000);
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto relative">
//       <h1 className="text-xl font-bold mb-4">Verify Login Token</h1>

//       <form onSubmit={handleVerify}>
//         <input
//           className="w-full border p-2 mb-4"
//           placeholder="University Number"
//           value={universityNumber}
//           onChange={(e) => setUniversityNumber(e.target.value)}
//         />
//         <input
//           className="w-full border p-2 mb-4"
//           placeholder="Enter token from email"
//           value={token}
//           onChange={(e) => setToken(e.target.value)}
//         />

//         <button
//           type="submit"
//           className="bg-green-600 text-white px-4 py-2"
//         >
//           Verify Token
//         </button>
//       </form>

//       {error && (
//         <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-50">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TokenVerificationPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BiSolidUserRectangle } from "react-icons/bi";
import { FaUser, FaKey } from "react-icons/fa";

interface DecodedToken {
  id: string;
  universityNumber: string;
  email: string;
  iat: number;
  exp: number;
}

const TokenVerificationPage = () => {
  const [universityNumber, setUniversityNumber] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedLecturerId = localStorage.getItem('lecturerId');
    console.log('Stored lecturerId on page load:', storedLecturerId);
    if (!storedLecturerId) {
      navigate('/login');
    }
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting verification with:', { universityNumber, token });

    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify', {
        universityNumber,
        token,
      });

      console.log('✅ Verification success:', response.data);

      const accessToken = response.data.access_token;
      localStorage.setItem('access_token', accessToken);

      const decoded: DecodedToken = jwtDecode(accessToken);
      console.log('🔓 Decoded token:', decoded);

      localStorage.setItem('universityNumber', decoded.universityNumber);
      localStorage.setItem('lecturerEmail', decoded.email);
      localStorage.setItem('lecturerId', response.data.lecturerId);
      localStorage.setItem('lecturerVerified', 'true');

      navigate('/lecturer');
    } catch (err: any) {
      console.error('❌ Verification failed:', err);
      if (err.response) {
        setError(err.response.data.message || 'Verification failed');
      } else {
        setError('Network or server error');
      }

      setTimeout(() => setError(''), 3000);
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
              placeholder="University Number"
              value={universityNumber}
              onChange={(e) => setUniversityNumber(e.target.value.trim())}
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
            className="w-full h-[45px] bg-[#106053] text-white border-none outline-none cursor-pointer text-[16px] font-bold hover:bg-[#0b3f37]"
          >
            Verify Token
          </button>

          {error && (
            <p className="text-red-600 font-bold mt-2 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default TokenVerificationPage;
