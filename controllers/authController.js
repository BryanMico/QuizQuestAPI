const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(403).json({ message: 'Invalid credentials or not an admin' });
    }

    // Compare the password (bcrypt handles the hash comparison)
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error in adminLogin:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  // Check if the role is valid ('teacher' or 'student')
  if (!role || (role !== 'teacher' && role !== 'student')) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    // Find the user based on email and role (either teacher or student)
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(403).json({ message: 'Invalid credentials or user not found' });
    }

    // Compare the password (bcrypt handles the hash comparison)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Debugging the token
    console.log('Generated JWT Token:', token);

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




// Token validation (Not needed for this simplified version)
exports.validateToken = async (req, res) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
