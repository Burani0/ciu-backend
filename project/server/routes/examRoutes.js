// import express from 'express';
// import ExamSubmission from '../models/examSubmission.js';
// import Lecturer from '../models/lecturerModel.js';

// const router = express.Router();

// // Submit exam
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

//   // Validate format of studentRegNo and examNo
//   // est(studentRegNo) || !/^[A-Za-z0-9]+$/.test(examNo)) {
//   //   return resif (!/^[A-Za-z0-9]+$/.t.status(400).json({ error: 'Invalid studentRegNo or examNo format' });
//   // }

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

// // Fetch one submission
// router.get('/fetch_exam/:examNo/:studentRegNo', async (req, res) => {
//   try {
//     const { examNo, studentRegNo } = req.params;
//     const submission = await ExamSubmission.findOne({ examNo, studentRegNo });

//     if (!submission) {
//       return res.status(404).json({ error: 'Submission not found' });
//     }

//     res.status(200).json(submission);
//   } catch (error) {
//     console.error('Error fetching exam:', error);
//     res.status(500).json({ error: 'Failed to fetch exam', details: error.message });
//   }
// });

// // Fetch all exams for a student
// router.get('/fetch_all_exams/:studentRegNo', async (req, res) => {
//   try {
//     const { studentRegNo } = req.params;
//     const submissions = await ExamSubmission.find({ studentRegNo });

//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching all exams for student:', error);
//     res.status(500).json({ error: 'Failed to fetch exams', details: error.message });
//   }
// });

// // Fetch all exams (no inputs)
// router.get('/fetch_all_exams', async (req, res) => {
//   try {
//     const submissions = await ExamSubmission.find({});
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching all exams:', error);
//     res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
//   }

//   // Fetch all submissions for lecturer's assigned courses
// router.get('/lecturer/:lecturerId/submissions', async (req, res) => {
//   const { lecturerId } = req.params;

//   try {
//     // Find lecturer
//     const lecturer = await Lecturer.findById(lecturerId);
//     if (!lecturer) {
//       return res.status(404).json({ error: 'Lecturer not found' });
//     }

//     // Extract course IDs
//     const assignedCourseIds = lecturer.assignedCourses.map((course) => {
//       return typeof course === 'string' ? course : course.courseId || course._id;
//     });

//     // Get submissions for those courses
//     const submissions = await ExamSubmission.find({
//       courseId: { $in: assignedCourseIds }
//     });

//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching submissions for lecturer:', error);
//     res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
//   }
// });

// export default router;

// import express from 'express';
// import ExamSubmission from '../models/examSubmission.js';
// import Lecturer from '../models/Lecturer.js';

// const router = express.Router();

// // Submit exam
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

// //  Adjust path as needed

// router.post('/submit_exam', async (req, res) => {
//   const { studentRegNo, examNo, examName, courseId, answers, submissionTime, submissionType } = req.body;

//   if (!studentRegNo || !examNo || !examName || !courseId || !answers || !Array.isArray(answers)) {
//     return res.status(400).json({ error: 'Missing required fields or invalid answers array' });
//   }

//   // Preprocess answers for auto-submit
//   let processedAnswers = [...answers];
//   if (submissionType === 'auto-submit' && answers.length === 0) {
//     // For auto-submit with no answers, add a default entry
//     processedAnswers = [{ section: 'default', answer: 'Auto-submitted with no answers' }];
//   } else if (submissionType !== 'auto-submit' && answers.length === 0) {
//     return res.status(400).json({ error: 'Answers array cannot be empty for manual submission' });
//   }

//   // Validate each answer
//   for (const answer of processedAnswers) {
//     if (answer.answer !== undefined && typeof answer.answer !== 'string') {
//       return res.status(400).json({ error: 'Each answer must have a valid string answer field' });
//     }
//     // Ensure answer is not empty for non-auto-submit cases
//     if (submissionType !== 'auto-submit' && (!answer.answer || answer.answer.trim() === '')) {
//       return res.status(400).json({ error: 'Each answer must have a non-empty answer field for manual submission' });
//     }
//   }

//   try {
//     const submission = await ExamSubmission.create({
//       studentRegNo,
//       examNo,
//       examName,
//       courseId,
//       answers: processedAnswers,
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

// // Fetch one submission
// router.get('/fetch_exam/:examNo/:studentRegNo', async (req, res) => {
//   try {
//     const { examNo, studentRegNo } = req.params;
//     const submission = await ExamSubmission.findOne({ examNo, studentRegNo });

