const express = require('express');

const { register, login, profile } = require('../controllers/auth.controller');

const {
  registerValidation,
  loginValidation,
} = require('../validations/auth.validation');

const validate = require('../middleware/validation.middleware');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: User Authentication APIs
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Validation Error
 */
router.post('/register', registerValidation, validate, register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       400:
 *         description: Validation Error
 *
 *       401:
 *         description: Invalid Credentials
 */
router.post('/login', loginValidation, validate, login);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Get User Profile
 *     description: Returns the authenticated user's profile information.
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Profile fetched successfully
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
 *                   example: Profile fetched successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6a47d7ae13bc783c4c916da9
 *
 *                     name:
 *                       type: string
 *                       example: John Doe
 *
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-05T10:30:45.000Z"
 *
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-05T10:30:45.000Z"
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */ router.get('/profile', authenticate, profile);

module.exports = router;
