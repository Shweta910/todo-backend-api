const { register, login } = require("../../../src/controllers/auth.controller");
const {
  registerUser,
  loginUser,
} = require("../../../src/services/auth.service");

jest.mock("../../../src/services/auth.service");

describe("Auth Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should register user successfully", async () => {
    const serviceResponse = {
      user: {
        id: "123",
        name: "Shweta",
        email: "shweta@test.com",
      },
      token: "jwt-token",
    };

    req.body = {
      name: "Shweta",
      email: "shweta@test.com",
      password: "Password@123",
    };

    registerUser.mockResolvedValue(serviceResponse);

    await register(req, res, next);

    expect(registerUser).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it("should login successfully", async () => {
    const serviceResponse = {
      user: {
        id: "123",
        name: "Shweta",
        email: "shweta@test.com",
      },
      token: "jwt-token",
    };

    req.body = {
      email: "shweta@test.com",
      password: "Password@123",
    };

    loginUser.mockResolvedValue(serviceResponse);

    await login(req, res, next);

    expect(loginUser).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

});
