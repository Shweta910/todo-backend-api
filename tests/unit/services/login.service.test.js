const { loginUser } = require("../../../src/services/auth.service");
const bcrypt = require("bcrypt");
const generateToken = require("../../../src/utils/generateToken");

const {
  findUserWithPassword,
} = require("../../../src/repositories/auth.repository");
jest.mock("bcrypt");
jest.mock("../../../src/utils/generateToken");
jest.mock("../../../src/repositories/auth.repository");

describe("loginUser()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully", async () => {
    // Arrange
    const loginData = {
      email: "shweta@test.com",
      password: "Password@123",
    };

    const dbUser = {
      _id: "123",
      name: "Shweta",
      email: "shweta@test.com",
      password: "hashed-password",
    };

    findUserWithPassword.mockResolvedValue(dbUser);

    bcrypt.compare.mockResolvedValue(true);

    generateToken.mockReturnValue("fake-jwt-token");

    // Act
    const result = await loginUser(loginData);

    // Assert
    expect(findUserWithPassword).toHaveBeenCalledTimes(1);
    expect(findUserWithPassword).toHaveBeenCalledWith(loginData.email);

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginData.password,
      dbUser.password,
    );

    expect(generateToken).toHaveBeenCalledTimes(1);
    expect(generateToken).toHaveBeenCalledWith(dbUser._id);

    expect(result).toEqual({
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
      },
      token: "fake-jwt-token",
    });
  });

  it("should throw error if user does not exist", async () => {
    // Arrange
    findUserWithPassword.mockResolvedValue(null);

    // Act & Assert
    await expect(
      loginUser({
        email: "unknown@test.com",
        password: "Password@123",
      }),
    ).rejects.toThrow("Invalid email or password");

    expect(findUserWithPassword).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("should throw error if password is incorrect", async () => {
    // Arrange
    findUserWithPassword.mockResolvedValue({
      _id: "123",
      name: "Shweta",
      email: "shweta@test.com",
      password: "hashed-password",
    });

    bcrypt.compare.mockResolvedValue(false);

    // Act & Assert
    await expect(
      loginUser({
        email: "shweta@test.com",
        password: "WrongPassword",
      }),
    ).rejects.toThrow("Invalid email or password");

    expect(findUserWithPassword).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(generateToken).not.toHaveBeenCalled();
  });
});
