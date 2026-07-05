const {
  createTodoService,
  getTodoByIdService,
  updateTodoService,
  deleteTodoService,
  restoreTodoService,
  toggleFavoriteService,
  getTodoStatsService,
  getOverdueTodosService,
  getDashboardService,
} = require("../../../src/services/todo.service");

const ApiError = require("../../../src/utils/ApiError");

const {
  createTodo,
  findTodoByTitleAndOwner,
  findTodoByIdAndOwner,
  findDeletedTodoByIdAndOwner,
  updateTodo,
  softDeleteTodo,
  restoreTodo,
  toggleFavorite,
  getTodoStats,
  findOverdueTodos,
  getDashboardData,
} = require("../../../src/repositories/todo.repository");

jest.mock("../../../src/repositories/todo.repository");

describe("Todo Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = "user123";
  const todoId = "todo123";

  it("should throw error if todo already exists", async () => {
    findTodoByTitleAndOwner.mockResolvedValue({
      _id: todoId,
    });

    await expect(
      createTodoService(
        {
          title: "Learn Jest",
        },
        userId,
      ),
    ).rejects.toThrow(ApiError);

    expect(createTodo).not.toHaveBeenCalled();
  });

  it("should return todo by id", async () => {
    const todo = {
      _id: "todo123",
      title: "Learn Jest",
      owner: "user123",
    };

    findTodoByIdAndOwner.mockResolvedValue(todo);

    const result = await getTodoByIdService("todo123", "user123");

    expect(findTodoByIdAndOwner).toHaveBeenCalledTimes(1);
    expect(findTodoByIdAndOwner).toHaveBeenCalledWith("todo123", "user123");

    expect(result).toEqual(todo);
  });

  it("should throw error if todo is not found", async () => {
    findTodoByIdAndOwner.mockResolvedValue(null);

    await expect(getTodoByIdService("todo123", "user123")).rejects.toThrow(
      "Todo not found",
    );

    expect(findTodoByIdAndOwner).toHaveBeenCalledTimes(1);
  });

  it("should update todo successfully", async () => {
    const todo = {
      _id: "todo123",
      title: "Old Title",
    };

    const updatedTodo = {
      _id: "todo123",
      title: "New Title",
    };

    findTodoByIdAndOwner.mockResolvedValue(todo);

    updateTodo.mockResolvedValue(updatedTodo);

    const result = await updateTodoService("todo123", "user123", {
      title: "New Title",
    });

    expect(findTodoByIdAndOwner).toHaveBeenCalledTimes(1);

    expect(updateTodo).toHaveBeenCalledTimes(1);

    expect(updateTodo).toHaveBeenCalledWith("todo123", {
      title: "New Title",
    });

    expect(result).toEqual(updatedTodo);
  });

  it("should throw error while updating if todo not found", async () => {
    findTodoByIdAndOwner.mockResolvedValue(null);

    await expect(
      updateTodoService("todo123", "user123", {
        title: "New Title",
      }),
    ).rejects.toThrow("Todo not found");

    expect(updateTodo).not.toHaveBeenCalled();
  });

  it("should delete todo successfully", async () => {
    findTodoByIdAndOwner.mockResolvedValue({
      _id: "todo123",
    });

    softDeleteTodo.mockResolvedValue();

    const result = await deleteTodoService("todo123", "user123");

    expect(findTodoByIdAndOwner).toHaveBeenCalledTimes(1);

    expect(softDeleteTodo).toHaveBeenCalledTimes(1);

    expect(softDeleteTodo).toHaveBeenCalledWith("todo123");

    expect(result).toBeNull();
  });

  it("should throw error while deleting if todo not found", async () => {
    findTodoByIdAndOwner.mockResolvedValue(null);

    await expect(deleteTodoService("todo123", "user123")).rejects.toThrow(
      "Todo not found",
    );

    expect(softDeleteTodo).not.toHaveBeenCalled();
  });

  it("should restore a deleted todo", async () => {
    const deletedTodo = {
      _id: "todo123",
      isDeleted: true,
    };

    const restoredTodo = {
      _id: "todo123",
      isDeleted: false,
    };

    findDeletedTodoByIdAndOwner.mockResolvedValue(deletedTodo);
    restoreTodo.mockResolvedValue(restoredTodo);

    const result = await restoreTodoService("todo123", "user123");

    expect(findDeletedTodoByIdAndOwner).toHaveBeenCalledWith(
      "todo123",
      "user123",
    );

    expect(restoreTodo).toHaveBeenCalledWith("todo123");

    expect(result).toEqual(restoredTodo);
  });

  it("should throw error if deleted todo not found", async () => {
    findDeletedTodoByIdAndOwner.mockResolvedValue(null);

    await expect(restoreTodoService("todo123", "user123")).rejects.toThrow(
      "Deleted todo not found",
    );

    expect(restoreTodo).not.toHaveBeenCalled();
  });

  it("should return todo statistics", async () => {
    const stats = {
      total: 10,
      completed: 5,
      pending: 5,
    };

    getTodoStats.mockResolvedValue(stats);

    const result = await getTodoStatsService("user123");

    expect(getTodoStats).toHaveBeenCalledWith("user123");

    expect(result).toEqual(stats);
  });

  it("should toggle favorite successfully", async () => {
    const todo = {
      _id: "todo123",
      isFavorite: false,
    };

    const updatedTodo = {
      _id: "todo123",
      isFavorite: true,
    };

    findTodoByIdAndOwner.mockResolvedValue(todo);

    toggleFavorite.mockResolvedValue(updatedTodo);

    const result = await toggleFavoriteService("todo123", "user123");

    expect(findTodoByIdAndOwner).toHaveBeenCalledWith("todo123", "user123");

    expect(toggleFavorite).toHaveBeenCalledWith("todo123");

    expect(result).toEqual(updatedTodo);
  });

  it("should throw error while toggling favorite if todo not found", async () => {
    findTodoByIdAndOwner.mockResolvedValue(null);

    await expect(toggleFavoriteService("todo123", "user123")).rejects.toThrow(
      "Todo not found",
    );

    expect(toggleFavorite).not.toHaveBeenCalled();
  });

  it("should return overdue todos", async () => {
    const overdueTodos = [
      {
        _id: "1",
        title: "Todo 1",
      },
      {
        _id: "2",
        title: "Todo 2",
      },
    ];

    findOverdueTodos.mockResolvedValue(overdueTodos);

    const result = await getOverdueTodosService("user123");

    expect(findOverdueTodos).toHaveBeenCalledWith("user123");

    expect(result).toEqual(overdueTodos);
  });

  it("should return dashboard data", async () => {
    const dashboard = {
      totalTodos: 10,
      completedTodos: 6,
      pendingTodos: 4,
    };

    getDashboardData.mockResolvedValue(dashboard);

    const result = await getDashboardService("user123");

    expect(getDashboardData).toHaveBeenCalledWith("user123");

    expect(result).toEqual(dashboard);
  });
});
