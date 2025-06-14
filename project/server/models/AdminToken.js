import mongoose from 'mongoose';

const adminTokenSchema = new mongoose.Schema({
  adminId: mongoose.Schema.Types.ObjectId,
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 300 },// auto-delete after 1 hour
});

export default mongoose.model('AdminToken', adminTokenSchema);
