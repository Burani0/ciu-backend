import { useState, useEffect, useRef } from 'react';
import { Settings, LogOut, X } from "lucide-react";
import axios from 'axios';

type UserData = {
  profileImageSrc: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  id: string;
};

type Props = {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export default function AdminDetailsPopup({ userData, setUserData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

const fetchAdminData = async () => {
  setIsLoading(true);
  try {
    const adminId = localStorage.getItem('adminId');
    const token = localStorage.getItem('token');
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    if (!adminId || !token) {
      setError('User is not authenticated.');
      setIsLoading(false);
      return;
    }

    const response = await axios.get(`${BASE_URL}/api/admin/admin/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { first_name, last_name, username, email, _id, profileImageSrc } = response.data;

    setUserData({
      profileImageSrc: profileImageSrc || '/avatar2.jpg',
      first_name,
      last_name,
      username,
      email,
      id: _id,
    });

    setError(null);
  } catch (err) {
    console.error('Failed to fetch admin data:', err);
    setError('Failed to load user data.');
  } finally {
    setIsLoading(false);
  }
};

const togglePopup = () => {
  if (!isOpen) {
    fetchAdminData();
  }
  setIsOpen(!isOpen);
};


  useEffect(() => {
    fetchAdminData();

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
            src={userData?.profileImageSrc || '/avatar2.jpg'}
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
                <h2 className="text-lg font-semibold mb-1">
                  {userData.first_name} {userData.last_name}
                </h2>
                <p className="text-sm text-gray-500">Username: {userData.username}</p>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fileInput = e.currentTarget.elements.namedItem('profileImage') as HTMLInputElement;
                  const file = fileInput?.files?.[0];
                  if (!file || !userData) return;

                  const formData = new FormData();
                  formData.append('profileImage', file);

                  try {
                    setIsUploading(true);
                    const token = localStorage.getItem('token');
                    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

                    const response = await axios.post(
                      `${BASE_URL}/api/admin/uploads/upload-profile-image/${userData.id}`,
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'multipart/form-data',
                        },
                      }
                    );

                    const imageUrl = response.data.imageUrl;
                    setUserData({ ...userData, profileImageSrc: imageUrl });
                  } catch (error) {
                    console.error('Upload failed:', error);
                  } finally {
                    setIsUploading(false);
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
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
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
                      if (!userData) return;

                      await axios.put(
                        `http://localhost:3001/api/admin/uploads/remove-profile-image/${userData.id}`
                      );

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
                onClick={() => console.log('Logout clicked')}
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
