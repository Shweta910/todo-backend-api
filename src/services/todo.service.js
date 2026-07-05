const {
  createTodo,
  findTodosByOwner,
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
} = require("../repositories/todo.repository");
const ApiError = require("../utils/ApiError");

/**
 * Create Todo
 */
const createTodoService = async (todoData, userId) => {
  const existingTodo = await findTodoByTitleAndOwner(todoData.title, userId);

  if (existingTodo) {
    throw new ApiError(409, "Todo already exists");
  }

  const todo = await createTodo({
    ...todoData,
    owner: userId,
  });

  return todo;
};

/**
 * Get All Todos
 */
const getTodosService = async (userId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // --------------------------
  // Build Filters
  // --------------------------
  // --------------------------
  // Build Filters
  // --------------------------
  const filters = {};

  if (query.status) {
    filters.status = query.status;
  }

  if (query.priority) {
    filters.priority = query.priority;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.favorite) {
    filters.favorite = query.favorite === "true";
  }

  if (query.search) {
    filters.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  if (query.dueDate) {
    filters.dueDate = {
      $lte: new Date(query.dueDate),
    };
  }
  // --------------------------
  // Build Sorting
  // --------------------------
  const allowedSortFields = [
    "createdAt",
    "dueDate",
    "priority",
    "status",
    "title",
  ];

  const sortBy = allowedSortFields.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const order = query.order === "asc" ? 1 : -1;

  const sort = {
    [sortBy]: order,
  };

  // --------------------------
  // Fetch Data
  // --------------------------
  const todos = await findTodosByOwner(userId, filters, {
    skip,
    limit,
    sort,
  });

  const totalRecords = await countTodos(userId, filters);

  return {
    todos,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      hasNextPage: page * limit < totalRecords,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Get Single Todo
 */
const getTodoByIdService = async (todoId, userId) => {
  const todo = await findTodoByIdAndOwner(todoId, userId);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return todo;
};

/**
 * Update Todo
 */
const updateTodoService = async (todoId, userId, updateData) => {
  const todo = await findTodoByIdAndOwner(todoId, userId);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return await updateTodo(todoId, updateData);
};

/**
 * Delete Todo
 */
const deleteTodoService = async (todoId, userId) => {
  const todo = await findTodoByIdAndOwner(todoId, userId);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  await softDeleteTodo(todoId);

  return null;
};
const restoreTodoService = async (todoId, userId) => {
  const todo = await findDeletedTodoByIdAndOwner(todoId, userId);

  if (!todo) {
    throw new ApiError(404, "Deleted todo not found");
  }

  return await restoreTodo(todoId);
};

// get stats
const getTodoStatsService = async (userId) => {
  return await getTodoStats(userId);
};

// favourite data
const toggleFavoriteService = async (id, owner) => {
  const todo = await findTodoByIdAndOwner(id, owner);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return await toggleFavorite(id);
};

const getOverdueTodosService = async (userId) => {
  return await findOverdueTodos(userId);
};

const getDashboardService = async (userId) => {
  return await getDashboardData(userId);
};

module.exports = {
  createTodoService,
  getTodosService,
  getTodoByIdService,
  updateTodoService,
  deleteTodoService,
  restoreTodoService,
  getTodoStatsService,
  toggleFavoriteService,
  getOverdueTodosService,
  getDashboardService,
};
