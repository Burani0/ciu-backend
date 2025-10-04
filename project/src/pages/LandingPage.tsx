// import React from "react";
// import { Link } from "react-router-dom";

// const LandingPage: React.FC = () => {
//   return (
//     <div className="font-sans flex flex-col items-center min-h-screen bg-[#ebebeb] py-10 px-5">
//       {/* Header with School Logo */}
//       <header className="flex flex-col items-center mb-12">
//         <img
//           src="/public/school-logo.png" // Replace with your school logo path
//           alt="School Logo"
//           className="w-24 md:w-32 mb-4"
//         />
//         <h1 className="text-3xl md:text-4xl font-bold text-[#106053] text-center tracking-wide">
//           ONLINE EXAMINATION SYSTEM
//         </h1>
//       </header>

//       {/* Cards Container */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
//         {/* Admin / Lecturer Card */}
//         <div className="flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6">
//           <div className="flex justify-between items-center mb-4">
//             <p className="text-2xl md:text-3xl font-bold text-[#106053]">Admin / Lecturer</p>
//             <img src="/public/ciu-logo-2.png" alt="CIU Logo" className="w-14 md:w-16" />
//           </div>
//           <div className="flex justify-center mb-6">
//             <img
//               src="/public/Landing Page Admin Pic.png.jpeg"
//               alt="Admin Illustration"
//               className="w-4/5 md:w-3/4 rounded-2xl shadow-md"
//             />
//           </div>
//           <Link
//             to="/admin-login"
//             className="mt-auto py-3 px-6 bg-[#106053] hover:bg-[#0b3f37] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-center"
//           >
//             Get Started
//           </Link>
//         </div>

//         {/* Student Card */}
//         <div className="flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6">
//           <div className="flex justify-between items-center mb-4">
//             <p className="text-2xl md:text-3xl font-bold text-[#106053]">Student</p>
//             <img src="/public/ciu-logo-2.png" alt="CIU Logo" className="w-14 md:w-16" />
//           </div>
//           <div className="flex justify-center mb-6">
//             <img
//               src="/public/Landing Page Student Pic.png.jpeg"
//               alt="Student Illustration"
//               className="w-4/5 md:w-3/4 rounded-2xl shadow-md"
//             />
//           </div>
//           <Link
//             to="/spaceverification"
//             className="mt-auto py-3 px-6 bg-[#106053] hover:bg-[#0b3f37] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-center"
//           >
//             Get Started
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="font-sans min-h-screen bg-[#ebebeb] relative overflow-hidden flex flex-col items-center p-5">

      {/* Animated background blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-72 h-72 bg-gradient-to-tr from-[#106053] to-[#0b3f37] opacity-20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-150px] right-[-80px] w-96 h-96 bg-gradient-to-tr from-[#0b3f37] to-[#106053] opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-[20%] right-[-100px] w-64 h-64 bg-gradient-to-tr from-[#106053] to-[#0b3f37] opacity-10 rounded-full blur-2xl animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="flex flex-col items-center mt-12 mb-16 opacity-0 animate-fadeIn delay-100">
        <img
          src="\public\ciu-logo-2.png"
          alt="School Logo"
          className="w-28 md:w-36 mb-4 animate-bounce-slow"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#106053] text-center mb-2 tracking-wide">
          ONLINE <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0b3f37] to-[#106053]">EXAMINATION SYSTEM</span>
        </h1>
        <p className="text-gray-700 text-lg md:text-xl text-center max-w-2xl">
          Secure, fast, and user-friendly online exams for students and lecturers.
        </p>
      </header>

     {/* Cards */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full max-w-6xl mb-24">
  
  {/* Admin / Lecturer Card */}
  <div className="flex flex-col p-5 rounded-2xl bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all opacity-0 animate-fadeIn delay-200
                  max-w-md mx-auto">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-xl md:text-2xl font-bold text-[#106053]">Admin / Lecturer</h2>
    </div>
    <div className="flex justify-center mb-5">
      <img
        src="/public/Landing Page Admin Pic.png.jpeg"
        alt="Admin Illustration"
        className="w-2/3 md:w-3/5 rounded-lg shadow-md transition-transform transform hover:scale-105 animate-float"
      />
    </div>
    <Link
      to="/admin-login"
      className="mt-auto py-2.5 px-5 bg-[#106053] hover:bg-[#0b3f37] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-center"
    >
      Get Started
    </Link>
  </div>

  {/* Student Card */}
  <div className="flex flex-col p-5 rounded-2xl bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all opacity-0 animate-fadeIn delay-300
                  max-w-md mx-auto">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-xl md:text-2xl font-bold text-[#106053]">Student</h2>
    </div>
    <div className="flex justify-center mb-5">
      <img
        src="/public/Landing Page Student Pic.png.jpeg"
        alt="Student Illustration"
        className="w-2/3 md:w-3/5 rounded-lg shadow-md transition-transform transform hover:scale-105 animate-float"
      />
    </div>
    <Link
      to="/spaceverification"
      className="mt-auto py-2.5 px-5 bg-[#106053] hover:bg-[#0b3f37] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-center"
    >
      Get Started
    </Link>
  </div>

</section>



      {/* Floating Chartered Image - Bottom Left */}
      {/* <img
        src="/public/chartered.png"
        alt="Chartered"
        className="absolute bottom-4 left-4 w-40 md:w-56opacity-90 "
      /> */}

        <img
          src="/public/chartered.png"
          alt="Chartered"
          className="absolute bottom-0 left-0 w-36 md:w-52 lg:w-72 opacity-30 mix-blend-multiply pointer-events-none select-none"
        />







      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm md:text-base mb-6 opacity-0 animate-fadeIn delay-400">
        &copy; {new Date().getFullYear()} CIU Online Exam System. All rights reserved.
      </footer>

      {/* Tailwind Animations */}
      <style>
        {`
          /* Bounce & Float */
          .animate-bounce-slow {
            animation: bounce 2.5s infinite;
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          /* Fade In */
          .animate-fadeIn {
            animation: fadeIn 1s forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Blobs */
          .animate-blob {
            animation: blob 12s infinite;
          }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -20px) scale(1.05); }
            66% { transform: translate(-20px, 20px) scale(0.95); }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;

