const express = require('express');
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', budgetController.getBudgets);
router.post('/', budgetController.createBudget);
router.get('/:id', budgetController.getBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);
router.post('/:id/categories', budgetController.addCategoryToBudget);

module.exports = router;
