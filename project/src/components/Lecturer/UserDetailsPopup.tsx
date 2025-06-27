// UserDetailsPopup.tsx
import { useState, useEffect, useRef } from 'react';
import { Settings, LogOut, X } from "lucide-react";
import axios from 'axios';

type UserData = {
  profileImageSrc: string;
  name: string;
  email: string;
  universityNumber: string;
};

type Props = {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export default function UserDetailsPopup({ userData, setUserData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLoggedInUserData = async () => {
    try {
      const id = localStorage.getItem('lecturerId');
      if (!id) {
        setError('User not authenticated');
        return;
      }
  
      const res = await axios.get(`https://ciu-backend.onrender.com/api/admin/lecturers/${id}`);
      const { firstName, lastName, email, universityNumber, profileImage } = res.data;
  
      setUserData({
        profileImageSrc: profileImage || '/avatar2.jpg',
        name: `${firstName} ${lastName}`,
        email,
        universityNumber,
      });
    } catch (err) {
      console.error("Failed to load user:", err);
      setError("Failed to load user data.");
    } finally {
      setIsLoading(false); // ✅ done loading
    }
  };
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    fetchLoggedInUserData(); // ✅ fetch once on load
  
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  return (
    <div className="relative" ref={popupRef}>
      <button
        onClick={togglePopup}
        className="bg-none border-none cursor-pointer w-12 h-12 p-0 overflow-hidden rounded-full"
        aria-label="User profile"
      >

          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
          ) : (
            <img
              src={userData?.profileImageSrc || "/avatar2.jpg"}
              alt="User profile"
              className="w-full h-full object-cover rounded-full"
            />
          )}

      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-[250px] bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] mt-2">
          <button
            className="absolute top-2 right-2 bg-transparent border-none cursor-pointer p-1 rounded hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
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
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h2 className="text-lg font-semibold mb-1">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <p className="text-sm text-gray-500">{userData.universityNumber}</p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fileInput = e.currentTarget.elements.namedItem('profileImage') as HTMLInputElement;
                  const file = fileInput?.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('profileImage', file);

                  try {

                    setIsUploading(true);
                    const lecturerId = localStorage.getItem('lecturerId');
                    const res = await axios.post(
                      `http://localhost:3001/api/lecturer/uploads/upload-profile-image/${lecturerId}`,
                      formData
                    );
                    const imageUrl = res.data.imageUrl || res.data.path;
                    setUserData((prev) => prev ? { ...prev, profileImageSrc: imageUrl } : null);
                  } catch (err) {
                    console.error("Upload failed:", err);
                  }finally {
                    setIsUploading(false); // End spinner
                  }
                }}
                className="border-t border-gray-200 p-4 flex flex-col items-center"
              >
                <label className="flex items-center cursor-pointer mb-2">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Upload Profile Image</span>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    className="hidden"
                  />
                </label>

                    <button
                    type="submit"
                    className="w-full bg-[#0F533D] text-white py-1 px-2 rounded text-sm hover:bg-[#0D4735] transition flex justify-center items-center gap-2"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      'Upload'
                    )}
                  </button>

                <button
                  type="button"
                  className="flex items-center w-full px-2 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 transition mt-2"
                  onClick={async () => {
                    try {
                      const lecturerId = localStorage.getItem('lecturerId');
                      if (!lecturerId) return;

                      // Send a request to clear profile image
                      await axios.put(`http://localhost:3001/api/lecturer/uploads/remove-profile-image/${lecturerId}`);

                      // Reset frontend to default image
                      setUserData((prev) =>
                        prev ? { ...prev, profileImageSrc: '/avatar2.jpg' } : null
                      );
                    } catch (err) {
                      console.error('Failed to remove profile image:', err);
                    }
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Use Default Image
                </button>

              </form>

              <button
                className="flex items-center w-full px-2 py-2 text-sm text-red-600 rounded hover:bg-red-50 transition"
                onClick={() => console.log("Logout clicked")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500 p-6">Loading user data...</div>
          )}
        </div>
      )}
    </div>
  );
}
