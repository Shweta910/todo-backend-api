const { getTodoByIdService } = require("../../../src/services/todo.service");
const ApiError = require("../../../src/utils/ApiError");

const {
  findTodoByIdAndOwner,
} = require("../../../src/repositories/todo.repository");

jest.mock("../../../src/repositories/todo.repository");

describe("getTodoByIdService()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return todo successfully", async () => {
    // Arrange
    const todo = {
      _id: "todo123",
      title: "Learn Jest",
      owner: "user123",
    };

    findTodoByIdAndOwner.mockResolvedValue(todo);

    // Act
    const result = await getTodoByIdService("todo123", "user123");

    // Assert
    expect(findTodoByIdAndOwner).toHaveBeenCalledTimes(1);
    expect(findTodoByIdAndOwner).toHaveBeenCalledWith("todo123", "user123");

    expect(result).toEqual(todo);
  });

  it("should throw 404 if todo not found", async () => {
    // Arrange
    findTodoByIdAndOwner.mockResolvedValue(null);

    // Act & Assert
    await expect(getTodoByIdService("todo123", "user123")).rejects.toThrow(
      ApiError,
    );

    await expect(getTodoByIdService("todo123", "user123")).rejects.toThrow(
      "Todo not found",
    );

    expect(findTodoByIdAndOwner).toHaveBeenCalledTimes(2);
  });
});
