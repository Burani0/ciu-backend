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

export default router;
