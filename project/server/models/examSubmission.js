

import mongoose from 'mongoose';

const examSubmissionSchema = new mongoose.Schema({
  studentRegNo: { type: String, required: true },
  examNo: { type: String, required: true },
  examName: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseCode: { type: String, required: true },
  
  answers: [
    {
      section: { type: String, required: false }, // Optional for exams without sections
      questions: [
        {
          questionNumber: { type: String, required: true },
          answer: { type: String, required: true },
          // You can add "score" here later if needed, e.g. score: { type: Number, default: 0 }
        }
      ],
    },
  ],

  submissionTime: { type: Date, default: Date.now },
});

// Unique index to prevent duplicates
// examSubmissionSchema.index({ examNo: 1, studentRegNo: 1, courseId: 1 }, { unique: true });

export default mongoose.model('ExamSubmission', examSubmissionSchema);