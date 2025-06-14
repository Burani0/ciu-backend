import express from 'express';
import ExamSubmission from '../models/examSubmission.js';

const router = express.Router();

// ✅ SUBMIT EXAM - correctly insert one document with multiple answers
router.post('/submit_exam', async (req, res) => {
  const {
    studentRegNo,
    examNo,
    examName,
    courseId,
    answers,
    violations,
    submissionTime,
    proctoringStatus,
  } = req.body;

  // Validate input
  if (!studentRegNo || !examNo || !examName || !courseId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Missing required fields or invalid answers array' });
  }

  for (const answer of answers) {
    if (!answer.section || !answer.answer) {
      return res.status(400).json({ error: 'Each answer must have a section and answer' });
    }
  }

  try {
    // ✅ Create one document, not multiple
    const submission = await ExamSubmission.create({
      studentRegNo,
      examNo,
      examName,
      courseId,
      answers,
      submissionTime: submissionTime || new Date(),
      proctoringStatus,
      violations: violations || [],
    });

    res.status(200).json({
      message: 'Exam submitted successfully',
      submissionId: submission._id,
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({
      error: 'Failed to submit exam',
      details: error.message,
    });
  }
});

// ✅ FETCH ONE SUBMISSION
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

export default router;
