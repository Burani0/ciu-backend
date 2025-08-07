import mongoose from 'mongoose';

const adminTokenSchema = new mongoose.Schema({
  adminId: mongoose.Schema.Types.ObjectId,
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 120 },
});

export default mongoose.model('AdminToken', adminTokenSchema);
