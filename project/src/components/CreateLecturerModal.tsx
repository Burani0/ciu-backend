// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import axios from 'axios';
// import Select from 'react-select';

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface CourseOption {
//   value: string;
//   label: string;
// }

// const CreateLecturerModal: React.FC<Props> = ({ onClose, onSuccess }) => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [universityNumber, setUniversityNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);
//   const [courses, setCourses] = useState<CourseOption[]>([]);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axios.get('https://ciu-backend.onrender.com/api/admin/courses');
//         const formatted = res.data.map((course: any) => ({
//           label: course.courseTitle,
//           value: course._id,
//         }));
//         setCourses(formatted);
//       } catch (err) {
//         console.error('Error fetching courses', err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setErrorMsg('');
//     setSuccessMsg('');
//     setIsSubmitting(true);

//     try {
//       await axios.post('http://localhost:3001/api/admin/register-lecturer', {
//         firstName,
//         lastName,
//         email,
//         universityNumber,
//         password,
//         courseIds: selectedCourses.map((course) => course.value),
//       });
//       setSuccessMsg('Lecturer registered successfully!');
//       setFirstName('');
//       setLastName('');
//       setEmail('');
//       setUniversityNumber('');
//       setPassword('');
//       setSelectedCourses([]);
//       onSuccess();
//     } catch (error: any) {
//       setErrorMsg(error.response?.data?.message || 'Registration failed.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//      <div className="bg-white rounded-xl shadow-lg  w-full max-w-md max-h-[90vh]  relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-teal-700 hover:text-red-500 text-xl"
//           aria-label="Close modal"
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-bold text-teal-700 text-center mt-8 mb-2">
//           Register Lecturer
//         </h2>
//         <div className="overflow-y-auto max-h-[75vh] px-6 pb-4 rounded-b-xl">
//         <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">
//               First Name
//             </label>
//            <input
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//             placeholder="First Name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//           />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">
//               Last Name
//             </label>
//           <input
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//             placeholder="Last Name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//           />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">
//               Email
//             </label> 
//           <input
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//             </div>
//             <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">
//               University Number
//             </label>
//           <input
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//             placeholder="University Number"
//             value={universityNumber}
//             onChange={(e) => setUniversityNumber(e.target.value)}
//           />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">
//               Password
//             </label>
//           <input
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">
//               Assign Courses
//             </label>
//             <Select
//               options={courses}
//               isMulti
//               value={selectedCourses}
//               onChange={(selected) => setSelectedCourses(selected || [])}
//               className="text-sm"
//               classNamePrefix="react-select"
//               placeholder="Search or select courses..."
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   borderColor: "rgb(20 184 166)",
//                   boxShadow: "none",
//                   "&:hover": { borderColor: "rgb(13 148 136)" },
//                 }),
//                 option: (base, state) => ({
//                   ...base,
//                   backgroundColor: state.isFocused ? "#E6F1EB" : "white",
//                   color: "black",
//                 }),
//                 multiValue: (base) => ({
//                   ...base,
//                   backgroundColor: "rgb(20 184 166)",
//                   color: "white",
//                 }),
//                 multiValueLabel: (base) => ({
//                   ...base,
//                   color: "white",
//                 }),
//                 multiValueRemove: (base) => ({
//                   ...base,
//                   color: "white",
//                   ":hover": {
//                     backgroundColor: "rgb(13 148 136)",
//                     color: "white",
//                   },
//                 }),
//               }}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
//           >
//             {isSubmitting ? 'Registering...' : 'Register Lecturer'}
//           </button>

//           {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
//           {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
//         </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateLecturerModal;


import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Select from 'react-select';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface CourseOption {
  value: string;
  label: string;
  code: string;
}

const CreateLecturerModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [universityNumber, setUniversityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('https://ciu-backend.onrender.com/api/admin/courses');
        const formatted = res.data.map((course: any) => ({
          label: course.courseTitle,
          value: course._id,
          code: course.courseCode,
        }));
        setCourses(formatted);
      } catch (err) {
        console.error('Error fetching courses', err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await axios.post('https://ciu-backend.onrender.com/api/admin/register-lecturer', {
        firstName,
        lastName,
        email,
        universityNumber,
        password,
        courseIds: selectedCourses.map((course) => course.value),
        courseCodes: selectedCourses.map((course) => course.code),
      });
      setSuccessMsg('Lecturer registered successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setUniversityNumber('');
      setPassword('');
      setSelectedCourses([]);
      onSuccess();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
     <div className="bg-white rounded-xl shadow-lg  w-full max-w-md max-h-[90vh]  relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-red-500 text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mt-8 mb-2">
          Register Lecturer
        </h2>
        <div className="overflow-y-auto max-h-[75vh] px-6 pb-4 rounded-b-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">
              First Name
            </label>
           <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">
              Last Name
            </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">
              Email
            </label> 
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
            </div>
            <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">
              University Number
            </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
            placeholder="University Number"
            value={universityNumber}
            onChange={(e) => setUniversityNumber(e.target.value)}
          />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">
              Password
            </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>

          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">
              Assign Courses
            </label>
            <Select
              options={courses}
              isMulti
              value={selectedCourses}
              onChange={(selected) => setSelectedCourses(selected || [])}
              className="text-sm"
              classNamePrefix="react-select"
              placeholder="Search or select courses..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "rgb(20 184 166)",
                  boxShadow: "none",
                  "&:hover": { borderColor: "rgb(13 148 136)" },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#E6F1EB" : "white",
                  color: "black",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "rgb(20 184 166)",
                  color: "white",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "white",
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "white",
                  ":hover": {
                    backgroundColor: "rgb(13 148 136)",
                    color: "white",
                  },
                }),
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
          >
            {isSubmitting ? 'Registering...' : 'Register Lecturer'}
          </button>

          {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
          {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
        </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLecturerModal;




