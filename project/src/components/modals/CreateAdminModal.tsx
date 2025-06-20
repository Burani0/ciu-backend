// import React, { useState } from 'react';
// import axios from 'axios';

// const CreateAdminPage = () => {
//   const [first_name, setFirst_name] = useState('');
//   const [last_name, setLast_name] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleCreate = async () => {
//     try {
//       await axios.post('http://localhost:3001/api/admin/create-admin', {
//         first_name,
//         last_name,
//         username,
//         email,
//         password,
//       });
//       alert('Admin created');
//       setFirst_name('');
//       setLast_name('');
//       setUsername('');
//       setEmail('');
//       setPassword('');

//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Error creating admin');
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">Create Admin</h1>
//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="First name"
//         value={first_name }
//         onChange={(e) => setFirst_name(e.target.value)}
//       />
//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="Lastname"
//         value={last_name}
//         onChange={(e) => setLast_name(e.target.value)}
//       />

//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="Email"
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="w-full border p-2 mb-4"
//         placeholder="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button className="bg-green-600 text-white px-4 py-2" onClick={handleCreate}>
//         Create Admin
//       </button>
//     </div>
//   );
// };

// export default CreateAdminPage;


// import React, { useState } from 'react';
// import axios from 'axios';

// const CreateAdminPage = () => {
//   const [first_name, setFirst_name] = useState('');
//   const [last_name, setLast_name] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleCreate = async () => {
//     setErrorMsg('');
//     setSuccessMsg('');
//     setIsSubmitting(true);

//     try {
//       await axios.post('http://localhost:3001/api/admin/create-admin', {
//         first_name,
//         last_name,
//         username,
//         email,
//         password,
//       });
//       setSuccessMsg('Admin created successfully!');
//       setFirst_name('');
//       setLast_name('');
//       setUsername('');
//       setEmail('');
//       setPassword('');
//     } catch (err: any) {
//       setErrorMsg(err.response?.data?.message || 'Error creating admin');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
//         <h2 className="text-xl font-bold text-teal-700 text-center mb-4">Create Admin</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">First Name</label>
//             <input
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="First name"
//               value={first_name}
//               onChange={(e) => setFirst_name(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">Last Name</label>
//             <input
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Last name"
//               value={last_name}
//               onChange={(e) => setLast_name(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">Username</label>
//             <input
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">Email</label>
//             <input
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-teal-700 mb-1">Password</label>
//             <input
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
//               placeholder="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={handleCreate}
//             disabled={isSubmitting}
//             className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
//           >
//             {isSubmitting ? 'Creating...' : 'Create Admin'}
//           </button>
//           {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
//           {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAdminPage;

import React, { useState } from 'react';
import axios from 'axios';

interface CreateAdminModalProps {
  onClose: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onClose }) => {
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:3001/api/admin/create-admin', {
        first_name,
        last_name,
        username,
        email,
        password,
      });
      setSuccessMsg('Admin created successfully!');
      setFirst_name('');
      setLast_name('');
      setUsername('');
      setEmail('');
      setPassword('');
      onClose(); // This will close the modal
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error creating admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-teal-700 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-teal-700 text-center mb-4">Create Admin</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">First Name</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="First name"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Last Name</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Last name"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Username</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Email</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Password</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ring-teal-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition"
          >
            {isSubmitting ? 'Creating...' : 'Create Admin'}
          </button>
          {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
          {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreateAdminModal;
