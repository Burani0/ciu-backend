import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  first_name : {type: String, unique: true, required: true  },
  last_name : {type: String, unique: true, required: true  },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export default mongoose.model('Admin', adminSchema);
