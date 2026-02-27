const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    icon: {
      type: String,
      default: '📁',
    },
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1, createdAt: -1 });
categorySchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Category', categorySchema);
