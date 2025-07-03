import multer from 'multer';
import path from 'path';
import Admin from '../models/Admin.js'; // Adjust path if needed

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
      const adminId = req.params.id;
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const imagePath = path.posix.join('uploads', req.file.filename);
      const imageUrl = `http://localhost:3001/${imagePath}`;
  
      await Admin.findByIdAndUpdate(adminId, { profileImageSrc: imageUrl });
  
      res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
      console.error('Image upload failed:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  };
  


export const removeProfileImage = async (req, res) => {
    try {
      const adminId = req.params.id;
  
      // Update admin's profileImageSrc to empty string (or null)
      await Admin.findByIdAndUpdate(adminId, { profileImageSrc: '' });
  
      res.status(200).json({ message: 'Profile image removed' });
    } catch (error) {
      console.error('Failed to remove profile image:', error);
      res.status(500).json({ message: 'Failed to remove profile image' });
    }
  };
  