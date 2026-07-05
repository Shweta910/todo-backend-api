const request = require("supertest");
const app = require("../../src/app");
const { loginUser } = require("../helpers/auth.helper");

describe("Todo API - Delete Todo", () => {
  it("should delete an existing todo", async () => {
    const token = await loginUser();

    // Create Todo
    const createResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Todo to Delete",
        description: "Testing delete",
        priority: "medium",
      });

    const todoId = createResponse.body.data._id;

    // Delete Todo
    const deleteResponse = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log(deleteResponse.body);

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
    expect(deleteResponse.body.message).toBe("Todo deleted successfully");
  });
});