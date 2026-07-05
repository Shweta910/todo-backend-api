const request = require("supertest");
const app = require("../../src/app");

const loginUser = async () => {
  const email = `test${Date.now()}@gmail.com`;

  const password = "Password@123";

  // Register User
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email,
      password,
    });

  // Login User
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password,
    });

  return response.body.data.token;
};

module.exports = {
  loginUser,
};