const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPasswordGet, resetPasswordPost, profile, logout } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, profile);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:id/:token', resetPasswordGet);
router.post('/reset-password/:id/:token', resetPasswordPost);
router.post('/logout', logout);

module.exports = router;
