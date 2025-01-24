const User = require('../models/User');

// Create a new teacher
const createTeacher = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== 'teacher') {
    return res.status(400).json({ message: 'Role must be "teacher"' });
  }

  try {
    const user = new User({ name, email, password, role });

    await user.save();
    res.status(201).json({ message: 'Teacher created successfully', user });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }); // Only fetch teachers
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a teacher
const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (role && role !== 'teacher') {
    return res.status(400).json({ message: 'Role must be "teacher"' });
  }

  try {
    const updatedTeacher = await User.findByIdAndUpdate(id, { name, email, password, role }, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTeacher = await User.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
};
