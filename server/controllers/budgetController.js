const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// Get all budgets for user
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id })
      .populate('categories.categoryId')
      .sort({ createdAt: -1 });

    const budgetIds = budgets.map((budget) => budget._id);
    const allExpenses = await Expense.find({ budgetId: { $in: budgetIds } });

    const expensesByBudgetId = allExpenses.reduce((accumulator, expense) => {
      const budgetId = expense.budgetId.toString();
      if (!accumulator[budgetId]) {
        accumulator[budgetId] = [];
      }
      accumulator[budgetId].push(expense);
      return accumulator;
    }, {});

    const budgetsWithExpenses = budgets.map((budget) => ({
      ...budget.toObject(),
      expenses: expensesByBudgetId[budget._id.toString()] || [],
    }));

    res.json({ success: true, data: budgetsWithExpenses });
  } catch (error) {
    next(error);
  }
};

// Create budget
exports.createBudget = async (req, res, next) => {
  try {
    const { name, description, totalAmount, period, startDate, endDate } = req.body;

    if (!name || !totalAmount || !startDate || !endDate) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Name, total amount, start date, and end date are required',
        });
    }

    const budget = await Budget.create({
      userId: req.user.id,
      name,
      description,
      totalAmount,
      period: period || 'monthly',
      startDate,
      endDate,
      categories: [],
    });

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// Get specific budget with expenses
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('categories.categoryId');

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    // Check if user owns this budget
    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get expenses for this budget
    const expenses = await Expense.find({ budgetId: req.params.id });

    res.json({
      success: true,
      data: {
        ...budget.toObject(),
        expenses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update budget
exports.updateBudget = async (req, res, next) => {
  try {
    const { name, description, totalAmount, period, startDate, endDate } = req.body;

    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    budget.name = name || budget.name;
    budget.description = description !== undefined ? description : budget.description;
    budget.totalAmount = totalAmount || budget.totalAmount;
    budget.period = period || budget.period;
    budget.startDate = startDate || budget.startDate;
    budget.endDate = endDate || budget.endDate;

    await budget.save();

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// Delete budget
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    await Expense.deleteMany({ budgetId: req.params.id });

    res.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Add category to budget
exports.addCategoryToBudget = async (req, res, next) => {
  try {
    const { categoryId, allocatedAmount } = req.body;

    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const categoryExists = budget.categories.some((c) => c.categoryId.toString() === categoryId);
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already added' });
    }

    budget.categories.push({
      categoryId,
      allocatedAmount: allocatedAmount || 0,
      spent: 0,
    });

    await budget.save();

    res.json({
      success: true,
      message: 'Category added to budget',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};
