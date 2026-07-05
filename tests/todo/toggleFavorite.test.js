const request = require("supertest");
const app = require("../../src/app");
const { loginUser } = require("../helpers/auth.helper");

describe("Todo API - Toggle Favorite", () => {
  it("should toggle favorite status", async () => {
    const token = await loginUser();

    // Create Todo
    const createResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Favorite Todo",
        description: "Testing favorite feature",
      });

    const todoId = createResponse.body.data._id;

    // First Toggle (false -> true)
    const favoriteResponse = await request(app)
      .patch(`/api/todos/${todoId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Status:", favoriteResponse.statusCode);
    console.log("Body:", JSON.stringify(favoriteResponse.body, null, 2));

    expect(favoriteResponse.statusCode).toBe(200);
    expect(favoriteResponse.body.success).toBe(true);
    expect(favoriteResponse.body.data.isFavorite).toBe(true);
    // Second Toggle (true -> false)
    const unfavoriteResponse = await request(app)
      .patch(`/api/todos/${todoId}/favorite`)
      .set("Authorization", `Bearer ${token}`);

    expect(unfavoriteResponse.statusCode).toBe(200);
    expect(unfavoriteResponse.body.success).toBe(true);
    expect(unfavoriteResponse.body.data.isFavorite).toBe(false);
  });
});
