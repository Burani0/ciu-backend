// // Header.tsx
// import React, { useEffect, useState } from 'react';
// import { Bell, Menu } from 'lucide-react';
// import UserDetailsPopup from './UserDetailsPopup';
// import { Link } from 'react-router-dom';

// interface HeaderProps {
//   toggleMobileMenu: () => void;
//   isMobile: boolean;
// }

// type UserData = {
//   profileImageSrc: string;
//   name: string;
//   email: string;
//   universityNumber: string;
// };

// const Header: React.FC<HeaderProps> = ({ toggleMobileMenu, isMobile }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [userData, setUserData] = useState<UserData | null>(null);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 h-20">
//       <div className="flex items-center">
//         {isMobile && (
//           <button
//             onClick={toggleMobileMenu}
//             aria-label="Toggle menu"
//             className="bg-none border-none cursor-pointer p-2 mr-2"
//           >
//             <Menu className="w-6 h-6 text-[#106053]" />
//           </button>
//         )}
//         <img
//           src="/CIU-exam-system-logo.png" // ✅ use public path correctly
//           alt="System Logo"
//           className="h-12 mr-2"
//         />
//       </div>

//       <div className="mr-0 ml-auto text-sm text-center whitespace-nowrap">
//         <a>{currentTime.toLocaleString('default', { month: 'long' })}</a>{' '}
//         <a>{currentTime.getDate()}</a>, <a>{currentTime.getFullYear()}</a>
//         <br />
//         <a>{((currentTime.getHours() % 12) || 12).toString().padStart(2, '0')}</a>:
//         <a>{currentTime.getMinutes().toString().padStart(2, '0')}</a>:
//         <a>{currentTime.getSeconds().toString().padStart(2, '0')}</a>{' '}
//         <a>{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</a>
//       </div>

//       <div className="flex items-center h-12 ml-2 gap-4">
//         <Link to="/admin/notifications">
//           <button
//             className="relative bg-none border-none cursor-pointer p-2 rounded hover:bg-gray-100"
//             aria-label="Notifications"
//           >
//             <Bell className="w-7 h-7 text-[#106053]" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
//           </button>
//         </Link>

//         {/* ✅ Show avatar image that opens the popup */}
//         <UserDetailsPopup userData={userData} setUserData={setUserData}>
//           <button
//             className="bg-none border-none cursor-pointer p-0 w-12 h-12 overflow-hidden rounded-full"
//             aria-label="User profile"
//           >
//             <img
//               src={userData?.profileImageSrc || "/avatar2.jpg"} // ✅ fallback to default
//               alt="User profile"
//               className="w-full h-full object-cover"
//             />
//           </button>
//         </UserDetailsPopup>
//       </div>
//     </header>
//   );
// };

// export default Header;

// // src/components/Header.tsx
// import React, { useEffect, useState } from 'react';
// import { Bell, Menu } from 'lucide-react';
// import UserDetailsPopup from './UserDetailsPopup';
// import { Link } from 'react-router-dom';
// import { LecturerProvider, useLecturer, UserData } from '../Lecturer/LecturerContext';

// interface HeaderProps {
//   toggleMobileMenu: () => void;
//   isMobile: boolean;
// }

// const HeaderContent: React.FC<HeaderProps> = ({ toggleMobileMenu, isMobile }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const { userData, setUserData } = useLecturer();

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 h-20">
//       <div className="flex items-center">
//         {isMobile && (
//           <button
//             onClick={toggleMobileMenu}
//             aria-label="Toggle menu"
//             className="bg-none border-none cursor-pointer p-2 mr-2"
//           >
//             <Menu className="w-6 h-6 text-[#106053]" />
//           </button>
//         )}
//         <img
//           src="/CIU-exam-system-logo.png"
//           alt="System Logo"
//           className="h-12 mr-2"
//         />
//       </div>

//       <div className="mr-0 ml-auto text-sm text-center whitespace-nowrap">
//         <a>{currentTime.toLocaleString('default', { month: 'long' })}</a>{' '}
//         <a>{currentTime.getDate()}</a>, <a>{currentTime.getFullYear()}</a>
//         <br />
//         <a>{((currentTime.getHours() % 12) || 12).toString().padStart(2, '0')}</a>:
//         <a>{currentTime.getMinutes().toString().padStart(2, '0')}</a>:
//         <a>{currentTime.getSeconds().toString().padStart(2, '0')}</a>{' '}
//         <a>{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</a>
//       </div>

