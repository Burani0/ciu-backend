import Lecturer from '../models/Lecturer.js';
import Token from '../models/Token.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/mailer.js';

export const login = async (req, res) => {
  const { universityNumber, password } = req.body;
  const lecturer = await Lecturer.findOne({ universityNumber });
  if (!lecturer || !(await bcrypt.compare(password, lecturer.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  await new Token({ lecturerId: lecturer._id, token }).save();
  await sendEmail(lecturer.email, 'Login Verification Code', `Your code: ${token}`);
  // res.json({ message: 'Token sent to email' });
  res.json({ 
    message: 'Token sent to email',
    lecturerId: lecturer._id  // ✅ This allows the frontend to store it
  });
};

export const verifyToken = async (req, res) => {
  const { universityNumber, token } = req.body;

  if (!universityNumber || !token) {
    return res.status(400).json({ message: 'University number and token are required' });
  }

  // Find the lecturer using the university number
  const lecturer = await Lecturer.findOne({ universityNumber });
  if (!lecturer) {
    return res.status(404).json({ message: 'Lecturer not found' });
  }

  // Check if the token matches the one stored for that lecturer
  const tokenDoc = await Token.findOne({ lecturerId: lecturer._id, token });
  if (!tokenDoc) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Token is valid
  res.status(200).json({ message: 'Token verified', lecturerId: lecturer._id });
};
