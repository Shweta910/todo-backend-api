const request = require("supertest");
const app = require("../../src/app");
const { loginUser } = require("../helpers/auth.helper");

describe("Todo API - Restore Todo", () => {
  it("should restore a deleted todo", async () => {
    const token = await loginUser();

    // Create Todo
    const createResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Restore Todo",
        description: "Testing Restore",
        priority: "medium",
      });

    const todoId = createResponse.body.data._id;

    // Delete Todo
    await request(app)
      .delete(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`);

    // Restore Todo
    const restoreResponse = await request(app)
      .patch(`/api/todos/${todoId}/restore`)
      .set("Authorization", `Bearer ${token}`);

    console.log(restoreResponse.body);

    expect(restoreResponse.statusCode).toBe(200);
    expect(restoreResponse.body.success).toBe(true);
    expect(restoreResponse.body.message).toBe(
      "Todo restored successfully"
    );

    expect(restoreResponse.body.data._id).toBe(todoId);
    expect(restoreResponse.body.data.title).toBe("Restore Todo");
  });
});