const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// Get all expenses for user or for specific budget
exports.getExpenses = async (req, res, next) => {
  try {
    const { budgetId, categoryId } = req.query;
    const filter = { userId: req.user.id };

    if (budgetId) filter.budgetId = budgetId;
    if (categoryId) filter.categoryId = categoryId;

    const expenses = await Expense.find(filter)
      .populate('categoryId')
      .populate('budgetId')
      .sort({ date: -1 });

    res.json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

// Create expense
exports.createExpense = async (req, res, next) => {
  try {
    const { budgetId, categoryId, amount, description, date, tags } = req.body;

    if (!budgetId || !categoryId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Budget ID, category ID, and amount are required',
      });
    }

    // Verify budget belongs to user
    const budget = await Budget.findById(budgetId);
    if (!budget || budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Budget not found' });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      budgetId,
      categoryId,
      amount,
      description,
      date: date || new Date(),
      tags: tags || [],
    });

    // Update budget category spent amount
    const budgetCategory = budget.categories.find((c) => c.categoryId.toString() === categoryId);
    if (budgetCategory) {
      budgetCategory.spent = (budgetCategory.spent || 0) + amount;
      await budget.save();
    }

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// Get specific expense
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('categoryId')
      .populate('budgetId');

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// Update expense
exports.updateExpense = async (req, res, next) => {
  try {
    const { amount, description, categoryId, date, tags } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const oldAmount = expense.amount;
    const oldCategoryId = expense.categoryId;

    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.description = description !== undefined ? description : expense.description;
    expense.categoryId = categoryId || expense.categoryId;
    expense.date = date || expense.date;
    expense.tags = tags || expense.tags;

    await expense.save();

    // Update budget category spent amounts if amount or category changed
    if (oldAmount !== expense.amount || oldCategoryId.toString() !== categoryId) {
      const budget = await Budget.findById(expense.budgetId);

      // Subtract old amount from old category
      const oldCategory = budget.categories.find((c) => c.categoryId.toString() === oldCategoryId);
      if (oldCategory) {
        oldCategory.spent = Math.max(0, oldCategory.spent - oldAmount);
      }

      // Add new amount to new category
      const newCategory = budget.categories.find(
        (c) => c.categoryId.toString() === categoryId
      );
      if (newCategory) {
        newCategory.spent = (newCategory.spent || 0) + expense.amount;
      }

      await budget.save();
    }

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// Delete expense
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update budget category spent amount
    const budget = await Budget.findById(expense.budgetId);
    const budgetCategory = budget.categories.find((c) => c.categoryId.toString() === expense.categoryId);
    if (budgetCategory) {
      budgetCategory.spent = Math.max(0, budgetCategory.spent - expense.amount);
      await budget.save();
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
