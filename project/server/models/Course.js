import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  faculty: { type: String, required: true },
  program: { type: String, required: true },
  courseTitle: { type: String, required: true },
  courseCode: { type: String, required: true},
});
export default mongoose.model('Course', courseSchema);
