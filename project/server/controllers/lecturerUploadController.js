// import multer from 'multer';
// import path from 'path';
// import Lecturer from '../models/Lecturer.js'; // Make sure this points to your Lecturer model

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/'); // Ensure this folder exists and is public
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueSuffix);
//   },
// });

// export const upload = multer({ storage });

// export const uploadProfileImage = async (req, res) => {
//   try {
//     const lecturerId = req.params.id;

//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const imagePath = req.file.path.replace(/\\/g, '/'); // Normalize slashes
//     const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`; // Full URL for consistent access

//     // Save full URL to MongoDB
//     // await Lecturer.findByIdAndUpdate(lecturerId, { profileImage: imageUrl });
//     await Lecturer.findByIdAndUpdate(lecturerId, { profileImageSrc: imageUrl });


//     res.status(200).json({
//       message: 'Image uploaded successfully',
//       path: imageUrl,
//     });
//   } catch (error) {
//     console.error('Image upload failed:', error);
//     res.status(500).json({ message: 'Failed to upload image' });
//   }
// };

// export const removeProfileImage = async (req, res) => {
//     try {
//       const lecturerId = req.params.id;
  
//       // Update admin's profileImageSrc to empty string (or null)
//       await Lecturer.findByIdAndUpdate(lecturerId, { profileImageSrc: '' });

  
//       res.status(200).json({ message: 'Profile image removed' });
//     } catch (error) {
//       console.error('Failed to remove profile image:', error);
//       res.status(500).json({ message: 'Failed to remove profile image' });
//     }
//   };

import multer from 'multer';
import path from 'path';
import Lecturer from '../models/Lecturer.js'; // Ensure this points to your Lecturer model

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

export const upload = multer({ storage });

export const uploadProfileImage = async (req, res) => {
  try {
    const lecturerId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = path.posix.join('uploads', req.file.filename); // Ensure forward slashes
    const imageUrl = `https://examiner.ciu.ac.ug/${imagePath}`; // Match admin controller's format

    await Lecturer.findByIdAndUpdate(lecturerId, { profileImageSrc: imageUrl });

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const lecturerId = req.params.id;

    // Update lecturer's profileImageSrc to empty string
    await Lecturer.findByIdAndUpdate(lecturerId, { profileImageSrc: '' });

    res.status(200).json({ message: 'Profile image removed' });
  } catch (error) {
    console.error('Failed to remove profile image:', error);
    res.status(500).json({ message: 'Failed to remove profile image' });
  }
};
