import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  universityNumber: { type: String, unique: true },
  password: String,
  // assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  assignedCourses: [{ type: String }],

  profileImageSrc: { type: String, default: '' },


});

export default mongoose.model('Lecturer', lecturerSchema);
