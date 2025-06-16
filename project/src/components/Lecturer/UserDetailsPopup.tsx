// import { useState, useEffect, useRef, ReactNode } from 'react';
// import { Settings, LogOut, X } from "lucide-react";
// import axios from 'axios';

// type UserDetailsPopupProps = {
//   children: ReactNode;
// };

// type UserData = {
//   profileImageSrc: string;
//   name: string;
//   role: string;
//   id: string;
// };

// const fetchLoggedInUserData = async (
//   setUserData: (data: UserData | null) => void,
//   setError: (error: string | null) => void
// ) => {
//   try {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     if (!token || !user?.id) {
//       setError('User is not authenticated.');
//       return;
//     }

//     const { id } = user;
//     const response = await axios.get(`http://localhost:3001/lecturerReg/profile/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const { first_name, last_name, role, profileImageSrc } = response.data;
//     setUserData({
//       profileImageSrc: profileImageSrc || "/IMG_9472.jpg",
//       name: `${first_name} ${last_name}`,
//       role,
//       id,
//     });
//     setError(null);
//   } catch (err) {
//     console.error('Failed to fetch user data:', err);
//     setError('Failed to load user data.');
//   }
// };

// export default function UserDetailsPopup({ children }: UserDetailsPopupProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const popupRef = useRef<HTMLDivElement>(null);

//   const togglePopup = () => {
//     if (!isOpen) {
//       fetchLoggedInUserData(setUserData, setError);
//     }
//     setIsOpen(!isOpen);
//   };

//   const closePopup = () => setIsOpen(false);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
//         closePopup();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={popupRef}>
//       <div onClick={togglePopup}>
//         {children}
//       </div>
//       {isOpen && (
//         <div className="absolute top-full right-0 w-[250px] bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] mt-2">
//           <button
//             className="absolute top-2 right-2 bg-transparent border-none cursor-pointer p-1 rounded hover:bg-gray-100"
//             onClick={closePopup}
//             aria-label="Close popup"
//           >
//             <X className="w-4 h-4 text-gray-500" />
//           </button>
//           {error ? (
//             <div className="text-center text-red-600 p-6">{error}</div>
//           ) : userData ? (
//             <>
//               <div className="flex flex-col items-center p-4">
//                 <img
//                   src={userData.profileImageSrc}
//                   alt="User profile"
//                   className="w-24 h-24 rounded-lg object-cover mb-4"
//                 />
//                 <h2 className="text-lg font-semibold mb-1">{userData.name}</h2>
//                 <p className="text-sm text-gray-500">{userData.role}</p>
//                 <p className="text-sm text-gray-500">{userData.id}</p>
//               </div>
//               <div className="border-t border-gray-200 p-4">
//                 <button
//                   className="flex items-center w-full px-2 py-2 text-sm rounded hover:bg-gray-100 transition"
//                   onClick={() => console.log("Manage Account clicked")}
//                 >
//                   <Settings className="w-4 h-4 mr-2" />
//                   Manage Account
//                 </button>
//                 <button
//                   className="flex items-center w-full px-2 py-2 text-sm text-red-600 rounded hover:bg-red-50 transition"
//                   onClick={() => console.log("Logout clicked")}
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="text-center text-red-600 p-6">Failed to load user data</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect, useRef, ReactNode } from 'react';
import { Settings, LogOut, X } from "lucide-react";
import axios from 'axios';

type UserDetailsPopupProps = {
  children: ReactNode;
};

type UserData = {
  profileImageSrc: string;
  name: string;
  email: string;
  universityNumber: string;
};

const fetchLoggedInUserData = async (
  setUserData: (data: UserData | null) => void,
  setError: (error: string | null) => void
) => {
  try {
    const id = localStorage.getItem('lecturerId');
    if (!id) {
      setError('User is not authenticated.');
      return;
    }

    const response = await axios.get(`https://ciu-backend.onrender.com/api/admin/lecturers/${id}`);
    const { firstName, lastName, email, universityNumber } = response.data;

    setUserData({
      profileImageSrc: "/IMG_9472.jpg", // Use default image or update later
      name: `${firstName} ${lastName}`,
      email,
      universityNumber,
    });
    setError(null);
  } catch (err) {
    console.error('Failed to fetch user data:', err);
    setError('Failed to load user data.');
  }
};

export default function UserDetailsPopup({ children }: UserDetailsPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    if (!isOpen) {
      fetchLoggedInUserData(setUserData, setError);
    }
    setIsOpen(!isOpen);
  };

  const closePopup = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popupRef}>
      <div onClick={togglePopup}>
        {children}
      </div>
      {isOpen && (
        <div className="absolute top-full right-0 w-[250px] bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] mt-2">
          <button
            className="absolute top-2 right-2 bg-transparent border-none cursor-pointer p-1 rounded hover:bg-gray-100"
            onClick={closePopup}
            aria-label="Close popup"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          {error ? (
            <div className="text-center text-red-600 p-6">{error}</div>
          ) : userData ? (
            <>
              <div className="flex flex-col items-center p-4">
                <img
                  src={userData.profileImageSrc}
                  alt="User profile"
                  className="w-24 h-24 rounded-lg object-cover mb-4"
                />
                <h2 className="text-lg font-semibold mb-1">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <p className="text-sm text-gray-500">{userData.universityNumber}</p>
              </div>
              <div className="border-t border-gray-200 p-4">
                <button
                  className="flex items-center w-full px-2 py-2 text-sm rounded hover:bg-gray-100 transition"
                  onClick={() => console.log("Manage Account clicked")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Account
                </button>
                <button
                  className="flex items-center w-full px-2 py-2 text-sm text-red-600 rounded hover:bg-red-50 transition"
                  onClick={() => console.log("Logout clicked")}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 p-6">Loading user data...</div>
          )}
        </div>
      )}
    </div>
  );
}
