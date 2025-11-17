// src/context/LecturerContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export type UserData = {
  profileImageSrc: string;
  name: string;
  email: string;
  universityNumber: string;
};

type LecturerContextType = {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

const LecturerContext = createContext<LecturerContextType>({
  userData: null,
  setUserData: () => {},
});

export const LecturerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchLecturer = async () => {
      const id = localStorage.getItem('lecturerId');
      if (!id) return;

      try {
        const res = await axios.get(`https://examiner.ciu.ac.ug/api/admin/lecturers/${id}`);
        const { firstName, lastName, email, universityNumber, profileImageSrc } = res.data;
        
        

        setUserData({
          profileImageSrc: profileImageSrc || '/avatar2.jpg',
          name: `${firstName} ${lastName}`,
          email,
          universityNumber,
        });
      } catch (error) {
        console.error('Failed to fetch lecturer data:', error);
      }
    };

    fetchLecturer();
  }, []);

  return (
    <LecturerContext.Provider value={{ userData, setUserData }}>
      {children}
    </LecturerContext.Provider>
  );
};

export const useLecturer = () => useContext(LecturerContext);
