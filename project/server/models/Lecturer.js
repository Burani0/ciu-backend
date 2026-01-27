// import mongoose from 'mongoose';

// const lecturerSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, unique: true },
//   universityNumber: { type: String, unique: true },
//   password: String,
//   assignedCourses: [{ type: String }],
//   profileImageSrc: { type: String, default: '' },

//   // ✅ single-session fields
//   activeSessionHash: { type: String, default: null },
//   activeSessionExpiresAt: { type: Date, default: null },
// });

// export default mongoose.model('Lecturer', lecturerSchema);


import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  universityNumber: { type: String, unique: true },
  password: String,
  assignedCourses: [{ type: String }],
  profileImageSrc: { type: String, default: '' },

  // ✅ single-session fields
  activeSessionHash: { type: String, default: null },
  activeSessionExpiresAt: { type: Date, default: null },
});

export default mongoose.model('Lecturer', lecturerSchema);