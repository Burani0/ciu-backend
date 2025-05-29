import React, { useState } from 'react';
import axios from 'axios';

const CreateCoursePage = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/admin/create-course', { courseTitle, courseCode });
      alert('Course created');
      setCourseTitle('');
      setCourseCode('');
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create Course</h1>
      <input
        className="w-full border p-2 mb-4"
        placeholder="Course Title"
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2" onClick={handleSubmit}>
        Create Course
      </button>
    </div>
  );
};

export default CreateCoursePage;