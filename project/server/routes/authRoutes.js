// import express from 'express';
// import { login, verifyToken, lecturerLogout } from '../controllers/authController.js';
// const router = express.Router();
// router.post('/login', login);
// router.post('/verify', verifyToken);
// router.post('/lecturerlogout', lecturerLogout);
// export default router;


import express from 'express';
import { login, verifyToken, lecturerLogout, forceLogoutByUniversityNumber } from '../controllers/authController.js';
const router = express.Router();
router.post('/login', login);
router.post('/verify', verifyToken);
router.post('/lecturerlogout', lecturerLogout);
router.post('/force-logout', forceLogoutByUniversityNumber); // Admin can clear stuck sessions
export default router;