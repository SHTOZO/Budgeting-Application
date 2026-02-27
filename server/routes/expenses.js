const express = require('express');
const { body, param, query } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(authMiddleware);

router.get(
	'/',
	[
		query('budgetId').optional().isMongoId().withMessage('Invalid budget id'),
		query('categoryId').optional().isMongoId().withMessage('Invalid category id'),
		validateRequest,
	],
	expenseController.getExpenses
);
router.post(
	'/',
	[
		body('budgetId').isMongoId().withMessage('Valid budget id is required'),
		body('categoryId').isMongoId().withMessage('Valid category id is required'),
		body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
		body('description').optional().isString().withMessage('Description must be text'),
		body('date').optional().isISO8601().withMessage('Date must be valid'),
		validateRequest,
	],
	expenseController.createExpense
);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid expense id'), validateRequest], expenseController.getExpense);
router.put(
	'/:id',
	[
		param('id').isMongoId().withMessage('Invalid expense id'),
		body('budgetId').optional().isMongoId().withMessage('Invalid budget id'),
		body('categoryId').optional().isMongoId().withMessage('Invalid category id'),
		body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
		body('description').optional().isString().withMessage('Description must be text'),
		body('date').optional().isISO8601().withMessage('Date must be valid'),
		validateRequest,
	],
	expenseController.updateExpense
);
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid expense id'), validateRequest], expenseController.deleteExpense);

module.exports = router;
