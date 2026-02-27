const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Budget name is required'],
    },
    description: {
      type: String,
      default: '',
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
    },
    period: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    categories: [
      {
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
        },
        allocatedAmount: {
          type: Number,
          min: 0,
        },
        spent: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, createdAt: -1 });
budgetSchema.index({ userId: 1, startDate: -1, endDate: -1 });
budgetSchema.index({ 'categories.categoryId': 1 });

module.exports = mongoose.model('Budget', budgetSchema);
