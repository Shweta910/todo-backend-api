const request = require("supertest");
const app = require("../../src/app");
const { loginUser } = require("../helpers/auth.helper");

describe("Todo API - Statistics", () => {
  it("should return todo statistics", async () => {
    const token = await loginUser();

    // Pending Todo
    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Pending Todo",
        status: "pending",
        priority: "high",
      });

    // Completed Todo
    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Completed Todo",
        status: "completed",
        priority: "medium",
      });

    // In Progress Todo
    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "In Progress Todo",
        status: "in-progress",
        priority: "low",
      });

    // Call Stats API
    const response = await request(app)
      .get("/api/todos/stats")
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
