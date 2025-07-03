import express from 'express';
import { login, verifyToken, lecturerLogout } from '../controllers/authController.js';
const router = express.Router();
router.post('/login', login);
router.post('/verify', verifyToken);
router.post('/lecturerlogout', lecturerLogout);
export default router;


