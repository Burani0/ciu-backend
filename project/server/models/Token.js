import mongoose from 'mongoose';


const tokenSchema = new mongoose.Schema({
  lecturerId: mongoose.Schema.Types.ObjectId,
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 300 },
});
export default mongoose.model('Token', tokenSchema);

