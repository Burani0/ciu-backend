import mongoose from 'mongoose';

const logEntrySchema = new mongoose.Schema({
  eventType: { type: String, required: true, enum: ['submission', 'security_violation', 'answer_update', 'timer_update'] },
  details: {
    violationType: { type: String }, // For security_violation events
    remainingTime: { type: String }, // For timer_update events
    timestamp: { type: Date, default: Date.now },
  },
  timestamp: { type: Date, default: Date.now },
});


const examNotificationSchema = new mongoose.Schema({
  studentRegNo: { type: String, required: true },
  examNo: { type: String, required: true },
  courseId: { type: String, required: true },
  submissionTime: { type: Date, required: true, default: Date.now },
  logEntries: [logEntrySchema], // Array of log entries
});

export default mongoose.model('ExamNotification', examNotificationSchema);