//     if (!submission) {
//       return res.status(404).json({ error: 'Submission not found' });
//     }

//     res.status(200).json(submission);
//   } catch (error) {
//     console.error('Error fetching exam:', error);
//     res.status(500).json({ error: 'Failed to fetch exam', details: error.message });
//   }
// });

// // Fetch all exams for a student
// router.get('/fetch_all_exams/:studentRegNo', async (req, res) => {
//   try {
//     const { studentRegNo } = req.params;
//     const submissions = await ExamSubmission.find({ studentRegNo });
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching all exams for student:', error);
//     res.status(500).json({ error: 'Failed to fetch exams', details: error.message });
//   }
// });

// // Fetch all exams (for admin or debugging)
// router.get('/fetch_all_exams', async (req, res) => {
//   try {
//     const submissions = await ExamSubmission.find({});
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching all exams:', error);
//     res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
//   }
// });

// // ✅ Fetch all submissions for lecturer's assigned courses
// router.get('/lecturer/:lecturerId/submissions', async (req, res) => {
//   const { lecturerId } = req.params;

//   try {
//     const lecturer = await Lecturer.findById(lecturerId).populate('assignedCourses');
//     if (!lecturer) {
//       return res.status(404).json({ error: 'Lecturer not found' });
//     }

//     const assignedCourseIds = lecturer.assignedCourses.map((course) =>
//       typeof course === 'string' ? course : course._id.toString()
//     );

//     const submissions = await ExamSubmission.find({
//       courseId: { $in: assignedCourseIds },
//     })

//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching submissions for lecturer:', error);
//     res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
//   }
// });

// export default router;


// import express from 'express';
// import ExamSubmission from '../models/examSubmission.js';

// const router = express.Router();


// router.post('/submit_exam', async (req, res) => {
//   const { studentRegNo, examNo, examName, courseId, answers, submissionTime, submissionType } = req.body;

//   // Validate input
//   if (!studentRegNo || !examNo || !examName || !courseId || !answers || !Array.isArray(answers)) {
//     return res.status(400).json({ error: 'Missing required fields or invalid answers array' });
//   }

//   // Preprocess answers for auto-submit
//   let processedAnswers = [...answers];
//   if (submissionType === 'auto-submit' && answers.length === 0) {
//     // For auto-submit with no answers, add a default entry
//     processedAnswers = [{ section: 'default', answer: 'Auto-submitted with no answers' }];
//   } else if (submissionType !== 'auto-submit' && answers.length === 0) {
//     return res.status(400).json({ error: 'Answers array cannot be empty for manual submission' });
//   }

//   // Validate each answer
//   for (const answer of processedAnswers) {
//     if (answer.answer !== undefined && typeof answer.answer !== 'string') {
//       return res.status(400).json({ error: 'Each answer must have a valid string answer field' });
//     }
//     // Ensure answer is not empty for non-auto-submit cases
//     if (submissionType !== 'auto-submit' && (!answer.answer || answer.answer.trim() === '')) {
//       return res.status(400).json({ error: 'Each answer must have a non-empty answer field for manual submission' });
//     }
//   }

//   try {
//     const submission = await ExamSubmission.create({
//       studentRegNo,
//       examNo,
//       examName,
//       courseId,
//       answers: processedAnswers,
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
// // Fetch all exams (no inputs)
// router.get('/fetch_all_exams', async (req, res) => {
//   try {
//     const submissions = await ExamSubmission.find({});
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching all exams:', error);
//     res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
//   }
// });

// export default router;

import express from 'express';
import ExamSubmission from '../models/examSubmission.js';
import Lecturer from '../models/Lecturer.js';

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
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching all exams:', error);
    res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
  }
});

// NEW: Fetch all submissions for lecturer's assigned courses
router.get('/lecturer/:lecturerId/submissions', async (req, res) => {
  const { lecturerId } = req.params;

  console.log(`Fetching submissions for lecturerId: ${lecturerId}`);

  try {
    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer) {
      return res.status(404).json({ error: 'Lecturer not found' });
    }
  
    console.log(`Lecturer found: ${lecturer._id}, assignedCourses:`, lecturer.assignedCourses);


    const assignedCourseIds = lecturer.assignedCourses.map(course =>
      typeof course === 'string' ? course : course._id.toString()
    );

    console.log('Assigned course IDs:', assignedCourseIds);

    const submissions = await ExamSubmission.find({
      courseId: { $in: assignedCourseIds }
    });

    console.log(`Found ${submissions.length} submissions for lecturer.`);

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions for lecturer:', error);
    res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
  }
});

export default router;
