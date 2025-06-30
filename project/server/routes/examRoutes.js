import express from 'express';
import ExamSubmission from '../models/examSubmission.js';
import ExamLog  from '../models/exam_logs.js'; 
import PDFDocument from 'pdfkit';
const router = express.Router();


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
    const transformedSubmissions = submissions.map(sub => ({
      ...sub._doc,
      answers: sub.answers.flatMap(answer => {
        if (typeof answer === 'object' && answer.answer) {
          // Split the answer by newlines and filter out empty lines
          const splitAnswers = answer.answer.split('\n').filter(a => a.trim());
          return splitAnswers.length > 1 ? splitAnswers : [answer.answer];
        }
        return [answer]; // Return as single item if not an object or no split needed
      }),
    }));
    res.status(200).json(transformedSubmissions);
  } catch (error) {
    console.error('Error fetching all exams:', error);
    res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
  }
});






router.get('/fetch_exam_logs', async (req, res) => {
  try {
    const { studentRegNo, examNo, courseId, download, format } = req.query;

    const filter = {};
    if (studentRegNo) filter.studentRegNo = { $regex: studentRegNo, $options: 'i' };
    if (examNo) filter.examNo = { $regex: examNo, $options: 'i' };
    if (courseId) filter.courseId = { $regex: courseId, $options: 'i' };

    const logs = await ExamLog.find(filter).sort({ 'logEntries.timestamp': -1 }).lean();

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: 'No logs found' });
    }

    // 📄 Generate PDF if requested
    if (download === 'true' && format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=exam_logs.pdf');
      doc.pipe(res);

      doc.fontSize(18).text('Exam Activity Logs', { align: 'center' });
      doc.moveDown();

      logs.forEach((log, index) => {
        doc
          .fontSize(12)
          .text(`Student Reg No: ${log.studentRegNo}`)
          .text(`Exam No: ${log.examNo}`)
          .text(`Course ID: ${log.courseId}`)
          .text('Log Entries:');

        log.logEntries.forEach((entry, i) => {
          doc.text(`  ${i + 1}. Event Type: ${entry.eventType}`);
          Object.entries(entry.details).forEach(([key, value]) => {
            doc.text(`     ${key}: ${value}`);
          });
        });

        doc.moveDown();
      });

      doc.end();
      return;
    }

    // ✅ Return JSON by default
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
        violationType: details.violationType, // Only include if it's a security violation
        remainingTime: details.remainingTime, // Only include if it's a timer update
        timestamp: details.timestamp || new Date().toISOString(),
      };
      // Remove undefined fields
      Object.keys(filteredDetails).forEach(key => filteredDetails[key] === undefined && delete filteredDetails[key]);
      return { eventType, details: filteredDetails };
    });

    const newLog = new ExamLog({
      studentRegNo,
      examNo,
      courseId,
      logEntries: processedLogEntries,
    });
    await newLog.save();
    res.status(201).json({ message: 'Logs created successfully' });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

export default router;


