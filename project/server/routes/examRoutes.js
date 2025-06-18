import express from 'express';
import ExamSubmission from '../models/examSubmission.js';

const router = express.Router();

// Submit exam
router.post('/submit_exam', async (req, res) => {
  const { studentRegNo, examNo, examName, courseId, answers, submissionTime } = req.body;

  // Validate input
  if (!studentRegNo || !examNo || !examName || !courseId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Missing required fields or invalid answers array' });
  }

  if (answers.length === 0) {
    return res.status(400).json({ error: 'Answers array cannot be empty' });
  }

  for (const answer of answers) {
    if (!answer.answer) {
      return res.status(400).json({ error: 'Each answer must have an answer field' });
    }
  }

  // Validate format of studentRegNo and examNo
  // est(studentRegNo) || !/^[A-Za-z0-9]+$/.test(examNo)) {
  //   return resif (!/^[A-Za-z0-9]+$/.t.status(400).json({ error: 'Invalid studentRegNo or examNo format' });
  // }

  try {
    const submission = await ExamSubmission.create({
      studentRegNo,
      examNo,
      examName,
      courseId,
      answers,
      submissionTime: submissionTime || new Date(),
    });

    res.status(200).json({
      message: 'Exam submitted successfully',
     
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Submission already exists for this exam and student' });
    }
    console.error('Error submitting exam:', error);
    res.status(500).json({ error: 'Failed to submit exam', details: error.message });
  }
});

// Fetch one submission
router.get('/fetch_exam/:examNo/:studentRegNo', async (req, res) => {
  try {
    const { examNo, studentRegNo } = req.params;
    const submission = await ExamSubmission.findOne({ examNo, studentRegNo });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Failed to fetch exam', details: error.message });
  }
});

// Fetch all exams for a student
router.get('/fetch_all_exams/:studentRegNo', async (req, res) => {
  try {
    const { studentRegNo } = req.params;
    const submissions = await ExamSubmission.find({ studentRegNo });

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching all exams for student:', error);
    res.status(500).json({ error: 'Failed to fetch exams', details: error.message });
  }
});

// Fetch all exams (no inputs)
router.get('/fetch_all_exams', async (req, res) => {
  try {
    const submissions = await ExamSubmission.find({});
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching all exams:', error);
    res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
  }
});

export default router;