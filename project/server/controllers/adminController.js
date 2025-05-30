import Course from '../models/Course.js';
import Lecturer from '../models/Lecturer.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/mailer.js';

export const createCourse = async (req, res) => {
  const { courseTitle, courseCode } = req.body;
  const course = new Course({ courseTitle, courseCode });
  await course.save();
  res.status(201).json(course);
};

export const registerLecturer = async (req, res) => {
  const { firstName, lastName, email, universityNumber, password, courseIds } = req.body;

  // Validate course IDs
  const validCourses = await Course.find({ _id: { $in: courseIds } });
  if (validCourses.length !== courseIds.length) {
    return res.status(400).json({ message: 'One or more course IDs are invalid' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const lecturer = new Lecturer({
    firstName,
    lastName,
    email,
    universityNumber,
    password: hashedPassword,
    assignedCourses: courseIds,
  });

  await lecturer.save();

  await sendEmail(
    email,
    'Account Created',
    `University Number: ${universityNumber}\nPassword: ${password}`
  );

  res.status(201).json({ message: 'Lecturer registered and assigned to courses' });
};

export const lecturerLogin = async (req, res) => {
  const { universityNumber, password } = req.body;

  const lecturer = await Lecturer.findOne({ universityNumber });
  if (!lecturer) return res.status(400).json({ message: 'Lecturer not found' });

  const isMatch = await bcrypt.compare(password, lecturer.password);
  if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

  const token = jwt.sign({ id: lecturer._id }, 'secretKey', { expiresIn: '1h' });

  await sendEmail(lecturer.email, 'Login Token', `Your login token: ${token}`);

  res.status(200).json({ message: 'Login successful. Token sent to email.' });
};

export const getDashboardStats = async (req, res) => {
  const totalCourses = await Course.countDocuments();
  const totalLecturers = await Lecturer.countDocuments();
  res.json({ totalCourses, totalLecturers });
};

export const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.status(200).json(courses);
};



export const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  const existing = await Admin.findOne({ username });
  if (existing) return res.status(400).json({ message: 'Username already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hashedPassword });

  await admin.save();
  res.status(201).json({ message: 'Admin created successfully' });
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  res.status(200).json({ message: 'Login successful' });
};

// GET all lecturers
export const getAllLecturers = async (req, res) => {
  const lecturers = await Lecturer.find().populate('assignedCourses');
  res.status(200).json(lecturers);
};

// GET all admins
export const getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json(admins);
};

// UPDATE course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { courseTitle, courseCode } = req.body;

  const updated = await Course.findByIdAndUpdate(id, { courseTitle, courseCode }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Course not found' });

  res.status(200).json(updated);
};

// UPDATE lecturer
export const updateLecturer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, universityNumber, courseIds } = req.body;

  const updated = await Lecturer.findByIdAndUpdate(
    id,
    { firstName, lastName, email, universityNumber, assignedCourses: courseIds },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Lecturer not found' });

  res.status(200).json(updated);
};

// UPDATE admin
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const updated = await Admin.findByIdAndUpdate(id, { username, password: hashedPassword }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Admin not found' });

  res.status(200).json(updated);
};

// DELETE course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const deleted = await Course.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Course not found' });

  res.status(200).json({ message: 'Course deleted successfully' });
};

// DELETE lecturer
export const deleteLecturer = async (req, res) => {
  const { id } = req.params;
  const deleted = await Lecturer.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Lecturer not found' });

  res.status(200).json({ message: 'Lecturer deleted successfully' });
};

// DELETE admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const deleted = await Admin.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Admin not found' });

  res.status(200).json({ message: 'Admin deleted successfully' });
};
