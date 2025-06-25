// import express from 'express';
// import ExamSubmission from '../models/examSubmission.js';
import ExamLog  from '../models/exam_logs.js'; 
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

// import express from 'express';
// import ExamSubmission from '../models/examSubmission.js';
// import Lecturer from '../models/Lecturer.js';

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

// // NEW: Fetch all submissions for lecturer's assigned courses
// router.get('/lecturer/:lecturerId/submissions', async (req, res) => {
//   const { lecturerId } = req.params;

//   console.log(`Fetching submissions for lecturerId: ${lecturerId}`);

//   try {
//     const lecturer = await Lecturer.findById(lecturerId);
//     if (!lecturer) {
//       return res.status(404).json({ error: 'Lecturer not found' });
//     }
  
//     console.log(`Lecturer found: ${lecturer._id}, assignedCourses:`, lecturer.assignedCourses);


//     const assignedCourseIds = lecturer.assignedCourses.map(course =>
//       typeof course === 'string' ? course : course._id.toString()
//     );

//     console.log('Assigned course IDs:', assignedCourseIds);

//     const submissions = await ExamSubmission.find({
//       courseId: { $in: assignedCourseIds }
//     });

//     console.log(`Found ${submissions.length} submissions for lecturer.`);

//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching submissions for lecturer:', error);
//     res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
//   }
// });

// export default router;


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


 // Validate input
 if (!studentRegNo || !examNo || !examName || !courseId || !answers || !Array.isArray(answers)) {
  return res.status(400).json({ error: 'Missing required fields or invalid answers array' });
}

  // ✅ NEW: Validate the sections and questions structure
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers must be a non-empty array' });
  }
  
  // Check if there is at least one non-empty answer anywhere
  const hasAtLeastOneAnswer = answers.some(section =>
    Array.isArray(section.questions) && section.questions.some(
      question => typeof question.answer === 'string' && question.answer.trim() !== ''
    )
  );
  
  if (!hasAtLeastOneAnswer) {
    return res.status(400).json({ error: 'At least one question must have a non-empty answer to submit' });
  }
  
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers must be a non-empty array' });
  }
  
  for (const section of answers) {
    // section.section is optional, so no need to require it
    if (!Array.isArray(section.questions)) {
      return res.status(400).json({ error: 'Each answer section must have a questions array' });
    }
    for (const question of section.questions) {
      if (!question.questionNumber || typeof question.answer !== 'string') {
        return res.status(400).json({ error: 'Each question must have a questionNumber and a string answer' });
      }
    }
  }
  // Preprocess answers for auto-submit
  let processedAnswers = [...answers];
  // let processedSections = [...sections];

  if (submissionType === 'auto-submit' && answers.length === 0) {
  // if (submissionType !== 'auto-submit' && sections.length === 0) {

    processedAnswers = [{ section: 'default', answer: 'Auto-submitted with no answers' }];
  } else if (submissionType !== 'auto-submit' && answers.length === 0) {
  // } else if (submissionType !== 'auto-submit' && sections.length === 0) {

    return res.status(400).json({ error: 'Answers array cannot be empty for manual submission' });
  }

  // for (const answer of processedAnswers) {
  //   if (answer.answer !== undefined && typeof answer.answer !== 'string') {
  //     return res.status(400).json({ error: 'Each answer must have a valid string answer field' });
  //   }
  //   if (submissionType !== 'auto-submit' && (!answer.answer || answer.answer.trim() === '')) {
  //     return res.status(400).json({ error: 'Each answer must have a non-empty answer field for manual submission' });
  //   }
  // }
  // Check if all answers have valid types (string or undefined)
// for (const answer of processedAnswers) {
//   if (answer.answer !== undefined && typeof answer.answer !== 'string') {
//     return res.status(400).json({ error: 'Each answer must have a valid string answer field' });
//   }
// }

for (const section of processedAnswers) {
  if (!Array.isArray(section.questions)) {
    return res.status(400).json({ error: 'Each section must have a questions array' });
  }
  for (const question of section.questions) {
    if (
      typeof question.questionNumber !== 'string' ||
      typeof question.answer !== 'string'
    ) {
      return res.status(400).json({ error: 'Each question must have a questionNumber and a string answer' });
    }
  }
}

// For manual submissions, check if at least one answer is non-empty
// if (submissionType !== 'auto-submit') {
//   const hasAtLeastOneNonEmptyAnswer = processedAnswers.some(
//     answer => answer.answer && answer.answer.trim() !== ''
//   );

