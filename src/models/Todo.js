const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    dueDate: {
      type: Date,
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      enum: [
        'Work',
        'Personal',
        'Study',
        'Shopping',
        'Health',
        'Finance',
        'Others',
      ],
      default: 'Others',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Todo', todoSchema);
