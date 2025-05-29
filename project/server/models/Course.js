import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseCode: { type: String, required: true},
});
export default mongoose.model('Course', courseSchema);
