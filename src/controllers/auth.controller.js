const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} = require('../services/auth.service');

/**
 * Register
 */
const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, 'User Registered Successfully', result));
});

/**
 * Login
 */
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json(new ApiResponse(200, 'Login Successful', result));
});

/**
 * Refresh Token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const result = await refreshAccessToken(req.body.refreshToken);

  res.status(200).json(new ApiResponse(200, 'Access Token Refreshed', result));
});

/**
 * Logout
 */
const logout = asyncHandler(async (req, res) => {
  const result = await logoutUser(req.user._id);

  res.status(200).json(new ApiResponse(200, 'Logout Successful', result));
});

/**
 * Profile
 */
const profile = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, 'Profile fetched successfully', req.user));
});

module.exports = {
  register,
  login,
  profile,
  refreshToken,
  logout,
};
