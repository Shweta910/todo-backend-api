const { registerUser } = require("../../../src/services/auth.service");
const  generateToken  = require("../../../src/utils/generateToken");
const bcrypt = require("bcrypt");

const {
  findUserByEmail,
  createUser,
} = require("../../../src/repositories/auth.repository");

jest.mock("bcrypt");
jest.mock("../../../src/repositories/auth.repository");
jest.mock("../../../src/utils/generateToken");

describe("registerUser()", () => {
  it("should register a new user", async () => {
    // Arrange
    const userData = {
      name: "Shweta",
      email: "shweta@test.com",
      password: "Password@123",
    };

    findUserByEmail.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");

    createUser.mockResolvedValue({
      _id: "123",
      name: "Shweta",
      email: "shweta@test.com",
    });

    generateToken.mockReturnValue("fake-jwt-token");

    // Act
    const result = await registerUser(userData);

    // Assert
    expect(result.user.name).toBe("Shweta");
  });
});
