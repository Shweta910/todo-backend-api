const request = require("supertest");
const app = require("../../src/app");
const { loginUser } = require("../helpers/auth.helper");

describe("Todo API - Create Todo", () => {
  it("should create a new todo", async () => {
    const token = await loginUser();

    const todo = {
      title: "Learn Jest",
      description: "Practice Integration Testing",
      priority: "high",
      status: "pending",
    };

    const response = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send(todo);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
  });
});