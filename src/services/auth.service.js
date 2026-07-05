const bcrypt = require("bcrypt");

const {
  findUserByEmail,
  createUser,
  findUserWithPassword,
} = require("../repositories/auth.repository");

const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

/**
 * Register User
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save User
  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT Token
  const token = generateToken(newUser._id);

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
    token,
  };
};

/**
 * Login User
 */
const loginUser = async ({ email, password }) => {
  // Check if user exists
  const user = await findUserWithPassword(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare Password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
