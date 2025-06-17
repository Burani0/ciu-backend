import mongoose from 'mongoose';

const examSubmissionSchema = new mongoose.Schema({
  studentRegNo: { type: String, required: true },
  examNo: { type: String, required: true },
  examName: { type: String, required: true },
  courseId: { type: String, required: true },
  answers: [
    {
      section: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  submissionTime: { type: Date, default: Date.now },
  proctoringStatus: { type: Object, required: true },
  violations: { type: Array, default: [] },
  __v: { type: Number, select: false },
});

export default mongoose.model('ExamSubmission', examSubmissionSchema);
