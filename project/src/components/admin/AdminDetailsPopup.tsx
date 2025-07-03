// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Settings, LogOut, X } from 'lucide-react';

// interface UserDetailsPopupProps {
//   children: React.ReactNode;
// }

// interface UserData {
//   name: string;
//   role: string;
//   profileImageSrc: string;
//   id: string;
// }

// export default function UserDetailsPopup({ children }: UserDetailsPopupProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [error, setError] = useState('');
//   const popupRef = useRef<HTMLDivElement>(null);

//   const togglePopup = () => {
//     if (!isOpen) {
//       fetchUserProfile();
//     }
//     setIsOpen(!isOpen);
//   };

//   const closePopup = () => setIsOpen(false);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user') || '{}');

//       if (!token || !user) {
//         setError('Please log in.');
//         return;
//       }

//       const { id } = user;
//       const response = await axios.get(`http://localhost:3000/adminReg/profile/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const { first_name, last_name, role } = response.data;
//       setUserData({
//         name: `${first_name} ${last_name}`,
//         role,
//         profileImageSrc: 'IMG_9472.jpg', // Replace with actual URL if needed
//         id,
//       });
//     } catch (error) {
//       setError('Failed to fetch user profile.');
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
//         closePopup();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="relative" ref={popupRef}>
//       <div onClick={togglePopup}>
//         {children}
//       </div>
//       {isOpen && (
//         <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000]">
//           <button
//             onClick={closePopup}
//             className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
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
//                   onClick={() => console.log('Manage Account clicked')}
//                   className="flex items-center w-full p-2 rounded hover:bg-gray-100 text-sm"
//                 >
//                   <Settings className="w-4 h-4 mr-2" />
//                   Manage Account
//                 </button>
//                 <button
//                   onClick={() => console.log('Logout clicked')}
//                   className="flex items-center w-full p-2 rounded hover:bg-red-50 text-sm text-red-600 mt-2"
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
import { Settings, LogOut, X } from 'lucide-react';
import axios from 'axios';

type AdminDetailsPopupProps = {
  children: ReactNode;
};

type UserData = {
  profileImageSrc: string;
  name: string;
  username:string;
  email: string;
 
};

const fetchAdminData = async (
  setUserData: (data: UserData | null) => void,
  setError: (error: string | null) => void
) => {
  try {
    const id = localStorage.getItem('adminId');
    if (!id) {
      setError('User is not authenticated.');
      return;
    }

    const response = await axios.get(`https://ciu-backend.onrender.com/api/admin/admins/${id}`);

    const { first_name, last_name, username, email, } = response.data;

    setUserData({
      profileImageSrc: "/IMG_9472.jpg",// Update this to dynamic image path if needed
      name: `${first_name} ${last_name}`,
      username: username,
      email,
    
    });
    setError(null);
  } catch (err) {
    console.error('Failed to fetch admin data:', err);
    setError('Failed to load user data.');
  }
};

export default function UserDetailsPopup({ children }: AdminDetailsPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    if (!isOpen) {
      fetchAdminData(setUserData, setError);
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
                <p className="text-sm text-gray-500">{userData.username}</p>
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

