const express = require('express');
const {adminLogin, login, validateToken } = require('../controllers/authController');
const router = express.Router();



router.post('/adminLogin', adminLogin);
router.post('/login', login);
router.get('/validate', validateToken);

module.exports = router;