//   if (!hasAtLeastOneNonEmptyAnswer) {
//     return res.status(400).json({ error: 'At least one answer must have a non-empty answer field for manual submission' });
//   }
// }
if (submissionType !== 'auto-submit') {
  const hasAtLeastOneNonEmptyAnswer = processedAnswers.some(section =>
    Array.isArray(section.questions) &&
    section.questions.some(q => typeof q.answer === 'string' && q.answer.trim() !== '')
  );

  if (!hasAtLeastOneNonEmptyAnswer) {
    return res.status(400).json({ error: 'At least one answer must have a non-empty answer field for manual submission' });
  }
}

  console.log('Processed Answers:', processedAnswers);

  // for (const section of processedSections) {
  //   if (!section.sectionNumber || !Array.isArray(section.questions)) {
  //     return res.status(400).json({ error: 'Each section must have a sectionNumber and an array of questions' });
  //   }
  
  //   for (const question of section.questions) {
  //     if (typeof question.answer !== 'string') {
  //       return res.status(400).json({ error: 'Each question answer must be a string' });
  //     }
  
  //     if (submissionType !== 'auto-submit' && (!question.answer || question.answer.trim() === '')) {
  //       return res.status(400).json({ error: 'Each question must have a non-empty answer for manual submission' });
  //     }
  //   }
  // }
  
  try {
    // 🔍 Fetch course to get courseCode
    // const course = await Course.findById(courseId);
    // if (!course) {
    //   return res.status(404).json({ error: 'Course not found' });
    // }

      //     let course;
      // if (mongoose.Types.ObjectId.isValid(courseId)) {
      //   course = await Course.findById(courseId);
      // } else {
      //   course = await Course.findOne({ courseCode: courseId });
      // }

      // if (!course) {
      //   return res.status(404).json({ error: 'Course not found' });
      // }

      // 🔍 Look up course by ID or courseCode
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


    // const submission = await ExamSubmission.create({
    //   studentRegNo,
    //   examNo,
    //   examName,
    //   courseId,
    //   courseCode: course.courseCode, // Store courseCode as string
    //   answers: processedAnswers,
    //   submissionTime: submissionTime || new Date(),
    // });

    console.log('Saving to DB:', {
      studentRegNo,
      examNo,
      examName,
      courseId: course._id,
      courseCode: course.courseCode,
      answers: processedAnswers,
      submissionTime: submissionTime || new Date(),
    });
    
    const submission = await ExamSubmission.create({
      studentRegNo,
      examNo,
      examName,
      courseId: course._id, // ✅ Use actual ObjectId from DB
      courseCode: course.courseCode,
      answers: processedAnswers,
      submissionTime: submissionTime || new Date(),
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


// Fetch all exams
// router.get('/fetch_all_exams', async (req, res) => {
//   try {
//     const submissions = await ExamSubmission.find({});
//     const transformedSubmissions = submissions.map(sub => ({
//       ...sub._doc,
//       answers: sub.answers.flatMap(answer => {
//         if (typeof answer === 'object' && answer.answer) {
//           // Split the answer by newlines and filter out empty lines
//           const splitAnswers = answer.answer.split('\n').filter(a => a.trim());
//           return splitAnswers.length > 1 ? splitAnswers : [answer.answer];
//         }
//         return [answer]; // Return as single item if not an object or no split needed
//       }),
//     }));
//     res.status(200).json(transformedSubmissions);
//   } catch (error) {
//     console.error('Error fetching all exams:', error);
//     res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
//   }
// });

router.get('/fetch_all_exams', async (req, res) => {
  try {
    const submissions = await ExamSubmission.find({});

    const transformedSubmissions = submissions.map(sub => ({
      ...sub._doc,
      answers: sub.answers.flatMap(section =>
        section.questions.map(q => ({
          section: section.section,
          questionNumber: q.questionNumber,
          answer: q.answer
        }))
      ),
      
    }));

    res.status(200).json(transformedSubmissions);
  } catch (error) {
    console.error('Error fetching all exams:', error);
    res.status(500).json({ error: 'Failed to fetch all exams', details: error.message });
  }
});


  

// Fetch submissions for lecturer's assigned courses
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
      $or: [
        { courseCode: { $in: assignedCourseIds } },
        { courseId: { $in: assignedCourseIds } }
      ]
    });

    console.log(`Found ${submissions.length} submissions for lecturer.`);

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions for lecturer:', error);
    res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
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






