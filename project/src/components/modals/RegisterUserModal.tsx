// import React, { useState, ChangeEvent, FormEvent } from "react";

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const RegisterUserModal: React.FC<Props> = ({ onClose, onSuccess }) => {
//   const [selectedUser, setSelectedUser] = useState<"Lecturer" | "Administrator">("Lecturer");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     emailOrStudentNumber: "",
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrorMsg("");
//   };

//   const handleUserToggle = () => {
//     setSelectedUser((prev) => (prev === "Lecturer" ? "Administrator" : "Lecturer"));
//     setFormData({ firstName: "", lastName: "", emailOrStudentNumber: "" });
//     setErrors({});
//     setSuccessMessage("");
//   };

//   const validate = () => {
//     const errs: { [key: string]: string } = {};
//     if (!formData.firstName.trim()) errs.firstName = "First Name is required";
//     if (!formData.lastName.trim()) errs.lastName = "Last Name is required";

//     if (!formData.emailOrStudentNumber.trim()) {
//       errs.emailOrStudentNumber = "Email is required";
//     } else if (!/^[a-zA-Z]+@ciu\.ac\.ug$/.test(formData.emailOrStudentNumber)) {
//       errs.emailOrStudentNumber = "Email must be in the format: firstname@ciu.ac.ug";
//     }

//     return errs;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     setErrors({});
//     setErrorMsg("");

//     try {
//       const endpoint =
//         selectedUser === "Lecturer"
//           ? "http://localhost:3000/lecturerReg"
//           : "http://localhost:3000/adminReg";

//       const payload = {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.emailOrStudentNumber,
//         role: selectedUser.toLowerCase(),
//       };

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage(`${selectedUser} successfully registered!`);
//         setFormData({ firstName: "", lastName: "", emailOrStudentNumber: "" });
//         onSuccess();
//       } else {
//         setErrorMsg(data.message || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       setErrorMsg("An error occurred. Please try again later.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-bold text-teal-700 text-center mb-4">
//           Register {selectedUser}
//         </h2>

//         {/* Toggle */}
//         <div className="flex items-center justify-center mb-6">
//           <label className="relative inline-block w-14 h-8">
//             <input
//               type="checkbox"
//               className="sr-only peer"
//               checked={selectedUser === "Administrator"}
//               onChange={handleUserToggle}
//             />
//             <div className="w-14 h-8 bg-teal-600 peer-checked:bg-teal-800 rounded-full peer-focus:ring-4 ring-teal-300 transition-all"></div>
//             <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
//           </label>
//           <span className="ml-3 font-medium text-teal-700">
//             {selectedUser}
//           </span>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter First Name"
//             />
//             {errors.firstName && (
//               <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Last Name"
//             />
//             {errors.lastName && (
//               <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Email (@ciu.ac.ug)
//             </label>
//             <input
//               type="email"
//               name="emailOrStudentNumber"
//               value={formData.emailOrStudentNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Email"
//             />
//             {errors.emailOrStudentNumber && (
//               <p className="text-red-600 text-sm mt-1">{errors.emailOrStudentNumber}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Registering..." : `Register as ${selectedUser}`}
//           </button>

//           {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
//           {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterUserModal;

// import React, { useState, ChangeEvent, FormEvent } from "react";

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const RegisterUserModal: React.FC<Props> = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     emailOrStudentNumber: "",
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrorMsg("");
//   };

//   const validate = () => {
//     const errs: { [key: string]: string } = {};
//     if (!formData.firstName.trim()) errs.firstName = "First Name is required";
//     if (!formData.lastName.trim()) errs.lastName = "Last Name is required";

//     if (!formData.emailOrStudentNumber.trim()) {
//       errs.emailOrStudentNumber = "Email is required";
//     } else if (!/^[a-zA-Z]+@ciu\.ac\.ug$/.test(formData.emailOrStudentNumber)) {
//       errs.emailOrStudentNumber = "Email must be in the format: firstname@ciu.ac.ug";
//     }

//     return errs;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     setErrors({});
//     setErrorMsg("");

//     try {
//       const endpoint = "http://localhost:3000/lecturerReg";

//       const payload = {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.emailOrStudentNumber,
//         role: "lecturer",
//       };

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage("Lecturer successfully registered!");
//         setFormData({ firstName: "", lastName: "", emailOrStudentNumber: "" });
//         onSuccess();
//       } else {
//         setErrorMsg(data.message || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       setErrorMsg("An error occurred. Please try again later.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-bold text-teal-700 text-center mb-4">
//           Register Lecturer
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter First Name"
//             />
//             {errors.firstName && (
//               <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Last Name"
//             />
//             {errors.lastName && (
//               <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Email (@ciu.ac.ug)
//             </label>
//             <input
//               type="email"
//               name="emailOrStudentNumber"
//               value={formData.emailOrStudentNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Email"
//             />
//             {errors.emailOrStudentNumber && (
//               <p className="text-red-600 text-sm mt-1">{errors.emailOrStudentNumber}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Registering..." : "Register as Lecturer"}
//           </button>

//           {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
//           {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterUserModal;
// import React, { useState, ChangeEvent, FormEvent } from "react";
// import CourseSelect from "./CourseSelect.tsx";

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const RegisterUserModal: React.FC<Props> = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     emailOrStudentNumber: "",
//     course: "",
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrorMsg("");
//   };

//   const validate = () => {
//     const errs: { [key: string]: string } = {};
//     if (!formData.firstName.trim()) errs.firstName = "First Name is required";
//     if (!formData.lastName.trim()) errs.lastName = "Last Name is required";

//     if (!formData.emailOrStudentNumber.trim()) {
//       errs.emailOrStudentNumber = "Email is required";
//     } else if (!/^[a-zA-Z]+@ciu\.ac\.ug$/.test(formData.emailOrStudentNumber)) {
//       errs.emailOrStudentNumber = "Email must be in the format: firstname@ciu.ac.ug";
//     }

//     if (!formData.course.trim()) {
//       errs.course = "Course selection is required";
//     }

//     return errs;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     setErrors({});
//     setErrorMsg("");

//     try {
//       const endpoint = "http://localhost:3000/lecturerReg";

//       const payload = {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.emailOrStudentNumber,
//         course: formData.course,
//         role: "lecturer",
//       };

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage("Lecturer successfully registered!");
//         setFormData({
//           firstName: "",
//           lastName: "",
//           emailOrStudentNumber: "",
//           course: "",
//         });
//         onSuccess();
//       } else {
//         setErrorMsg(data.message || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       setErrorMsg("An error occurred. Please try again later.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const availableCourses = ["Web Development", "Data Science", "Cyber Security"];

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-bold text-teal-700 text-center mb-4">
//           Register Lecturer
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter First Name"
//             />
//             {errors.firstName && (
//               <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Last Name"
//             />
//             {errors.lastName && (
//               <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Email (@ciu.ac.ug)
//             </label>
//             <input
//               type="email"
//               name="emailOrStudentNumber"
//               value={formData.emailOrStudentNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Email"
//             />
//             {errors.emailOrStudentNumber && (
//               <p className="text-red-600 text-sm mt-1">{errors.emailOrStudentNumber}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Select Course
//             </label>
//             <CourseSelect
//               courses={availableCourses}
//               selectedCourse={formData.course}
//               onSelect={(course) =>
//                 setFormData((prev) => ({ ...prev, course }))
//               }
//               error={errors.course}
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Registering..." : "Register as Lecturer"}
//           </button>

//           {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
//           {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterUserModal;

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import CourseSelect from "./CourseSelect.tsx";

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const RegisterUserModal: React.FC<Props> = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     emailOrStudentNumber: "",
//     course: "",
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrorMsg("");
//   };

//   const validate = () => {
//     const errs: { [key: string]: string } = {};
//     if (!formData.firstName.trim()) errs.firstName = "First Name is required";
//     if (!formData.lastName.trim()) errs.lastName = "Last Name is required";

//     if (!formData.emailOrStudentNumber.trim()) {
//       errs.emailOrStudentNumber = "Email is required";
//     } else if (!/^[a-zA-Z]+@ciu\.ac\.ug$/.test(formData.emailOrStudentNumber)) {
//       errs.emailOrStudentNumber = "Email must be in the format: firstname@ciu.ac.ug";
//     }

//     if (!formData.course.trim()) {
//       errs.course = "Course selection is required";
//     }

//     return errs;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     setErrors({});
//     setErrorMsg("");

//     try {
//       const endpoint = "http://localhost:3000/lecturerReg";

//       const payload = {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.emailOrStudentNumber,
//         course: formData.course,
//         role: "lecturer",
//       };

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage("Lecturer successfully registered!");
//         setFormData({
//           firstName: "",
//           lastName: "",
//           emailOrStudentNumber: "",
//           course: "",
//         });
//         onSuccess();
//       } else {
//         setErrorMsg(data.message || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       setErrorMsg("An error occurred. Please try again later.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const availableCourses = ["Web Development", "Data Science", "Cyber Security"];

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={() => {
//             console.log("Closing modal...");
//             onClose();
//           }}
//           className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-bold text-teal-700 text-center mb-4">
//           Register Lecturer
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter First Name"
//             />
//             {errors.firstName && (
//               <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Last Name"
//             />
//             {errors.lastName && (
//               <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Email (@ciu.ac.ug)
//             </label>
//             <input
//               type="email"
//               name="emailOrStudentNumber"
//               value={formData.emailOrStudentNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Enter Email"
//             />
//             {errors.emailOrStudentNumber && (
//               <p className="text-red-600 text-sm mt-1">{errors.emailOrStudentNumber}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-teal-700">
//               Select Course
//             </label>
//             <CourseSelect
//               courses={availableCourses}
//               selectedCourse={formData.course}
//               onSelect={(course) =>
//                 setFormData((prev) => ({ ...prev, course }))
//               }
//               error={errors.course}
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Registering..." : "Register as Lecturer"}
//           </button>

//           {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
//           {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterUserModal;

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Select from "react-select";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface CourseOption {
  label: string;
  value: string;
}

const RegisterUserModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailOrStudentNumber: "",
  });

  const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch courses dynamically from backend
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:3000/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        const formattedCourses = data.map((course: any) => ({
          label: course.name,
          value: course.id,
        }));
        setCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleCourseChange = (selected: CourseOption[] | null) => {
    setSelectedCourses(selected || []);
    setErrorMsg("");
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.firstName.trim()) errs.firstName = "First Name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last Name is required";

    if (!formData.emailOrStudentNumber.trim()) {
      errs.emailOrStudentNumber = "Email is required";
    } else if (!/^[a-zA-Z]+@ciu\.ac\.ug$/.test(formData.emailOrStudentNumber)) {
      errs.emailOrStudentNumber = "Email must be in the format: firstname@ciu.ac.ug";
    }

    if (selectedCourses.length === 0) {
      errs.course = "Please select at least one course";
    }

    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setErrorMsg("");
    setSuccessMessage("");

    try {
      const endpoint = "http://localhost:3000/lecturerReg";

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.emailOrStudentNumber,
        role: "lecturer",
        courses: selectedCourses.map((course) => course.value),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Lecturer successfully registered!");
        setFormData({ firstName: "", lastName: "", emailOrStudentNumber: "" });
        setSelectedCourses([]);
        onSuccess();
      } else {
        setErrorMsg(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMsg("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-red-500 text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mb-4">
          Register Lecturer
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-teal-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Enter First Name"
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-teal-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Enter Last Name"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-teal-700">
              Email (@ciu.ac.ug)
            </label>
            <input
              type="email"
              name="emailOrStudentNumber"
              value={formData.emailOrStudentNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Enter Email"
            />
            {errors.emailOrStudentNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.emailOrStudentNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">
              Assign Courses
            </label>
            <Select
              options={courses}
              isMulti
              value={selectedCourses}
              onChange={handleCourseChange}
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
            {errors.course && (
              <p className="text-red-600 text-sm mt-1">{errors.course}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register as Lecturer"}
          </button>

          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
          {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;
