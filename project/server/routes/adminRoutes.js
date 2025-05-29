import express from 'express';
import { createCourse, registerLecturer, getDashboardStats, getAllCourses, createAdmin, adminLogin } from '../controllers/adminController.js';
const router = express.Router();
router.post('/create-course', createCourse);
router.post('/register-lecturer', registerLecturer);
router.get('/dashboard', getDashboardStats);
router.get('/courses', getAllCourses);
router.post('/create-admin', createAdmin);
router.post('/admin-login', adminLogin);

export default router;