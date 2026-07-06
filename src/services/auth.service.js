const bcrypt = require('bcrypt');

const {
  findUserByEmail,
  createUser,
  findUserWithPassword,
} = require('../repositories/auth.repository');

const User = require('../models/User');

const ApiError = require('../utils/ApiError');

const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require('../utils/generateToken');

/**
 * Register User
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, 'User already exists');
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save User
  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Generate Tokens
  const accessToken = generateAccessToken(newUser._id);

  const refreshToken = generateRefreshToken(newUser._id);

  // Save Refresh Token
  newUser.refreshToken = refreshToken;

  await newUser.save();

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login User
 */
const loginUser = async ({ email, password }) => {
  // Check if user exists
  const user = await findUserWithPassword(email);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Compare Password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate Tokens
  const accessToken = generateAccessToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  // Save Refresh Token
  user.refreshToken = refreshToken;

  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh Access Token
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  let decoded;

  try {
    decoded = verifyToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken(user._id);

  return {
    accessToken,
  };
};

/**
 * Logout User
 */
const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.refreshToken = null;

  await user.save();

  return {};
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
