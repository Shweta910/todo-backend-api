const express = require('express');

const router = express.Router();

const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');

const {
  createTodoValidation,
  updateTodoValidation,
} = require('../validations/todo.validation');

const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  restoreTodo,
  getTodoStats,
  toggleFavorite,
  getOverdueTodos,
  getDashboard,
} = require('../controllers/todo.controller');

/**
 * @openapi
 * tags:
 *   name: Todos
 *   description: Todo APIs
 */

/**
 * @openapi
 * /api/todos:
 *   post:
 *     summary: Create Todo
 *     description: Create a new todo for the authenticated user.
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoRequest'
 *
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todo created successfully
 *
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */
// Create Todo
router.post('/', authenticate, createTodoValidation, validate, createTodo);

/**
 * @openapi
 * /api/todos:
 *   get:
 *     summary: Get All Todos
 *     description: Retrieve all todos for the authenticated user.
 *
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of todos per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - in-progress
 *             - completed
 *
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: isFavorite
 *         schema:
 *           type: boolean
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - dueDate
 *             - priority
 *             - title
 *
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *
 *     responses:
 *       200:
 *         description: Todos fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todos fetched successfully
 *
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */
// Get All Todos
router.get('/', authenticate, getTodos);

/**
 * @openapi
 * /api/todos/stats:
 *   get:
 *     summary: Get Todo Statistics
 *     description: Returns statistics for the authenticated user's todos.
 *
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todo statistics fetched successfully
 *
 *                 data:
 *                   $ref: '#/components/schemas/TodoStats'
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */
router.get('/stats', authenticate, getTodoStats);

/**
 * @openapi
 * /api/todos/overdue:
 *   get:
 *     summary: Get Overdue Todos
 *     description: Returns all overdue todos of the authenticated user.
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Overdue todos fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Overdue todos fetched successfully
 *
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6870d4b43a51d8d82fd23456
 *
 *                       title:
 *                         type: string
 *                         example: Complete Node.js Interview Preparation
 *
 *                       description:
 *                         type: string
 *                         example: Finish Express, JWT, Swagger and Docker setup.
 *
 *                       status:
 *                         type: string
 *                         example: pending
 *
 *                       priority:
 *                         type: string
 *                         example: high
 *
 *                       category:
 *                         type: string
 *                         example: Work
 *
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-01T18:30:00.000Z"
 *
 *                       isFavorite:
 *                         type: boolean
 *                         example: true
 *
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */
router.get('/overdue', authenticate, getOverdueTodos);

/**
 * @openapi
 * /api/todos/dashboard:
 *   get:
 *     summary: Get Dashboard Summary
 *     description: Returns dashboard information for the authenticated user, including todo statistics and recent todos.
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Dashboard data fetched successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTodos:
 *                       type: integer
 *                       example: 25
 *
 *                     pending:
 *                       type: integer
 *                       example: 8
 *
 *                     inProgress:
 *                       type: integer
 *                       example: 10
 *
 *                     completed:
 *                       type: integer
 *                       example: 7
 *
 *                     overdue:
 *                       type: integer
 *                       example: 3
 *
 *                     favorites:
 *                       type: integer
 *                       example: 6
 *
 *                     recentTodos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 6870d4b43a51d8d82fd23456
 *
 *                           title:
 *                             type: string
 *                             example: Complete Swagger Documentation
 *
 *                           status:
 *                             type: string
 *                             example: in-progress
 *
 *                           priority:
 *                             type: string
 *                             example: high
 *
 *                           category:
 *                             type: string
 *                             example: Work
 *
 *                           dueDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-07-20T18:30:00.000Z"
 *
 *                           isFavorite:
 *                             type: boolean
 *                             example: true
 *
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */
router.get('/dashboard', authenticate, getDashboard);

/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     summary: Get Todo By ID
 *     description: Retrieve a single todo by its ID for the authenticated user.
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: string
 *           example: 6870d4b43a51d8d82fd23456
 *
 *     responses:
 *       200:
 *         description: Todo fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todo fetched successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6870d4b43a51d8d82fd23456
 *
 *                     title:
 *                       type: string
 *                       example: Complete Swagger Documentation
 *
 *                     description:
 *                       type: string
 *                       example: Finish documenting all Todo APIs.
 *
 *                     status:
 *                       type: string
 *                       example: in-progress
 *
 *                     priority:
 *                       type: string
 *                       example: high
 *
 *                     category:
 *                       type: string
 *                       example: Work
 *
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-20T18:30:00.000Z"
 *
 *                     isFavorite:
 *                       type: boolean
 *                       example: true
 *
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-05T06:20:30.000Z"
 *
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-05T06:35:10.000Z"
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Todo not found
 *
 *       500:
 *         description: Internal Server Error
 */
