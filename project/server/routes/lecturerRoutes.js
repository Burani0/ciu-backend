import express from 'express';
import { getLecturerProfile } from '../controllers/lecturerController.js';


const router = express.Router();

router.get('/profile/:id', getLecturerProfile); // Or secure it via token

export default router;
