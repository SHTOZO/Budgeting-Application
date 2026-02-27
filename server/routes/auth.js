const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
	'/register',
	[
		body('email').isEmail().withMessage('Please provide a valid email'),
		body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
		body('name').trim().notEmpty().withMessage('Name is required'),
		validateRequest,
	],
	authController.register
);
router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Please provide a valid email'),
		body('password').notEmpty().withMessage('Password is required'),
		validateRequest,
	],
	authController.login
);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
