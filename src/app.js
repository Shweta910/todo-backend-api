const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');
const app = express();
const todoRoutes = require('./routes/todo.routes');
const dotenv = require('dotenv');
const requestLogger = require('./middleware/logger.middleware');

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Todo Backend API is running 🚀',
  });
});
// Error Handler (ALWAYS LAST)
app.use(errorHandler);

module.exports = app;
