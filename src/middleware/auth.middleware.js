const { verifyToken } = require('../utils/generateToken');

const { findUserById } = require('../repositories/auth.repository');
const ApiError = require('../utils/ApiError');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token missing');
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);

    const user = await findUserById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
