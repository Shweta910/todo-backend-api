const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
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
} = require("../services/todo.service");

/**
 * Create Todo
 */
const createTodo = asyncHandler(async (req, res) => {
  const todo = await createTodoService(req.body, req.user._id);

  res.status(201).json(new ApiResponse(201, "Todo created successfully", todo));
});

/**
 * Get All Todos
 */
const getTodos = asyncHandler(async (req, res) => {
  console.log(req.user._id, "console.log(req.user._id);");
  const todos = await getTodosService(req.user._id, req.query);

  res
    .status(200)
    .json(new ApiResponse(200, "Todos fetched successfully", todos));
});

/**
 * Get Single Todo
 */
const getTodoById = asyncHandler(async (req, res) => {
  const todo = await getTodoByIdService(req.params.id, req.user._id);

  res.status(200).json(new ApiResponse(200, "Todo fetched successfully", todo));
});

/**
 * Update Todo
 */
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await updateTodoService(req.params.id, req.user._id, req.body);

  res.status(200).json(new ApiResponse(200, "Todo updated successfully", todo));
});

/**
 * Delete Todo
 */
const deleteTodo = asyncHandler(async (req, res) => {
  await deleteTodoService(req.params.id, req.user._id);

  res.status(200).json(new ApiResponse(200, "Todo deleted successfully"));
});
/**
 * Restore Delete Todo
 */
const restoreTodo = asyncHandler(async (req, res) => {
  const todo = await restoreTodoService(req.params.id, req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, "Todo restored successfully", todo));
});

// get stats
const getTodoStats = asyncHandler(async (req, res) => {
  const stats = await getTodoStatsService(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, "Todo statistics fetched successfully", stats));
});

// favourite data
const toggleFavorite = asyncHandler(async (req, res) => {
  const todo = await toggleFavoriteService(req.params.id, req.user._id);

  res.status(200).json(new ApiResponse(200, "Favorite updated", todo));
});

const getOverdueTodos = asyncHandler(async (req, res) => {
  const todos = await getOverdueTodosService(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, "Overdue todos fetched successfully", todos));
});

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getDashboardService(req.user._id);

  res
    .status(200)
    .json(
      new ApiResponse(200, "Dashboard data fetched successfully", dashboard),
    );
});

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  restoreTodo,
  getTodoStats,
  toggleFavorite,
  getOverdueTodos,
  getDashboard,
};
