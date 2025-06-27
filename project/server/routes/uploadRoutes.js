// import express from 'express';
// import { upload, uploadProfileImage } from '../controllers/uploadController.js';

// const router = express.Router();

// router.post('/upload-profile-image/:id', upload.single('profileImage'), uploadProfileImage);

// export default router;

import express from 'express';
import { upload, uploadProfileImage, removeProfileImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/upload-profile-image/:id', upload.single('profileImage'), uploadProfileImage);

// ✅ Add this route:
router.put('/remove-profile-image/:id', removeProfileImage);

export default router;
