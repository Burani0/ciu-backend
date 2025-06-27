// import express from 'express';
// import { upload, uploadProfileImage } from '../controllers/lecturerUploadController.js';

// const router = express.Router();

// // Only lecturer upload route, no userType param needed
// router.post('/upload-profile-image/:id', upload.single('profileImage'), uploadProfileImage);

// router.put('/remove-profile-image/:id', removeProfileImage);

// export default router;

import express from 'express';
import { upload, uploadProfileImage, removeProfileImage } from '../controllers/lecturerUploadController.js';

const router = express.Router();

router.post('/upload-profile-image/:id', upload.single('profileImage'), uploadProfileImage);

// ✅ This will now work after importing
router.put('/remove-profile-image/:id', removeProfileImage);

export default router;


