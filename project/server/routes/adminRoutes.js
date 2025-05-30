import express from 'express';
import { createCourse, registerLecturer, getDashboardStats, getAllCourses, createAdmin, adminLogin,   getAllLecturers,
  getAllAdmins,
  updateCourse,
  updateLecturer,
  updateAdmin,
  deleteCourse,
  deleteLecturer,
  deleteAdmin, } from '../controllers/adminController.js';


const router = express.Router();
router.post('/create-course', createCourse);
router.post('/register-lecturer', registerLecturer);
router.get('/dashboard', getDashboardStats);

router.post('/create-admin', createAdmin);
router.post('/admin-login', adminLogin);

router.get('/courses', getAllCourses);
router.get('/lecturers', getAllLecturers);
router.get('/admins', getAllAdmins);

router.put('/courses/:id', updateCourse);
router.put('/lecturers/:id', updateLecturer);
router.put('/admins/:id', updateAdmin);

router.delete('/courses/:id', deleteCourse);
router.delete('/lecturers/:id', deleteLecturer);
router.delete('/admins/:id', deleteAdmin);

export default router;