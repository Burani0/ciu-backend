import express from 'express';
import {getLecturerLoginLogs, createCourse, registerLecturer, getDashboardStats, getAllCourses,  getAllLecturers,
  getAllAdmins,
  updateCourse,
  updateLecturer,
  updateAdmin,
  deleteCourse,
  getAdminById,
  deleteLecturer,
  createAdmin,
  adminLogin,  
  clearToken,
  deleteAdmin, } from '../controllers/adminController.js';
  import { getLecturerById } from '../controllers/adminController.js';
  import { getCourseById }   from '../controllers/adminController.js';


const router = express.Router();
router.get('/login-logs', getLecturerLoginLogs);
router.post('/create-course', createCourse);
router.post('/register-lecturer', registerLecturer);
router.get('/dashboard', getDashboardStats);



router.get('/courses', getAllCourses);
router.get('/lecturers', getAllLecturers);
router.get('/lecturers/:id', getLecturerById);
router.get('/admins/:id', getAdminById);
router.get('/courses/:id', getCourseById);
router.get('/admins', getAllAdmins);

router.put('/courses/:id', updateCourse);
router.put('/lecturers/:id', updateLecturer);

router.get('/admins/:id', getAdminById);

router.delete('/courses/:id', deleteCourse);
router.delete('/lecturers/:id', deleteLecturer);


router.post('/create-admin', createAdmin);
router.post('/admin-login', adminLogin);
router.post('/cleartoken', clearToken );
router.delete('/admins/:id', deleteAdmin);

export default router;