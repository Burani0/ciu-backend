import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  first_name: { type: String, unique: true, required: true },
  last_name: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profileImageSrc: { type: String, default: '' },

  // ✅ single-session fields
  activeSessionHash: { type: String, default: null },
  activeSessionExpiresAt: { type: Date, default: null },
});

export default mongoose.model('Admin', adminSchema);
