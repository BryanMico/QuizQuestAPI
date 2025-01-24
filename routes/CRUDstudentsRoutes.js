// routes/CRUDstudentsRoute.js
const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/CRUDstudent');

// Route to create a student
router.post('/', createStudent);

// Route to get all students
router.get('/', getStudents);

// Route to get a student by ID
router.get('/:id', getStudentById);

// Route to update a student
router.put('/:id', updateStudent);

// Route to delete a student
router.delete('/:id', deleteStudent);

module.exports = router;
