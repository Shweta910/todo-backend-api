const request = require("supertest");
const app = require("../../src/app");
const { loginUser } = require("../helpers/auth.helper");

describe("Todo API - Update Todo", () => {
  it("should update an existing todo", async () => {
    const token = await loginUser();

    // Create Todo
    const createResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Old Todo",
        description: "Old Description",
        priority: "medium",
      });

    const todoId = createResponse.body.data._id;

    // Update Todo
    const updateResponse = await request(app)
      .put(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Todo",
        description: "Updated Description",
        priority: "high",
      });

    console.log(updateResponse.body);

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.success).toBe(true);

    expect(updateResponse.body.data.title).toBe("Updated Todo");
    expect(updateResponse.body.data.description).toBe("Updated Description");
    expect(updateResponse.body.data.priority).toBe("high");
  });
});