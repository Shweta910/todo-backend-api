const request = require("supertest");
const app = require("../../src/app");

describe("Auth API - Register", () => {
  it("should register a new user successfully", async () => {
    const user = {
      name: "Test User",
      email: `test${Date.now()}@gmail.com`,
      password: "Password@123",
    };

    const response = await request(app).post("/api/auth/register").send(user);

    console.log(response.body);

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("User Registered Successfully");

    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data).toHaveProperty("token");

    expect(response.body.data.user.name).toBe(user.name);
    expect(response.body.data.user.email).toBe(user.email);
  });
});
