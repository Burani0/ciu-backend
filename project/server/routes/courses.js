// import mongoose from 'mongoose';

// import Course from '../models/Course.js';
// import express from 'express';

// const router = express.Router();

// router.post('/', async (req, res) => {
//   const course = new Course(req.body);
//   await course.save();
//   res.status(201).json(course);
// });

// router.put('/:id', async (req, res) => {
//   const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(course);
// });

// router.delete('/:id', async (req, res) => {
//   await Course.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Course deleted' });
// });

// export default router;