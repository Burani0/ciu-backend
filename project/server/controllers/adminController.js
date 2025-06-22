// import Course from '../models/Course.js';
// import Lecturer from '../models/Lecturer.js';
// import Admin from '../models/Admin.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { sendEmail } from '../utils/mailer.js';
// import LecturerLoginLog from '../models/LecturerLoginLog.js';
// import PDFDocument from 'pdfkit';
// import AdminToken from '../models/AdminToken.js';
// import ExamSubmission from '../models/examSubmission.js';



// export const createCourse = async (req, res) => {

//   console.log("Received course data:", req.body);
//   const { faculty, program, courseTitle, courseCode } = req.body;
//   const course = new Course({ faculty, program, courseTitle, courseCode });
//   await course.save();
//   res.status(201).json(course);
// };

// export const registerLecturer = async (req, res) => {
//   const { firstName, lastName, email, universityNumber, password, courseIds } = req.body;
//   console.log('Received courseIds:', courseIds);

//   // Validate course IDs
//   const validCourses = await Course.find({ _id: { $in: courseIds } });
//   console.log('Valid courses found:', validCourses.map(c => c._id));

//   if (validCourses.length !== courseIds.length) {

//   return res.status(400).json({ message: 'One or more course IDs are invalid' });
// }


//   const hashedPassword = await bcrypt.hash(password, 10);

//   const lecturer = new Lecturer({
//     firstName,
//     lastName,
//     email,
//     universityNumber,
//     password: hashedPassword,
//     assignedCourses: courseIds,
//   });

//   await lecturer.save();

//   await sendEmail(
//     email,
//     'Account Created',
//     `University Number: ${universityNumber}\nPassword: ${password}`
//   );

//   res.status(201).json({ message: 'Lecturer registered and assigned to courses' });
// };

// export const lecturerLogin = async (req, res) => {
//   const { universityNumber, password } = req.body;

//   const lecturer = await Lecturer.findOne({ universityNumber });
//   if (!lecturer) return res.status(400).json({ message: 'Lecturer not found' });

//   const isMatch = await bcrypt.compare(password, lecturer.password);
//   if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

//   const token = jwt.sign({ id: lecturer._id }, 'secretKey', { expiresIn: '1h' });

//   await sendEmail(lecturer.email, 'Login Token', `Your login token: ${token}`);

//   res.status(200).json({ message: 'Login successful. Token sent to email.' });
// };

// export const getDashboardStats = async (req, res) => {
//   const totalCourses = await Course.countDocuments();
//   const totalLecturers = await Lecturer.countDocuments();
//   res.json({ totalCourses, totalLecturers });
// };

// export const getAllCourses = async (req, res) => {
//   const courses = await Course.find();
//   res.status(200).json(courses);
// };

 

// // GET all lecturers
// export const getAllLecturers = async (req, res) => {
//   const lecturers = await Lecturer.find().populate('assignedCourses');
//   res.status(200).json(lecturers);
// };

// // get lecturer by IDs
// export const getLecturerById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const lecturer = await Lecturer.findById(id).populate('assignedCourses'); // if using mongoose
//     if (!lecturer) {
//       return res.status(404).json({ message: 'Lecturer not found' });
//     }
//     res.status(200).json(lecturer);
//   } catch (error) {
//     console.error('Error fetching lecturer by ID:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET all admins
// export const getAllAdmins = async (req, res) => {
//   const admins = await Admin.find();
//   res.status(200).json(admins);
// };

// //get admin by id
// export const getAdminById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Check if the ID is a valid MongoDB ObjectId
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: 'Invalid admin ID format' });
//     }

//     const admin = await Admin.findById(id).select('-password'); // Exclude password from response

//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     res.status(200).json(admin);
//   } catch (error) {
//     console.error('Error fetching admin by ID:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // UPDATE course
// export const updateCourse = async (req, res) => {
//   const { id } = req.params;
//   const { courseTitle, courseCode } = req.body;

//   const updated = await Course.findByIdAndUpdate(id, { courseTitle, courseCode }, { new: true });
//   if (!updated) return res.status(404).json({ message: 'Course not found' });

//   res.status(200).json(updated);
// };

// // get courses by ID

// export const getCourseById = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.json(course);
//   } catch (error) {
//     console.error('Error fetching course by ID:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// // UPDATE lecturer
// export const updateLecturer = async (req, res) => {
//   const { id } = req.params;
//   const { firstName, lastName, email, universityNumber, courseIds } = req.body;

