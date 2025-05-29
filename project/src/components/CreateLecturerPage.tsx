import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateLecturerPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [universityNumber, setUniversityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [courses, setCourses] = useState<{ _id: string; courseTitle: string }[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/courses').then((res) => {
      setCourses(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/register-lecturer', {
        firstName,
        lastName,
        email,
        universityNumber,
        password,
        courseIds,
      });
      alert('Lecturer registered');
      setFirstName('');
      setLastName('');
      setEmail('');
      setUniversityNumber('');
      setPassword('');
      setCourseIds([]);
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };

  const toggleCourse = (id: string) => {
    setCourseIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Register Lecturer</h1>
      <input
        className="w-full border p-2 mb-4"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="University Number"
        value={universityNumber}
        onChange={(e) => setUniversityNumber(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="mb-4">
        <p className="font-medium mb-2">Assign Courses:</p>
        {courses.map((course) => (
  <label key={course._id}>
    <input
      type="checkbox"
      checked={courseIds.includes(course._id)}
      onChange={() => toggleCourse(course._id)}
    /> {course.courseTitle}
  </label>
))}
      </div>

      <button className="bg-purple-600 text-white px-4 py-2" onClick={handleSubmit}>
        Register Lecturer
      </button>
    </div>
  );
};

export default CreateLecturerPage;
