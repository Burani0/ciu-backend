import express from 'express';
import ExamSubmission from '../models/examSubmission.js';

const router = express.Router();

// Submit exam
// router.post('/submit_exam', async (req, res) => {
//   const { studentRegNo, examNo, examName, courseId, answers, submissionTime } = req.body;

//   // Validate input
//   if (!studentRegNo || !examNo || !examName || !courseId || !answers || !Array.isArray(answers)) {
//     return res.status(400).json({ error: 'Missing required fields or invalid answers array' });
//   }

//   if (answers.length === 0) {
//     return res.status(400).json({ error: 'Answers array cannot be empty' });
//   }

//   for (const answer of answers) {
//     if (!answer.answer) {
//       return res.status(400).json({ error: 'Each answer must have an answer field' });
//     }
//   }

  

//   try {
//     const submission = await ExamSubmission.create({
//       studentRegNo,
//       examNo,
//       examName,
//       courseId,
//       answers,
//       submissionTime: submissionTime || new Date(),
//     });

//     res.status(200).json({
//       message: 'Exam submitted successfully',
     
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ error: 'Submission already exists for this exam and student' });
//     }
//     console.error('Error submitting exam:', error);
//     res.status(500).json({ error: 'Failed to submit exam', details: error.message });
//   }
// });

 // Adjust path as needed

router.post('/submit_exam', async (req, res) => {
  const { studentRegNo, examNo, examName, courseId, answers, submissionTime, submissionType } = req.body;

  // Validate input
  if (!studentRegNo || !examNo || !examName || !courseId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Missing required fields or invalid answers array' });
  }

  // Preprocess answers for auto-submit
  let processedAnswers = [...answers];
  if (submissionType === 'auto-submit' && answers.length === 0) {
    // For auto-submit with no answers, add a default entry
    processedAnswers = [{ section: 'default', answer: 'Auto-submitted with no answers' }];
  } else if (submissionType !== 'auto-submit' && answers.length === 0) {
    return res.status(400).json({ error: 'Answers array cannot be empty for manual submission' });
  }

  // Validate each answer
  for (const answer of processedAnswers) {
    if (answer.answer !== undefined && typeof answer.answer !== 'string') {
      return res.status(400).json({ error: 'Each answer must have a valid string answer field' });
    }
    // Ensure answer is not empty for non-auto-submit cases
    if (submissionType !== 'auto-submit' && (!answer.answer || answer.answer.trim() === '')) {
      return res.status(400).json({ error: 'Each answer must have a non-empty answer field for manual submission' });
    }
  }

  try {
    const submission = await ExamSubmission.create({
      studentRegNo,
      examNo,
      examName,
      courseId,
      answers: processedAnswers,
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