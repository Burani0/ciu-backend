import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Lecturer {
  _id: string;
  name: string;
  email: string;
  universityNumber: string;
  courses?: string[];
  // Add other fields as needed
}

const LecturerProfilePage = () => {
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLecturer = async () => {
      const lecturerId = localStorage.getItem('lecturerId');
      const token = localStorage.getItem('token'); // if you're storing JWT token

      if (!lecturerId) {
        setError('Lecturer not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://ciu-backend.onrender.com/api/lecturer/profile/${lecturerId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Optional, if route is protected
          },
        });

        setLecturer(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch lecturer');
      } finally {
        setLoading(false);
      }
    };

    fetchLecturer();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-xl mx-auto bg-[#E6F1EB] rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lecturer Profile</h2>
      <p><strong>Name:</strong> {lecturer?.name}</p>
      <p><strong>Email:</strong> {lecturer?.email}</p>
      <p><strong>University Number:</strong> {lecturer?.universityNumber}</p>
      {lecturer?.courses?.length && (
        <div className="mt-2">
          <strong>Courses:</strong>
          <ul className="list-disc ml-6">
            {lecturer.courses.map((course, idx) => (
              <li key={idx}>{course}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LecturerProfilePage;