//   const updated = await Lecturer.findByIdAndUpdate(
//     id,
//     { firstName, lastName, email, universityNumber, assignedCourses: courseIds },
//     { new: true }
//   );
//   if (!updated) return res.status(404).json({ message: 'Lecturer not found' });

//   res.status(200).json(updated);
// };

// // UPDATE admin
// export const updateAdmin = async (req, res) => {
//   const { id } = req.params;
//   const { username, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const updated = await Admin.findByIdAndUpdate(id, { username, password: hashedPassword }, { new: true });
//   if (!updated) return res.status(404).json({ message: 'Admin not found' });

//   res.status(200).json(updated);
// };

// // DELETE course
// export const deleteCourse = async (req, res) => {
//   const { id } = req.params;
//   const deleted = await Course.findByIdAndDelete(id);
//   if (!deleted) return res.status(404).json({ message: 'Course not found' });

//   res.status(200).json({ message: 'Course deleted successfully' });
// };

// // DELETE lecturer
// export const deleteLecturer = async (req, res) => {
//   const { id } = req.params;
//   const deleted = await Lecturer.findByIdAndDelete(id);
//   if (!deleted) return res.status(404).json({ message: 'Lecturer not found' });

//   res.status(200).json({ message: 'Lecturer deleted successfully' });
// };

// // DELETE admin
// export const deleteAdmin = async (req, res) => {
//   const { id } = req.params;
//   const deleted = await Admin.findByIdAndDelete(id);
//   if (!deleted) return res.status(404).json({ message: 'Admin not found' });

//   res.status(200).json({ message: 'Admin deleted successfully' });
// };

// export const getLecturerLoginLogs = async (req, res) => {
//   const { universityNumber, startDate, endDate, download, format } = req.query;

//   const filter = {};
//   if (universityNumber) filter.universityNumber = universityNumber;
//   if (startDate || endDate) {
//     filter.loginTime = {};
//     if (startDate) filter.loginTime.$gte = new Date(startDate);
//     if (endDate) filter.loginTime.$lte = new Date(endDate);
//   }

//   const logs = await LecturerLoginLog.find(filter).sort({ loginTime: -1 });

//   // 📄 Generate PDF
//   if (download === 'true' && format === 'pdf') {
//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=login_logs.pdf');
//     doc.pipe(res);

//     doc.fontSize(18).text('Lecturer Login Logs', { align: 'center' });
//     doc.moveDown();

//     logs.forEach(log => {
//       doc
//         .fontSize(12)
//         .text(`University Number: ${log.universityNumber}`)
//         .text(`Login Time: ${new Date(log.loginTime).toLocaleString()}`)
//         .moveDown();
//     });

//     doc.end();
//     return;
//   }

 

//   res.status(200).json(logs);
// };

// export const createAdmin = async (req, res) => {
//   const { first_name, last_name,  username, email, password } = req.body;

//   if ( !first_name|| !last_name|| !username || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   const existing = await Admin.findOne({ $or: [{ username }, { email }] });
//   if (existing) {
//     return res.status(400).json({ message: 'Username or email already exists' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const admin = new Admin({ first_name, last_name, username, email, password: hashedPassword });

//   await admin.save();

//   await sendEmail(
//     email,
//     'Admin Account Created',
//     `Username: ${username}\nPassword: ${password}`
//   );

//   res.status(201).json({ message: 'Admin created and credentials sent via email' });
// };

// export const adminLogin = async (req, res) => {
//   const { username, password } = req.body;

//   const admin = await Admin.findOne({ username });
//   if (!admin || !(await bcrypt.compare(password, admin.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   const token = Math.floor(100000 + Math.random() * 900000).toString();
//   const tokenDoc = new AdminToken({ adminId: admin._id, token });

//   try {
//     await tokenDoc.save();
//     await sendEmail(admin.email, 'Login Verification Code', `Your code: ${token}`);
//     res.json({ message: 'Token sent to email' });
//   } catch (error) {
//     console.error('Email or token error:', error);
//     res.status(500).json({ message: 'Failed to send token email' });
//   }
// };


// export const clearToken = async (req, res) => {
//   const { username, token } = req.body;

//   if (!username || !token) {
//     return res.status(400).json({ message: 'username  and token are required' });
//   }

//   // Find the lecturer using the university number
//   const admin = await Admin.findOne({ username });
//   if (!admin) {
//     return res.status(404).json({ message: 'admin not found' });
//   }

//   // Check if the token matches the one stored for that lecturer
//   const tokenDoc = await AdminToken.findOne({ adminId: admin._id, token });
//   if (!tokenDoc) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }

