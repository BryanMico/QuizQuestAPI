require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/CRUDteachersRoutes'); // Import teacher routes
const studentsRoutes = require('./routes/CRUDstudentsRoutes'); // Import student routes
const subjectRoutes = require('./routes/CRUDsubjectsRoutes'); // Import subject routes

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api', teacherRoutes); // Teacher routes
app.use('/api/students', studentsRoutes); // Student routes
app.use('/api/subjects', subjectRoutes); // Subject routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