// Get Single Todo
router.get('/:id', authenticate, getTodoById);

/**
 * @openapi
 * /api/todos/{id}:
 *   put:
 *     summary: Update Todo
 *     description: Update an existing todo by its ID.
 *
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: string
 *           example: 6870d4b43a51d8d82fd23456
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete Node.js Interview Preparation
 *
 *               description:
 *                 type: string
 *                 example: Finish Express, JWT, Swagger and Docker setup.
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - in-progress
 *                   - completed
 *                 example: in-progress
 *
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 example: high
 *
 *               category:
 *                 type: string
 *                 example: Work
 *
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-20T18:30:00.000Z"
 *
 *               isFavorite:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todo updated successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6870d4b43a51d8d82fd23456
 *
 *                     title:
 *                       type: string
 *                       example: Complete Node.js Interview Preparation
 *
 *                     description:
 *                       type: string
 *                       example: Finish Express, JWT, Swagger and Docker setup.
 *
 *                     status:
 *                       type: string
 *                       example: in-progress
 *
 *                     priority:
 *                       type: string
 *                       example: high
 *
 *                     category:
 *                       type: string
 *                       example: Work
 *
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *
 *                     isFavorite:
 *                       type: boolean
 *                       example: true
 *
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *
 *       400:
 *         description: Validation failed
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Todo not found
 *
 *       500:
 *         description: Internal Server Error
 */
// Update Todo
router.put('/:id', authenticate, updateTodoValidation, validate, updateTodo);

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete Todo
 *     description: Soft deletes a todo by its ID for the authenticated user.
 *
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: string
 *           example: 6870d4b43a51d8d82fd23456
 *
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todo deleted successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6870d4b43a51d8d82fd23456
 *
 *                     title:
 *                       type: string
 *                       example: Complete Node.js Interview Preparation
 *
 *                     isDeleted:
 *                       type: boolean
 *                       example: true
 *
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-05T10:30:45.000Z"
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Todo not found
 *
 *       500:
 *         description: Internal Server Error
 */
// Delete Todo
router.delete('/:id', authenticate, deleteTodo);

/**
 * @openapi
 * /api/todos/{id}/restore:
 *   patch:
 *     summary: Restore Todo
 *     description: Restore a previously soft-deleted todo.
 *
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the deleted todo to restore.
 *         schema:
 *           type: string
 *           example: 6870d4b43a51d8d82fd23456
 *
 *     responses:
 *       200:
 *         description: Todo restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todo restored successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6870d4b43a51d8d82fd23456
 *
 *                     title:
 *                       type: string
 *                       example: Complete Node.js Interview Preparation
 *
 *                     description:
 *                       type: string
 *                       example: Finish Express, JWT, Swagger and Docker setup.
 *
 *                     status:
 *                       type: string
 *                       example: pending
 *
 *                     priority:
 *                       type: string
 *                       example: high
 *
 *                     category:
 *                       type: string
 *                       example: Work
 *
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *
 *                     isFavorite:
 *                       type: boolean
 *                       example: true
 *
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Todo not found
 *
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id/restore', authenticate, restoreTodo);

/**
 * @openapi
 * /api/todos/{id}/favorite:
 *   patch:
 *     summary: Toggle Favorite Todo
 *     description: Marks a todo as favorite if it is not favorite, or removes it from favorites if it already is.
 *
 *     tags:
 *       - Todos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: string
 *           example: 6870d4b43a51d8d82fd23456
 *
 *     responses:
 *       200:
 *         description: Favorite status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Todo favorite status updated successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6870d4b43a51d8d82fd23456
 *
 *                     title:
 *                       type: string
 *                       example: Complete Node.js Interview Preparation
 *
 *                     description:
 *                       type: string
 *                       example: Finish Express, JWT, Swagger and Docker setup.
 *
 *                     status:
 *                       type: string
 *                       example: pending
 *
 *                     priority:
 *                       type: string
 *                       example: high
 *
 *                     category:
 *                       type: string
 *                       example: Work
 *
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *
 *                     isFavorite:
 *                       type: boolean
 *                       example: true
 *
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Todo not found
 *
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id/favorite', authenticate, toggleFavorite);

module.exports = router;
