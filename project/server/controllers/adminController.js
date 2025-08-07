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
    console.log(JSON.stringify(lecturer, null, 2));
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

// GET course by courseCode
export const getCourseByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const course = await Course.findOne({ courseCode: code });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course by code:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateLecturer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, universityNumber, assignedCourses } = req.body;

    const lecturer = await Lecturer.findById(id.trim());
    if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });

    const oldUniversityNumber = lecturer.universityNumber;

    // Update fields
    lecturer.firstName = firstName;
    lecturer.lastName = lastName;
    lecturer.email = email;
    lecturer.universityNumber = universityNumber;
    lecturer.assignedCourses = assignedCourses;

    const updated = await lecturer.save();

    if (oldUniversityNumber !== universityNumber) {
      await sendEmail(
        email,
        'University Number Updated',
        `Hello ${firstName},\n\nYour university number has been changed from "${oldUniversityNumber}" to "${universityNumber}".`
      );
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// UPDATE admin
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, username, email } = req.body;

    const admin = await Admin.findById(id.trim());
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const oldUsername = admin.username;

    // Update fields
    admin.first_name = first_name;
    admin.last_name = last_name;
    admin.username = username;
    admin.email = email;

    const updated = await admin.save();

    if (oldUsername !== username) {
      await sendEmail(
        email,
        'Username Updated',
        `Hello ${first_name},\n\nYour username has been changed from "${oldUsername}" to "${username}".`
      );
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};




// DELETE course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const deleted = await Course.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Course not found' });

  res.status(200).json({ message: 'Course deleted successfully' });
};


//csv course

// export const bulkCreateCourses = async (req, res) => {
//   try {
//     const { courses } = req.body;

//     if (!Array.isArray(courses)) {
//       return res.status(400).json({ message: 'Invalid input format' });
//     }

//     const createdCourses = await Course.insertMany(courses, { ordered: false }); // Ignore duplicates
//     res.status(201).json(createdCourses);
//   } catch (err) {
//     console.error('Bulk insert error:', err);
//     res.status(500).json({ message: 'Failed to create courses' });
//   }
// };

