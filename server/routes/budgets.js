const express = require('express');
const { body, param } = require('express-validator');
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(authMiddleware);

router.get('/', budgetController.getBudgets);
router.post(
	'/',
	[
		body('name').trim().notEmpty().withMessage('Name is required'),
		body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
		body('period').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid period'),
		body('startDate').isISO8601().withMessage('Start date must be a valid date'),
		body('endDate').isISO8601().withMessage('End date must be a valid date'),
		validateRequest,
	],
	budgetController.createBudget
);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid budget id'), validateRequest], budgetController.getBudget);
router.put(
	'/:id',
	[
		param('id').isMongoId().withMessage('Invalid budget id'),
		body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
		body('totalAmount').optional().isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
		body('period').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid period'),
		body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
		body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
		validateRequest,
	],
	budgetController.updateBudget
);
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid budget id'), validateRequest], budgetController.deleteBudget);
router.post(
	'/:id/categories',
	[
		param('id').isMongoId().withMessage('Invalid budget id'),
		body('categoryId').isMongoId().withMessage('Invalid category id'),
		body('allocatedAmount').optional().isFloat({ min: 0 }).withMessage('Allocated amount must be a positive number'),
		validateRequest,
	],
	budgetController.addCategoryToBudget
);

module.exports = router;