//       <div className="flex items-center h-12 ml-2 gap-4">
//         <Link to="/admin/notifications">
//           <button
//             className="relative bg-none border-none cursor-pointer p-2 rounded hover:bg-gray-100"
//             aria-label="Notifications"
//           >
//             <Bell className="w-7 h-7 text-[#106053]" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
//           </button>
//         </Link>

//         <UserDetailsPopup userData={userData} setUserData={setUserData} />
//       </div>
//     </header>
//   );
// };

// const Header: React.FC<HeaderProps> = (props) => (
//   <LecturerProvider>
//     <HeaderContent {...props} />
//   </LecturerProvider>
// );

// export default HeaderContent;


import React, { useEffect, useState } from 'react';
import { Bell, Menu } from "lucide-react";
import UserDetailsPopup from './UserDetailsPopup';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleMobileMenu: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu, isMobile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // ADD userData state here
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 h-20">
      <div className="flex items-center">
        {isMobile && (
          <button
            className="bg-none border-none cursor-pointer p-2 mr-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-[#106053]" />
          </button>
        )}
        <img
          src="/CIU-exam-system-logo.png"
          alt="System Logo"
          className="h-12 mr-2"
        />
      </div>

      <div id="timedate" className="ml-auto mr-0">
        <a>{currentTime.toLocaleString('default', { month: 'long' })}</a>{' '}
        <a>{currentTime.getDate()}</a>, <a>{currentTime.getFullYear()}</a>
        <br />
        <a>{((currentTime.getHours() % 12) || 12).toString().padStart(2, '0')}</a> :
        <a>{currentTime.getMinutes().toString().padStart(2, '0')}</a> :
        <a>{currentTime.getSeconds().toString().padStart(2, '0')}</a>{' '}
        <a>{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</a>
      </div>

      <div className="flex items-center h-12 ml-2 gap-4">
        <Link to="/admin/notifications">
          <button
            className="relative bg-none border-none cursor-pointer p-2 rounded transition-colors hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="w-7 h-7 text-[#106053]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </Link>

        {/* UPDATED usage: pass userData and setUserData as props */}
        <UserDetailsPopup userData={userData} setUserData={setUserData} />
      </div>
    </header>
  );
};

export default Header;


// import React, { useEffect, useState } from 'react';
// import { Bell, Menu } from 'lucide-react';
// import UserDetailsPopup from './UserDetailsPopup'; // Or LecturerDetailsPopup
// import { Link } from 'react-router-dom';

// interface HeaderProps {
//   toggleMobileMenu: () => void;
//   isMobile: boolean;
// }

// type UserData = {
//   profileImageSrc: string;
//   name: string;
//   email: string;
//   universityNumber: string;
// };

// const Header: React.FC<HeaderProps> = ({ toggleMobileMenu, isMobile }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // ✅ Preserve userData logic exactly like admin version
//   const [userData, setUserData] = useState<UserData | null>(null);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 h-20">
//       <div className="flex items-center">
//         {isMobile && (
//           <button
//             onClick={toggleMobileMenu}
//             aria-label="Toggle menu"
//             className="bg-none border-none cursor-pointer p-2 mr-2"
//           >
//             <Menu className="w-6 h-6 text-[#106053]" />
//           </button>
//         )}
//         <img
//           src="/CIU-exam-system-logo.png"
//           alt="System Logo"
//           className="h-12 mr-2"
//         />
//       </div>

//       {/* ✅ Time + Date block exactly preserved */}
//       <div id="timedate" className="ml-auto mr-0">
//         <a>{currentTime.toLocaleString('default', { month: 'long' })}</a>{' '}
//         <a>{currentTime.getDate()}</a>, <a>{currentTime.getFullYear()}</a>
//         <br />
//         <a>{((currentTime.getHours() % 12) || 12).toString().padStart(2, '0')}</a> :
//         <a>{currentTime.getMinutes().toString().padStart(2, '0')}</a> :
//         <a>{currentTime.getSeconds().toString().padStart(2, '0')}</a>{' '}
//         <a>{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</a>
//       </div>

//       {/* ✅ Notification button + user popup */}
//       <div className="flex items-center h-12 ml-2 gap-4">
//         <Link to="/lecturer/notifications">
//           <button
//             className="relative bg-none border-none cursor-pointer p-2 rounded transition-colors hover:bg-gray-100"
//             aria-label="Notifications"
//           >
//             <Bell className="w-7 h-7 text-[#106053]" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
//           </button>
//         </Link>

//         {/* Use userData popup for lecturer */}
//         <UserDetailsPopup userData={userData} setUserData={setUserData} />
//       </div>
//     </header>
//   );
// };

// export default Header;

