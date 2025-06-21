import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
const router = express.Router();

// Preflight OPTIONS handler
router.options('/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://examiner.ciu.ac.ug');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Actual POST /login route
router.post('/login', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://examiner.ciu.ac.ug');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}, login);

// You can also add it to /verify if needed
router.post('/verify', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://examiner.ciu.ac.ug');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}, verifyToken);

export default router;
