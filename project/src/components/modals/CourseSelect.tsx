
import React, { useState } from "react";

interface CourseSelectProps {
  courses: string[];
  selectedCourse: string;
  onSelect: (course: string) => void;
  error?: string;
}

const CourseSelect: React.FC<CourseSelectProps> = ({
  courses,
  selectedCourse,
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`border rounded px-4 py-2 cursor-pointer bg-white ${
          selectedCourse ? "text-black" : "text-gray-400"
        }`}
      >
        {selectedCourse || "-- Select a Course --"}
      </div>

      {isOpen && (
        <ul className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-y-auto rounded shadow-md">
          {courses.map((course) => (
            <li
              key={course}
              onClick={() => {
                onSelect(course);
                setIsOpen(false);
              }}
              className={`px-4 py-2 hover:bg-[#E6F1EB] cursor-pointer ${
                course === selectedCourse ? "bg-[#E6F1EB]" : ""
              }`}
            >
              {course}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CourseSelect;
