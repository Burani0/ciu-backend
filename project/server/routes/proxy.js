// routes/proxy.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/exam-timetable', async (req, res) => {
  const { acadyr, sem, StartDate } = req.query;

  if (!acadyr || !sem || !StartDate) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  try {
    const externalURL = `https://eadmin.ciu.ac.ug/API/ExamTimeTableAPI.aspx?acadyr=${encodeURIComponent(acadyr)}&sem=${encodeURIComponent(sem)}&StartDate=${encodeURIComponent(StartDate)}`;
    const response = await axios.get(externalURL);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch from CIU API:', error.message);
    res.status(500).json({ message: 'Failed to fetch exam timetable' });
  }
});


// 🆕 Student Exams Proxy
router.get('/student-exams', async (req, res) => {
  const { reg, yr, sem } = req.query;

  if (!reg || !yr || !sem) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  try {
    const url = `https://eadmin.ciu.ac.ug/API/StudentExamsAPI.aspx?reg=${encodeURIComponent(reg)}&yr=${encodeURIComponent(yr)}&sem=${encodeURIComponent(sem)}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch student exams:', error.message);
    res.status(500).json({ message: 'Failed to fetch student exams' });
  }
});

router.get('/exam-pdf', async (req, res) => {
  const { ExamNo } = req.query;
  if (!ExamNo) {
    return res.status(400).json({ message: 'Missing ExamNo parameter' });
  }

  try {
    const url = `https://eadmin.ciu.ac.ug/API/doc_verification.aspx?doc=Exam&ExamNo=${encodeURIComponent(ExamNo)}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    res.setHeader('Content-Type', 'application/pdf');
    res.send(response.data);
  } catch (error) {
    console.error('Failed to fetch PDF document:', error.message);
    res.status(500).json({ message: 'Failed to fetch exam document' });
  }
});


router.get('/cleared-students', async (req, res) => {
  const { acad, sem } = req.query;
  if (!acad || !sem) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  try {
    const url = `https://eadmin.ciu.ac.ug/API/ClearedStudentsAPI.aspx?acad=${encodeURIComponent(acad)}&sem=${encodeURIComponent(sem)}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch cleared students:', error.message);
    res.status(500).json({ message: 'Failed to fetch cleared students data' });
  }
});

export default router;