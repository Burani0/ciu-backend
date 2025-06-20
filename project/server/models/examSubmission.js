// import mongoose from 'mongoose';

// const examSubmissionSchema = new mongoose.Schema({
//   studentRegNo: { type: String, required: true },
//   examNo: { type: String, required: true },
//   examName: { type: String, required: true },
//   courseId: { type: String, required: true },
//   answers: [
//     {
//       section: { type: String, required: false }, // Optional for non-sectioned exams
//       answer: { type: String },
//     },
//   ],
//   submissionTime: { type: Date, default: Date.now },
// });

// // Prevent duplicate submissions
// // examSubmissionSchema.index({ examNo: 1, studentRegNo: 1 }, { unique: true });

// export default mongoose.model('ExamSubmission', examSubmissionSchema);

import mongoose from 'mongoose';

const examSubmissionSchema = new mongoose.Schema({
  studentRegNo: { type: String, required: true },
  examNo: { type: String, required: true },
  examName: { type: String, required: true },
  courseId: { type: String, required: true },
  answers: [
    {
      section: { type: String, required: false }, // Optional for non-sectioned exams
      answer: { type: String },
    },
  ],
  submissionTime: { type: Date, default: Date.now },
});

// Prevent duplicate submissions
// examSubmissionSchema.index({ examNo: 1, studentRegNo: 1 }, { unique: true });

export default mongoose.model('ExamSubmission', examSubmissionSchema);