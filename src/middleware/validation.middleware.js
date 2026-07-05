const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const formattedErrors = {};

  result.array().forEach((error) => {
    formattedErrors[error.path] = error.msg;
  });

  return res.status(400).json({
    success: false,
    message: "Validation Failed",
    errors: formattedErrors,
  });
};

module.exports = validate;
