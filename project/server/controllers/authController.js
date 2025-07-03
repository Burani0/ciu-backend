import Lecturer from '../models/Lecturer.js';
import Token from '../models/Token.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/mailer.js';
import LecturerLoginLog from '../models/LecturerLoginLog.js';
import jwt from 'jsonwebtoken'; // ✅ Import JWT

// ✅ Login controller
export const login = async (req, res) => {
  try {
    const { universityNumber, password } = req.body;

    const lecturer = await Lecturer.findOne({ universityNumber });
    if (!lecturer || !(await bcrypt.compare(password, lecturer.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate 6-digit token
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Save token to DB
    await new Token({ lecturerId: lecturer._id, token }).save();

    // Log the login event
    await LecturerLoginLog.create({
      universityNumber: lecturer.universityNumber,
      loginTime: new Date(),
    });

    // Send token to lecturer's email
    await sendEmail(lecturer.email, 'Login Verification Code', `Your code: ${token}`);

    res.status(200).json({
      message: 'Token sent to email',
      lecturerId: lecturer._id,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Verify token and return JWT controller
export const verifyToken = async (req, res) => {
  try {
    const { universityNumber, token } = req.body;

    if (!universityNumber || !token) {
      return res.status(400).json({ message: 'University number and token are required' });
    }

    const lecturer = await Lecturer.findOne({ universityNumber });
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    const tokenDoc = await Token.findOne({ lecturerId: lecturer._id, token });
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // ✅ Generate JWT
    const access_token = jwt.sign(
      {
        id: lecturer._id,
        universityNumber: lecturer.universityNumber,
        email: lecturer.email,
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key', // Replace with env var in production
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Token verified',
      lecturerId: lecturer._id,
      access_token,
    });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
