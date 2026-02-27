const express = require('express');
const { body, param } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(authMiddleware);

router.get('/', categoryController.getCategories);
router.post(
	'/',
	[
		body('name').trim().notEmpty().withMessage('Category name is required'),
		body('color').optional().isHexColor().withMessage('Color must be a valid hex value'),
		body('icon').optional().isString().isLength({ min: 1, max: 4 }).withMessage('Icon must be a short emoji/string'),
		validateRequest,
	],
	categoryController.createCategory
);
router.put(
	'/:id',
	[
		param('id').isMongoId().withMessage('Invalid category id'),
		body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
		body('color').optional().isHexColor().withMessage('Color must be a valid hex value'),
		body('icon').optional().isString().isLength({ min: 1, max: 4 }).withMessage('Icon must be a short emoji/string'),
		validateRequest,
	],
	categoryController.updateCategory
);
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid category id'), validateRequest], categoryController.deleteCategory);

module.exports = router;
