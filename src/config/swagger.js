const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Todo Advance API",
      version: "1.0.0",
      description: "Node.js Todo Application API",
    },

    servers: [
      {
        url: "http://localhost:3001",
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Todo: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6870d4b43a51d8d82fd23456",
            },

            title: {
              type: "string",
              example: "Learn Node.js",
            },

            description: {
              type: "string",
              example: "Complete Express tutorial",
            },

            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "pending",
            },

            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high",
            },

            category: {
              type: "string",
              example: "Work",
            },

            dueDate: {
              type: "string",
              format: "date-time",
              example: "2026-07-20T18:30:00.000Z",
            },

            isFavorite: {
              type: "boolean",
              example: false,
            },

            isDeleted: {
              type: "boolean",
              example: false,
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CreateTodoRequest: {
          type: "object",

          required: ["title"],

          properties: {
            title: {
              type: "string",
              example: "Learn Docker",
            },

            description: {
              type: "string",
              example: "Complete Docker course",
            },

            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "pending",
            },

            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium",
            },

            category: {
              type: "string",
              example: "Learning",
            },

            dueDate: {
              type: "string",
              format: "date-time",
              example: "2026-07-20T18:30:00.000Z",
            },

            isFavorite: {
              type: "boolean",
              example: false,
            },
          },
        },

        UpdateTodoRequest: {
          type: "object",

          properties: {
            title: {
              type: "string",
              example: "Learn Docker",
            },

            description: {
              type: "string",
              example: "Complete Docker course",
            },

            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "completed",
            },

            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high",
            },

            category: {
              type: "string",
              example: "Learning",
            },

            dueDate: {
              type: "string",
              format: "date-time",
            },

            isFavorite: {
              type: "boolean",
              example: true,
            },
          },
        },

        SuccessResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Operation successful",
            },
          },
        },

        ErrorResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: false,
            },

            message: {
              type: "string",
              example: "Something went wrong",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJSDoc(options);