//   // Token is valid
//   res.status(200).json({ message: 'Token verified', adminId: admin._id });
// }

// export const getLecturerSubmissions = async (req, res) => {
//   const { lecturerId } = req.params;

//   try {
//     const lecturer = await Lecturer.findById(lecturerId);
//     if (!lecturer) {
//       return res.status(404).json({ message: 'Lecturer not found' });
//     }

//     // Extract courseIds from assignedCourses array
//     const assignedCourseIds = lecturer.assignedCourses.map((courseId) =>
//       courseId.toString()
//     );

//     // Fetch submissions for those courses
//     const submissions = await ExamSubmission.find({
//       courseId: { $in: assignedCourseIds }
//     });

//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching submissions for lecturer:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


import Course from '../models/Course.js';
import Lecturer from '../models/Lecturer.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/mailer.js';
import LecturerLoginLog from '../models/LecturerLoginLog.js';
import PDFDocument from 'pdfkit';
import AdminToken from '../models/AdminToken.js';
import ExamSubmission from '../models/examSubmission.js';




export const createCourse = async (req, res) => {

  console.log("Received course data:", req.body);
  const { faculty, program, courseTitle, courseCode } = req.body;
  const course = new Course({ faculty, program, courseTitle, courseCode });
  await course.save();
  res.status(201).json(course);
};

export const registerLecturer = async (req, res) => {
  const { firstName, lastName, email, universityNumber, password, courseIds } = req.body;

  // Validate course IDs
  const validCourses = await Course.find({ _id: { $in: courseIds } });
  if (validCourses.length !== courseIds.length) {
    return res.status(400).json({ message: 'One or more course IDs are invalid' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const lecturer = new Lecturer({
    firstName,
    lastName,
    email,
    universityNumber,
    password: hashedPassword,
    assignedCourses: courseIds,
  });

  await lecturer.save();

  await sendEmail(
    email,
    'Account Created',
    `University Number: ${universityNumber}\nPassword: ${password}`
  );

  res.status(201).json({ message: 'Lecturer registered and assigned to courses' });
};

export const lecturerLogin = async (req, res) => {
  const { universityNumber, password } = req.body;

  const lecturer = await Lecturer.findOne({ universityNumber });
  if (!lecturer) return res.status(400).json({ message: 'Lecturer not found' });

  const isMatch = await bcrypt.compare(password, lecturer.password);
  if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

  const token = jwt.sign({ id: lecturer._id }, 'secretKey', { expiresIn: '1h' });

  await sendEmail(lecturer.email, 'Login Token', `Your login token: ${token}`);

  res.status(200).json({ message: 'Login successful. Token sent to email.' });
};

export const getDashboardStats = async (req, res) => {
  const totalCourses = await Course.countDocuments();
  const totalLecturers = await Lecturer.countDocuments();
  res.json({ totalCourses, totalLecturers });
};

export const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.status(200).json(courses);
};

 

// GET all lecturers
export const getAllLecturers = async (req, res) => {
  const lecturers = await Lecturer.find().populate('assignedCourses');
  res.status(200).json(lecturers);
};

// get lecturer by IDs
export const getLecturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturer = await Lecturer.findById(id).populate('assignedCourses'); // if using mongoose
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }
    res.status(200).json(lecturer);
  } catch (error) {
    console.error('Error fetching lecturer by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all admins
export const getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json(admins);
};

//get admin by id
export const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid admin ID format' });
    }

    const admin = await Admin.findById(id).select('-password'); // Exclude password from response

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { courseTitle, courseCode } = req.body;

  const updated = await Course.findByIdAndUpdate(id, { courseTitle, courseCode }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Course not found' });

  res.status(200).json(updated);
};

// get courses by ID

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// UPDATE lecturer
export const updateLecturer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, universityNumber, courseIds } = req.body;

  const updated = await Lecturer.findByIdAndUpdate(
    id,
    { firstName, lastName, email, universityNumber, assignedCourses: courseIds },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Lecturer not found' });

  res.status(200).json(updated);
};

// UPDATE admin
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const updated = await Admin.findByIdAndUpdate(id, { username, password: hashedPassword }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Admin not found' });

  res.status(200).json(updated);
};

// DELETE course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const deleted = await Course.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Course not found' });

  res.status(200).json({ message: 'Course deleted successfully' });
};

// DELETE lecturer
export const deleteLecturer = async (req, res) => {
  const { id } = req.params;
  const deleted = await Lecturer.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Lecturer not found' });

  res.status(200).json({ message: 'Lecturer deleted successfully' });
};

