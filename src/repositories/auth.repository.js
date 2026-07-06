const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserWithPassword = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  return await User.create(userData);
};
const findUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const findUserByIdWithRefreshToken = async (id) => {
  return await User.findById(id);
};

const saveRefreshToken = async (userId, refreshToken) => {
  return await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
};

const removeRefreshToken = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true }
  );
};

module.exports = {
  findUserByEmail,
  findUserWithPassword,
  createUser,
  findUserById,
  findUserByIdWithRefreshToken,
  saveRefreshToken,
  removeRefreshToken,
};
