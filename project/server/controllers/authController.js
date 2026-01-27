// import Lecturer from '../models/Lecturer.js';
// import Token from '../models/Token.js';
// import bcrypt from 'bcryptjs';
// import { sendEmail } from '../utils/mailer.js';
// import LecturerLoginLog from '../models/LecturerLoginLog.js';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';

// // helper: hash session id before saving
// const hashSession = (sid) => crypto.createHash('sha256').update(sid).digest('hex');

// // ✅ Login controller (unchanged logic, still emails OTP)
// export const login = async (req, res) => {
//   try {
//     const { universityNumber, password } = req.body;

//     const lecturer = await Lecturer.findOne({ universityNumber });
//     if (!lecturer || !(await bcrypt.compare(password, lecturer.password))) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // 🔒 BLOCK if already logged in elsewhere
//     const now = new Date();
//     if (
//       lecturer.activeSessionHash !== null &&
//       lecturer.activeSessionExpiresAt !== null &&
//       lecturer.activeSessionExpiresAt > now
//     ) {
//       return res.status(409).json({
//         message: 'Account already logged in on another device or browser.',
//       });
//     }

//     // Generate OTP
//     const token = Math.floor(100000 + Math.random() * 900000).toString();

//     await Token.create({
//       lecturerId: lecturer._id,
//       token,
//     });

//     await LecturerLoginLog.create({
//       universityNumber: lecturer.universityNumber,
//       loginTime: new Date(),
//     });

//     await sendEmail(
//       lecturer.email,
//       'Login Verification Code',
//       `Your verification code is: ${token}`
//     );

//     return res.status(200).json({
//       message: 'Verification code sent to email',
//       lecturerId: lecturer._id,
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


// // ✅ Verify token and return JWT controller (NOW enforces single session)
// export const verifyToken = async (req, res) => {
//   try {
//     const { universityNumber, token } = req.body;

//     if (!universityNumber || !token) {
//       return res.status(400).json({ message: 'University number and token are required' });
//     }

//     const lecturer = await Lecturer.findOne({ universityNumber });
//     if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });

//     const tokenDoc = await Token.findOne({ lecturerId: lecturer._id, token });
//     if (!tokenDoc) return res.status(401).json({ message: 'Invalid token' });

//     const sessionId = crypto.randomBytes(32).toString('hex');
//     const sessionExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
//     const newHash = hashSession(sessionId);
//     const now = new Date();

//     const claimed = await Lecturer.findOneAndUpdate(
//       {
//         _id: lecturer._id,
//         $or: [
//           { activeSessionHash: null },
//           { activeSessionExpiresAt: null },
//           { activeSessionExpiresAt: { $lte: now } },
//         ],
//       },
//       { $set: { activeSessionHash: newHash, activeSessionExpiresAt: sessionExpiresAt } },
//       { new: true }
//     );

//     if (!claimed) {
//       return res.status(409).json({
//         message: 'Account already logged in on another device/browser. Please logout there first.',
//       });
//     }

//     await Token.deleteMany({ lecturerId: lecturer._id });

//     const access_token = jwt.sign(
//       { id: lecturer._id, universityNumber: lecturer.universityNumber, sid: sessionId },
//       process.env.JWT_SECRET || 'your_jwt_secret_key',
//       { expiresIn: '1h' }
//     );

//     return res.status(200).json({ message: 'Token verified', lecturerId: lecturer._id, access_token });
//   } catch (err) {
//     console.error('Token verification error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


// // ✅ Logout: clears the ONLY active session
// export const lecturerLogout = async (req, res) => {
//   const { lecturerId } = req.body;

//   try {
//     const lecturer = await Lecturer.findById(lecturerId);
//     if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });

//     await LecturerLoginLog.findOneAndUpdate(
//       { universityNumber: lecturer.universityNumber },
//       { logoutTime: new Date() },
//       { sort: { loginTime: -1 } }
//     );

//     lecturer.activeSessionHash = null;
//     lecturer.activeSessionExpiresAt = null;
//     await lecturer.save();

//     await Token.deleteMany({ lecturerId });

//     return res.json({ message: 'Lecturer logged out successfully' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     return res.status(500).json({ message: 'Logout failed' });
//   }
// };

// // ✅ Middleware: protects routes & blocks “old tokens” after logout/login elsewhere
// export const requireLecturerSession = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization || '';
//     const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
//     if (!token) return res.status(401).json({ message: 'Missing token' });

//     const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

//     const lecturer = await Lecturer.findById(payload.id);
//     if (!lecturer) return res.status(401).json({ message: 'Invalid session' });

//     const now = new Date();
//     if (!lecturer.activeSessionHash || !lecturer.activeSessionExpiresAt || lecturer.activeSessionExpiresAt <= now) {
//       return res.status(401).json({ message: 'Session expired. Please login again.' });
//     }

//     const incomingHash = hashSession(payload.sid || '');
//     if (incomingHash !== lecturer.activeSessionHash) {
//       return res.status(401).json({ message: 'Logged out (or logged in elsewhere).' });
//     }