// DELETE admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const deleted = await Admin.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Admin not found' });

  res.status(200).json({ message: 'Admin deleted successfully' });
};

export const getLecturerLoginLogs = async (req, res) => {
  const { universityNumber, startDate, endDate, download, format } = req.query;

  const filter = {};
  if (universityNumber) filter.universityNumber = universityNumber;
  if (startDate || endDate) {
    filter.loginTime = {};
    if (startDate) filter.loginTime.$gte = new Date(startDate);
    if (endDate) filter.loginTime.$lte = new Date(endDate);
  }

  const logs = await LecturerLoginLog.find(filter).sort({ loginTime: -1 });

  // 📄 Generate PDF
  if (download === 'true' && format === 'pdf') {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=login_logs.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Lecturer Login Logs', { align: 'center' });
    doc.moveDown();

    logs.forEach(log => {
      doc
        .fontSize(12)
        .text(`University Number: ${log.universityNumber}`)
        .text(`Login Time: ${new Date(log.loginTime).toLocaleString()}`)
        .moveDown();
    });

    doc.end();
    return;
  }

 

  res.status(200).json(logs);
};

export const createAdmin = async (req, res) => {
  const { first_name, last_name,  username, email, password } = req.body;

  if ( !first_name|| !last_name|| !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existing = await Admin.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ first_name, last_name, username, email, password: hashedPassword });

  await admin.save();

  await sendEmail(
    email,
    'Admin Account Created',
    `Username: ${username}\nPassword: ${password}`
  );

  res.status(201).json({ message: 'Admin created and credentials sent via email' });
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenDoc = new AdminToken({ adminId: admin._id, token });

  try {
    await tokenDoc.save();
    await sendEmail(admin.email, 'Login Verification Code', `Your code: ${token}`);
    res.json({ message: 'Token sent to email' });
  } catch (error) {
    console.error('Email or token error:', error);
    res.status(500).json({ message: 'Failed to send token email' });
  }
};

export const clearToken = async (req, res) => {
    const { username, token } = req.body;
  
    if (!username || !token) {
      return res.status(400).json({ message: 'username  and token are required' });
    }
  
    // Find the lecturer using the university number
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'admin not found' });
    }
  
    // Check if the token matches the one stored for that lecturer
    const tokenDoc = await AdminToken.findOne({ adminId: admin._id, token });
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  
    // Token is valid
    res.status(200).json({ message: 'Token verified', adminId: admin._id });
  }


// export const getLecturerSubmissions = async (req, res) => {
//   console.log('GET /lecturer/:lecturerId/submissions called with', req.params);
//   const { lecturerId } = req.params;

//   try {
//     const lecturer = await Lecturer.findById(lecturerId);
//     if (!lecturer) {
//       return res.status(404).json({ message: 'Lecturer not found' });
//     }

//     // assignedCourses might include either ObjectId strings or course codes
//     const assignedCourses = lecturer.assignedCourses;

//     const submissions = await ExamSubmission.find({
//       $or: [
//         { courseId: { $in: assignedCourses } },     // match if stored as string
//         { courseId: { $in: assignedCourses.map(id => mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null).filter(Boolean) } },
//         { courseCode: { $in: assignedCourses } },   // match by courseCode too
//       ],
//     });

//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error('Error fetching submissions for lecturer:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
//   // getSubmissionById
//   export const getSubmissionById = async (req, res) => {
//     const { id } = req.params;
  
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid submission ID' });
//     }
  
//     try {
//       const submission = await ExamSubmission.findById(id);
  
//       if (!submission) {
//         return res.status(404).json({ message: 'Submission not found' });
//       }
  
//       res.status(200).json(submission);
//     } catch (error) {
//       console.error('Error fetching submission:', error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };
  
  
// };


export const getLecturerSubmissions = async (req, res) => {
  console.log('GET /lecturer/:lecturerId/submissions called with', req.params);
  const { lecturerId } = req.params;

  try {
    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    const assignedCourses = lecturer.assignedCourses;

    const submissions = await ExamSubmission.find({
      $or: [
        { courseId: { $in: assignedCourses } },
        {
          courseId: {
            $in: assignedCourses
              .map(id => mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null)
              .filter(Boolean)
          }
        },
        { courseCode: { $in: assignedCourses } }
      ],
    }).populate('courseId', 'courseCode');

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions for lecturer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ This MUST be outside of any other function
export const getSubmissionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid submission ID' });
  }

  try {
    const submission = await ExamSubmission.findById(id).populate('courseId', 'courseCode');
    
    console.log('Fetched submission:', submission);


    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
