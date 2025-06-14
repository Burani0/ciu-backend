// models/LecturerLoginLog.js
import mongoose from 'mongoose';

const LecturerLoginLogSchema = new mongoose.Schema({
  universityNumber: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
});

export default mongoose.model('LecturerLoginLog', LecturerLoginLogSchema);
