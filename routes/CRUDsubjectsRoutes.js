const express = require('express');
const {
  createSubject,
  getSubjectsForTeacher,
  getSubjectsForStudent,
  updateSubject,
  deleteSubject,
} = require('../controllers/CRUDsubject');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a new subject (only accessible by teachers)
router.post('/', authMiddleware, createSubject);

// Route to get all subjects for a teacher (only accessible by teachers)
router.get('/teacher', authMiddleware, getSubjectsForTeacher);

// Route to get all subjects for a student (only accessible by students)
router.get('/student', authMiddleware, getSubjectsForStudent);

// Route to update a subject (only accessible by the teacher of the subject)
router.put('/:subjectId', authMiddleware, updateSubject);

// Route to delete a subject (only accessible by the teacher of the subject)
router.delete('/:subjectId', authMiddleware, deleteSubject);

module.exports = router;