export const bulkCreateCourses = async (req, res) => {
  try {
    const { courses } = req.body;

    if (!Array.isArray(courses)) {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    // Get all existing courseCodes from DB
    const existingCodes = await Course.find({
      courseCode: { $in: courses.map(c => c.courseCode) }
    }).distinct('courseCode');

    // Filter out duplicates before inserting
    const newCourses = courses.filter(c => !existingCodes.includes(c.courseCode));

    if (newCourses.length === 0) {
      return res.status(200).json({ message: "No new courses to insert." });
    }

    const inserted = await Course.insertMany(newCourses);
    res.status(201).json({
      message: `${inserted.length} new courses added successfully.`,
      inserted
    });
  } catch (err) {
    console.error('Bulk insert error:', err);
    res.status(500).json({ message: 'Failed to create courses', error: err.message });
  }
};


//uploaded leactuers 

// export const bulkCreateLecturers = async (req, res) => {
//   try {
//     const { lecturers } = req.body;

//     if (!Array.isArray(lecturers)) {
//       return res.status(400).json({ message: "Invalid lecturers data." });
//     }

//     const formattedLecturers = [];

//     for (const lect of lecturers) {
//       const courseCodes = Array.isArray(lect.assignedCourses)
//         ? lect.assignedCourses
//         : lect.assignedCourses?.split(',').map((code) => code.trim()).filter(Boolean) || [];

//       // ✅ Look up courses by code
//       const foundCourses = await Course.find({ courseCode: { $in: courseCodes } });

//       // ✅ Extract valid course IDs
//       const assignedCourseIds = foundCourses.map(course => course._id);

//       formattedLecturers.push({
//         firstName: lect.firstName?.trim(),
//         lastName: lect.lastName?.trim(),
//         email: lect.email?.trim().toLowerCase(),
//         universityNumber: lect.universityNumber?.trim(),
//         password: lect.password, // Hashing should happen later
//         assignedCourses: assignedCourseIds,
//       });
//     }

//     await Lecturer.insertMany(formattedLecturers);
//     res.status(201).json({ message: "Lecturers uploaded successfully." });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to upload lecturers.", error: err.message });
//   }
// };

// export const bulkCreateLecturers = async (req, res) => {
//   try {
//     const { lecturers } = req.body;

//     if (!Array.isArray(lecturers)) {
//       return res.status(400).json({ message: "Invalid lecturers data." });
//     }

//     const emails = lecturers.map(l => l.email?.trim().toLowerCase());
//     const universityNumbers = lecturers.map(l => l.universityNumber?.trim());

//     // 🧠 Find existing lecturers by email or university number
//     const existingLecturers = await Lecturer.find({
//       $or: [
//         { email: { $in: emails } },
//         { universityNumber: { $in: universityNumbers } }
//       ]
//     });

//     // Extract existing emails and university numbers
//     const existingEmails = new Set(existingLecturers.map(l => l.email));
//     const existingUNumbers = new Set(existingLecturers.map(l => l.universityNumber));

//     // ❌ Filter out duplicates
//     const uniqueLecturers = lecturers.filter(l =>
//       !existingEmails.has(l.email?.trim().toLowerCase()) &&
//       !existingUNumbers.has(l.universityNumber?.trim())
//     );

//     // 🔄 Resolve course codes into course IDs
//     const formattedLecturers = [];
//     for (const lect of uniqueLecturers) {
//       const courseCodes = Array.isArray(lect.assignedCourses)
//         ? lect.assignedCourses
//         : lect.assignedCourses?.split(',').map((code) => code.trim()).filter(Boolean) || [];

//       const foundCourses = await Course.find({ courseCode: { $in: courseCodes } });
//       const assignedCourseIds = foundCourses.map(course => course._id);

//       formattedLecturers.push({
//         firstName: lect.firstName?.trim(),
//         lastName: lect.lastName?.trim(),
//         email: lect.email?.trim().toLowerCase(),
//         universityNumber: lect.universityNumber?.trim(),
//         password: lect.password,
//         assignedCourses: assignedCourseIds,
//       });
//     }

//     if (formattedLecturers.length === 0) {
//       return res.status(200).json({ message: "No new lecturers to insert." });
//     }

//     const inserted = await Lecturer.insertMany(formattedLecturers);

//     res.status(201).json({
//       message: `${inserted.length} new lecturers added successfully.`,
//       inserted
//     });

//   } catch (err) {
//     console.error("Bulk insert error:", err);
//     res.status(500).json({ message: "Failed to upload lecturers.", error: err.message });
//   }
// };

export const bulkCreateLecturers = async (req, res) => {
  try {
    const { lecturers } = req.body;

    if (!Array.isArray(lecturers)) {
      return res.status(400).json({ message: 'Invalid lecturers data.' });
    }

    // Extract emails and university numbers to check duplicates
    const emails = lecturers.map(l => l.email?.trim().toLowerCase());
    const universityNumbers = lecturers.map(l => l.universityNumber?.trim());

    const existingLecturers = await Lecturer.find({
      $or: [
        { email: { $in: emails } },
        { universityNumber: { $in: universityNumbers } },
      ],
    });

    const existingEmails = new Set(existingLecturers.map(l => l.email));
    const existingUNumbers = new Set(existingLecturers.map(l => l.universityNumber));

    const uniqueLecturers = lecturers.filter(
      l =>
        !existingEmails.has(l.email?.trim().toLowerCase()) &&
        !existingUNumbers.has(l.universityNumber?.trim())
    );

    if (uniqueLecturers.length === 0) {
      return res.status(200).json({ message: 'No new lecturers to insert.' });
    }

    const formattedLecturers = [];

    for (const lect of uniqueLecturers) {
      const courseCodes = Array.isArray(lect.assignedCourses)
        ? lect.assignedCourses
        : lect.assignedCourses?.split(',').map(code => code.trim()).filter(Boolean) || [];

      const foundCourses = await Course.find({ courseCode: { $in: courseCodes } });
      const assignedCourseIds = foundCourses.map(course => course._id);

      const hashedPassword = await bcrypt.hash(lect.password, 10);

      formattedLecturers.push({
        firstName: lect.firstName?.trim(),
        lastName: lect.lastName?.trim(),
        email: lect.email?.trim().toLowerCase(),
        universityNumber: lect.universityNumber?.trim(),
        password: hashedPassword,
        assignedCourses: assignedCourseIds,
        rawPassword: lect.password, // keep raw password to email later
      });
    }

    const insertedLecturers = await Lecturer.insertMany(
      formattedLecturers.map(({ rawPassword, ...lecturer }) => lecturer)
    );

    // Send emails after insertion
    for (let i = 0; i < insertedLecturers.length; i++) {
      const lect = insertedLecturers[i];
      const rawPass = formattedLecturers[i].rawPassword;

      // Send email (handle errors per email)
      sendEmail(
        lect.email,
        'Account Created',
        `Hello ${lect.firstName},

Your lecturer account has been created.

University Number: ${lect.universityNumber}
Password: ${rawPass}

Please log in and change your password immediately.

Best regards,
CIU Admin`
      ).catch(err => console.error(`Failed to send email to ${lect.email}:`, err));
    }

    res.status(201).json({
      message: `${insertedLecturers.length} new lecturers added and emailed successfully.`,
      insertedLecturers,
    });

  } catch (err) {
    console.error('Bulk create lecturers error:', err);
    res.status(500).json({ message: 'Failed to upload lecturers.', error: err.message });
  }
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
        .text(`Logout Time: ${log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'N/A'}`)

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
    return res.status(400).json({ message: 'Username and token are required' });
  }

  try {
    // Find the admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the token exists for this admin
    const tokenDoc = await AdminToken.findOne({ adminId: admin._id, token });
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Token is valid, optionally you might want to delete the token after verification
    await AdminToken.deleteOne({ _id: tokenDoc._id });

    // Respond with success and admin info
    res.status(200).json({
      message: 'Token verified',
      adminId: admin._id,
      username: admin.username,
      email: admin.email,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


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

//getSubmissionById
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

export const adminLogout = async (req, res) => {
  const { adminId } = req.body;

  try {
    await AdminToken.deleteMany({ adminId });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};
