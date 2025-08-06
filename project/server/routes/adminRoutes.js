import express from 'express';
import {getLecturerLoginLogs, createCourse, registerLecturer, getDashboardStats, getAllCourses,  getAllLecturers,
  getAllAdmins,
  updateCourse,
  updateLecturer,
  deleteCourse,
  getAdminById,
  deleteLecturer,
  createAdmin,
  adminLogin,
  getSubmissionById,  
  clearToken,

 
   adminLogout,
 } from '../controllers/adminController.js';
  import { getLecturerSubmissions } from '../controllers/adminController.js';
  import { getLecturerById } from '../controllers/adminController.js';
  import { getCourseById }   from '../controllers/adminController.js';
  import { updateAdmin } from '../controllers/adminController.js';
  import { deleteAdmin } from '../controllers/adminController.js';
  import { bulkCreateCourses } from '../controllers/adminController.js';
  import { bulkCreateLecturers } from '../controllers/adminController.js';
  import { getCourseByCode } from '../controllers/adminController.js';

  
  



const router = express.Router();
router.get('/login-logs', getLecturerLoginLogs);
router.post('/create-course', createCourse);
router.post('/register-lecturer', registerLecturer);
router.get('/dashboard', getDashboardStats);



router.get('/courses', getAllCourses);
router.get('/lecturers', getAllLecturers);
router.get('/lecturers/:id', getLecturerById);
router.get('/courses/:id', getCourseById);
router.get('/course-by-code/:code', getCourseByCode);
router.get('/admins', getAllAdmins);
router.get('/lecturer/:lecturerId/submissions', getLecturerSubmissions);
router.get('/fetch_exam_by_id/:id', getSubmissionById);


router.put('/courses/:id', updateCourse);
router.put('/lecturers/:id', updateLecturer);

router.get('/admin/:id', getAdminById);
router.put('/admin/:id', updateAdmin);

router.delete('/courses/:id', deleteCourse);
router.delete('/lecturers/:id', deleteLecturer);
router.delete('/admin/:id', deleteAdmin);


router.post('/create-admin', createAdmin);
router.post('/admin-login', adminLogin);
router.post('/cleartoken', clearToken );
router.delete('/admin/:id', deleteAdmin);
router.post('/adminlogout', adminLogout);
router.post('/bulk-create-courses', bulkCreateCourses);
router.post('/bulk-create-lecturers', bulkCreateLecturers);

export default router;