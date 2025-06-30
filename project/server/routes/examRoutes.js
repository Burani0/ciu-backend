
import ExamLog  from '../models/exam_logs.js'; 



import express from 'express';
import ExamSubmission from '../models/examSubmission.js';
import Lecturer from '../models/Lecturer.js';
import Course from '../models/Course.js'; // Import Course model to fetch courseCode
import mongoose from 'mongoose';

const router = express.Router();



router.post('/submit_exam', async (req, res) => {
  const {
    studentRegNo,
    examNo,
    examName,
    courseId,
    answers,
    submissionTime,
    submissionType,
  } = req.body;
  console.log('🔥 Incoming Submission Payload:', req.body);

  // Validate required fields
  if (!studentRegNo || !examNo || !examName || !courseId || !submissionTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate answers array
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers must be an array' });
  }

  // For auto-submit, allow empty answers array
  if (submissionType === 'auto-submit' && answers.length === 0) {
    console.log('Auto-submit with no answers detected, proceeding with empty answers');
  } else {
    // Validate section and question structure for non-empty answers
    for (const section of answers) {
      if (!section.section || !Array.isArray(section.questions)) {
        return res.status(400).json({ error: 'Each answer section must have a section string and a questions array' });
      }
      for (const question of section.questions) {
        if (!question.questionNumber || typeof question.answer !== 'string') {
          return res.status(400).json({ error: 'Each question must have a questionNumber and a string answer' });
        }
      }
    }

    // For manual submission, ensure at least one non-empty answer
    if (submissionType !== 'auto-submit') {
      const hasAtLeastOneNonEmptyAnswer = answers.some(section =>
        Array.isArray(section.questions) &&
        section.questions.some(q => typeof q.answer === 'string' && q.answer.trim() !== '')
      );
      if (!hasAtLeastOneNonEmptyAnswer) {
        return res.status(400).json({ error: 'At least one answer must have a non-empty answer field for manual submission' });
      }
    }
  }

  console.log('Processed Answers:', answers);

  try {
    // Look up course by ID or courseCode
    let course = null;
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      course = await Course.findById(courseId);
    }
    if (!course) {
      course = await Course.findOne({ courseCode: courseId });
    }
    if (!course) {
      return res.status(404).json({ error: `Course not found for ID or Code: ${courseId}` });
    }

    // Save submission to database
    const submission = await ExamSubmission.create({
      studentRegNo,
      examNo,
      examName,
      courseId: course._id,
      courseCode: course.courseCode,
      answers,
      submissionTime: new Date(submissionTime),
      submissionType,
    });
    console.log('✅ Submission saved:', submission);

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



// ✅ Fetch single submission by ID
router.get('/fetch_exam_by_id/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }

    const submission = await ExamSubmission.findById(id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching submission by ID:', error);
    res.status(500).json({ error: 'Failed to fetch submission', details: error.message });
  }
});





router.get('/exam_logs', async (req, res) => {
  try {
    // Fetch all logs and sort by the latest timestamp of logEntries
    const logs = await ExamLog.find()
      .sort({ 'logEntries.timestamp': -1 }) // Sort by the most recent logEntry timestamp
      .lean(); // Convert to plain JavaScript object for better performance

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: 'No logs found' });
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs', details: error.message });
  }
});



router.post('/exam_logs', async (req, res) => {
  const { studentRegNo, examNo, courseId, logEntries } = req.body;

  if (!studentRegNo || !examNo || !courseId || !logEntries || !Array.isArray(logEntries)) {
    return res.status(400).json({ error: 'Missing required fields or invalid logEntries array' });
  }

  try {
    const processedLogEntries = logEntries.map(entry => {
      const { eventType, details } = entry;
      const filteredDetails = {
        violationType: details?.violationType, // Only include if it's a security violation
        remainingTime: details?.remainingTime, // Only include if it's a timer update
        timestamp: details?.timestamp || new Date().toISOString(),
      };
      // Remove undefined fields
      Object.keys(filteredDetails).forEach(key => filteredDetails[key] === undefined && delete filteredDetails[key]);
      return { eventType, details: filteredDetails };
    });

    const newLog = new ExamLog({
      studentRegNo,
      examNo,
      courseId,
      submissionTime: new Date(), // Capture submissionTime as current time
      logEntries: processedLogEntries,
    });
    await newLog.save();
    res.status(201).json({ message: 'Logs created successfully', submissionTime: newLog.submissionTime });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

export default router;






