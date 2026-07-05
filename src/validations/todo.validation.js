const { body } = require("express-validator");

const createTodoValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description").optional().trim(),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be true or false"),

  body("recurringType")
    .optional({ nullable: true })
    .isIn(["daily", "weekly", "monthly"])
    .withMessage("Invalid recurring type"),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
];

const updateTodoValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("description").optional().trim(),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be true or false"),

  body("recurringType")
    .optional({ nullable: true })
    .isIn(["daily", "weekly", "monthly"])
    .withMessage("Invalid recurring type"),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
];

module.exports = {
  createTodoValidation,
  updateTodoValidation,
};
