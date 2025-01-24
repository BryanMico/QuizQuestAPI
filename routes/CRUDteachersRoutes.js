const express = require('express');
const router = express.Router();
const { createTeacher, getTeachers, updateTeacher, deleteTeacher } = require('../controllers/CRUDteacher');

// Create a new teacher
router.post('/createTeacher', createTeacher);

// Get all teachers
router.get('/teachers', getTeachers); // Fetch only teachers

// Update a teacher
router.put('/updateTeacher/:id', updateTeacher);

// Delete a teacher
router.delete('/deleteTeacher/:id', deleteTeacher);

module.exports = router;
