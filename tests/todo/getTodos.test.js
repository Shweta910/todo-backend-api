const request = require("supertest");
const app = require("../../src/app");
const { loginUser } = require("../helpers/auth.helper");

describe("Todo API - Get Todos", () => {
  it("should return all todos of logged-in user", async () => {
    const token = await loginUser();

    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data.todos)).toBe(true);

    expect(response.body.data).toHaveProperty("pagination");
  });
});