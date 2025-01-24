const Subject = require('../models/Subject');
const User = require('../models/User');

// Create a new subject
const createSubject = async (req, res) => {
  try {
    // Log the authenticated user from JWT
    console.log('Authenticated User:', req.user);

    const { title, description, students } = req.body;

    // Ensure that the user creating the subject is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create subjects' });
    }

    // Verify that all students are valid
    const validStudents = await User.find({ '_id': { $in: students }, role: 'student' });
    if (validStudents.length !== students.length) {
      return res.status(400).json({ message: 'Some students do not exist or are not students' });
    }

    // Create the subject
    const newSubject = new Subject({
      title,
      description,
      teacher: req.user._id,
      students,
    });

    await newSubject.save();
    res.status(201).json({ message: 'Subject created successfully', subject: newSubject });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all subjects for a specific teacher
const getSubjectsForTeacher = async (req, res) => {
  try {
    // Log the authenticated user for debugging
    console.log('Authenticated User:', req.user);

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can view their subjects' });
    }

    const subjects = await Subject.find({ teacher: req.user._id })
      .populate('students', 'name email') // populate students info
      .populate('teacher', 'name email'); // populate teacher info

    if (subjects.length === 0) {
      return res.status(404).json({ message: 'No subjects found' });
    }

    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects for teacher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all subjects for a specific student
const getSubjectsForStudent = async (req, res) => {
  try {
    // Log the authenticated user for debugging
    console.log('Authenticated User:', req.user);

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can view their subjects' });
    }

    const subjects = await Subject.find({ students: req.user._id })
      .populate('students', 'name email')
      .populate('teacher', 'name email');

    if (subjects.length === 0) {
      return res.status(404).json({ message: 'No subjects found for this student' });
    }

    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects for student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update subject details
const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, description, students } = req.body;

    // Log the authenticated user for debugging
    console.log('Authenticated User:', req.user);

    // Ensure that the current user is the teacher for this subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (subject.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this subject' });
    }

    // Update the subject's details
    subject.title = title || subject.title;
    subject.description = description || subject.description;
    subject.students = students || subject.students;

    await subject.save();
    res.status(200).json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Log the authenticated user for debugging
    console.log('Authenticated User:', req.user);

    // Ensure that the current user is the teacher for this subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (subject.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this subject' });
    }

    await subject.remove();
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createSubject,
  getSubjectsForTeacher,
  getSubjectsForStudent,
  updateSubject,
  deleteSubject,
};
