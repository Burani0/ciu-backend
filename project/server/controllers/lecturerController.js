import Lecturer from '../models/Lecturer.js';

export const getLecturerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturer = await Lecturer.findById(id).populate('assignedCourses');

    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    res.status(200).json(lecturer);
  } catch (error) {
    console.error('Error fetching lecturer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