//     req.user = payload;
//     return next();
//   } catch (e) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };


import Lecturer from '../models/Lecturer.js';
import Token from '../models/Token.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/mailer.js';
import LecturerLoginLog from '../models/LecturerLoginLog.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// helper: hash session id before saving
const hashSession = (sid) => crypto.createHash('sha256').update(sid).digest('hex');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const SESSION_MS = 60 * 60 * 1000; // 1 hour

// ✅ Login controller (emails OTP)
export const login = async (req, res) => {
  try {
    const { universityNumber, password } = req.body;

    const lecturer = await Lecturer.findOne({ universityNumber });
    if (!lecturer || !(await bcrypt.compare(password, lecturer.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 🔒 BLOCK if already logged in elsewhere (prevents OTP spam)
    const now = new Date();
    if (
      lecturer.activeSessionHash !== null &&
      lecturer.activeSessionExpiresAt !== null &&
      lecturer.activeSessionExpiresAt > now
    ) {
      return res.status(409).json({
        message: 'Account already logged in on another device or browser. Please logout first.',
        alreadyLoggedIn: true
      });
    }

    // Generate OTP
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    await Token.create({
      lecturerId: lecturer._id,
      token,
    });

    await LecturerLoginLog.create({
      universityNumber: lecturer.universityNumber,
      loginTime: new Date(),
    });

    await sendEmail(
      lecturer.email,
      'Login Verification Code',
      `Your verification code is: ${token}`
    );

    return res.status(200).json({
      message: 'Verification code sent to email',
      lecturerId: lecturer._id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Verify token and return JWT (ATOMIC single-session enforcement)
export const verifyToken = async (req, res) => {
  try {
    const { universityNumber, token } = req.body;

    if (!universityNumber || !token) {
      return res.status(400).json({ message: 'University number and token are required' });
    }

    const lecturer = await Lecturer.findOne({ universityNumber });
    if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });

    const tokenDoc = await Token.findOne({ lecturerId: lecturer._id, token });
    if (!tokenDoc) return res.status(401).json({ message: 'Invalid token' });

    const sessionId = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = new Date(Date.now() + SESSION_MS);
    const newHash = hashSession(sessionId);
    const now = new Date();

    // ✅ ATOMIC claim: only ONE request can set the active session
    const claimed = await Lecturer.findOneAndUpdate(
      {
        _id: lecturer._id,
        $or: [
          { activeSessionHash: null },
          { activeSessionExpiresAt: null },
          { activeSessionExpiresAt: { $lte: now } },
        ],
      },
      { $set: { activeSessionHash: newHash, activeSessionExpiresAt: sessionExpiresAt } },
      { new: true }
    );

    if (!claimed) {
      return res.status(409).json({
        message: 'Account already logged in on another device/browser. Please logout there first.',
        alreadyLoggedIn: true
      });
    }

    // OTP can't be reused
    await Token.deleteMany({ lecturerId: lecturer._id });

    const access_token = jwt.sign(
      { id: lecturer._id, universityNumber: lecturer.universityNumber, sid: sessionId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Token verified',
      lecturerId: lecturer._id,
      access_token,
    });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Logout: clears the ONLY active session
export const lecturerLogout = async (req, res) => {
  const { lecturerId } = req.body;

  try {
    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });

    await LecturerLoginLog.findOneAndUpdate(
      { universityNumber: lecturer.universityNumber },
      { logoutTime: new Date() },
      { sort: { loginTime: -1 } }
    );

    lecturer.activeSessionHash = null;
    lecturer.activeSessionExpiresAt = null;
    await lecturer.save();

    await Token.deleteMany({ lecturerId });

    return res.json({ message: 'Lecturer logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Logout failed' });
  }
};

// ✅ Middleware: protects routes & blocks “old tokens” after logout/login elsewhere
export const requireLecturerSession = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });

    const payload = jwt.verify(token, JWT_SECRET);

    const lecturer = await Lecturer.findById(payload.id);
    if (!lecturer) return res.status(401).json({ message: 'Invalid session' });

    const now = new Date();
    if (!lecturer.activeSessionHash || !lecturer.activeSessionExpiresAt || lecturer.activeSessionExpiresAt <= now) {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    const incomingHash = hashSession(payload.sid || '');
    if (incomingHash !== lecturer.activeSessionHash) {
      return res.status(401).json({ message: 'Logged out (or logged in elsewhere).' });
    }

    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// ✅ OPTIONAL: Force logout - Admin can use this to clear stuck sessions
export const forceLogoutByUniversityNumber = async (req, res) => {
  const { universityNumber } = req.body;

  try {
    const lecturer = await Lecturer.findOne({ universityNumber });
    if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });

    lecturer.activeSessionHash = null;
    lecturer.activeSessionExpiresAt = null;
    await lecturer.save();

    await Token.deleteMany({ lecturerId: lecturer._id });

    return res.json({ message: 'Session cleared successfully' });
  } catch (error) {
    console.error('Force logout error:', error);
    return res.status(500).json({ message: 'Force logout failed' });
  }
};