const Todo = require("../models/Todo");

/**
 * Create Todo
 */
const createTodo = async (todoData) => {
  return await Todo.create(todoData);
};

/**
 * Get all todos of a user
 */
const findTodosByOwner = async (ownerId, filters, options) => {
  const { skip, limit, sort } = options;
  console.log({
    owner: ownerId,
    isDeleted: false,
    ...filters,
  });
  const todos = await Todo.find({
    owner: ownerId,
    isDeleted: false,
    ...filters,
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return todos;
};

// restore deleted file
const findDeletedTodoByIdAndOwner = async (todoId, ownerId) => {
  return await Todo.findOne({
    _id: todoId,
    owner: ownerId,
    isDeleted: true,
  });
};

const countTodos = async (ownerId, filters) => {
  return await Todo.countDocuments({
    owner: ownerId,
    isDeleted: false,
    ...filters,
  });
};

/**
 * Get todo by ID
 */
const findTodoById = async (todoId) => {
  return await Todo.findById(todoId);
};

/**
 * Get todo by ID and owner
 * (Prevents users from accessing others' todos)
 */
const findTodoByIdAndOwner = async (todoId, ownerId) => {
  return await Todo.findOne({
    _id: todoId,
    owner: ownerId,
    isDeleted: false,
  });
};

/**
 * Update Todo
 */
const updateTodo = async (todoId, updateData) => {
  return await Todo.findByIdAndUpdate(todoId, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete Todo
 */
const softDeleteTodo = async (todoId) => {
  return await Todo.findByIdAndUpdate(
    todoId,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

// restore todo
const restoreTodo = async (id) => {
  return await Todo.findByIdAndUpdate(
    id,
    {
      isDeleted: false,
      deletedAt: null,
    },
    {
      new: true,
    },
  );
};

//getTodoStats
const getTodoStats = async (ownerId) => {
  const stats = await Todo.aggregate([
    {
      $match: {
        owner: ownerId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },

        pending: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
          },
        },

        inProgress: {
          $sum: {
            $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
          },
        },

        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },

        high: {
          $sum: {
            $cond: [{ $eq: ["$priority", "high"] }, 1, 0],
          },
        },

        medium: {
          $sum: {
            $cond: [{ $eq: ["$priority", "medium"] }, 1, 0],
          },
        },

        low: {
          $sum: {
            $cond: [{ $eq: ["$priority", "low"] }, 1, 0],
          },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      high: 0,
      medium: 0,
      low: 0,
    }
  );
};

// duplicate data catching
const findTodoByTitleAndOwner = async (title, ownerId) => {
  return await Todo.findOne({
    owner: ownerId,
    isDeleted: false,
    title: {
      $regex: `^${title.trim()}$`,
      $options: "i",
    },
  });
};

// favourite data
const toggleFavorite = async (id) => {
  const todo = await Todo.findById(id);

  todo.isFavorite = !todo.isFavorite;

  await todo.save();

  return todo;
};

const findOverdueTodos = async (ownerId) => {
  return await Todo.find({
    owner: ownerId,
    isDeleted: false,
    status: { $ne: "completed" },
    dueDate: { $lt: new Date() },
  });
};

const getDashboardData = async (ownerId) => {
  const [
    total,
    completed,
    pending,
    inProgress,
    favoriteCount,
    overdueCount,
    recentTodos,
    high,
    medium,
    low,
  ] = await Promise.all([
    Todo.countDocuments({ owner: ownerId, isDeleted: false }),

    Todo.countDocuments({
      owner: ownerId,
      status: "completed",
      isDeleted: false,
    }),

    Todo.countDocuments({
      owner: ownerId,
      status: "pending",
      isDeleted: false,
    }),

    Todo.countDocuments({
      owner: ownerId,
      status: "in-progress",
      isDeleted: false,
    }),

    Todo.countDocuments({
      owner: ownerId,
      isFavorite: true,
      isDeleted: false,
    }),

    Todo.countDocuments({
      owner: ownerId,
      isDeleted: false,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    }),

    Todo.find({
      owner: ownerId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5),

    Todo.countDocuments({
      owner: ownerId,
      priority: "high",
      isDeleted: false,
    }),

    Todo.countDocuments({
      owner: ownerId,
      priority: "medium",
      isDeleted: false,
    }),

    Todo.countDocuments({
      owner: ownerId,
      priority: "low",
      isDeleted: false,
    }),
  ]);

  return {
    stats: {
      total,
      completed,
      pending,
      inProgress,
    },

    priority: {
      high,
      medium,
      low,
    },

    favoriteCount,
    overdueCount,
    recentTodos,
  };
};

module.exports = {
  createTodo,
  findTodosByOwner,
  findTodoById,
  findTodoByIdAndOwner,
  findDeletedTodoByIdAndOwner,
  findTodoByTitleAndOwner,
  updateTodo,
  softDeleteTodo,
  countTodos,
  restoreTodo,
  getTodoStats,
  toggleFavorite,
  findOverdueTodos,
  getDashboardData,
};
