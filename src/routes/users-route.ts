import { Router } from "express";
import { userController } from "../controllers/user-controller";
import { validateRequest } from "../middlewares/validate-middleware";
import { registerSchema, loginSchema } from "../validators/user-validator";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoint untuk manajemen user (registrasi, login, logout, dan profil)
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Register user baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *                 description: Nama depan user (1-255 karakter)
 *               lastname:
 *                 type: string
 *                 example: Doe
 *                 description: Nama belakang user (1-255 karakter)
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *                 description: Email unik user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *                 description: Password minimal 6 karakter
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: clx123abc
 *                     firstname:
 *                       type: string
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Validasi gagal (input tidak valid)
 *       409:
 *         description: Email sudah terdaftar
 *       500:
 *         description: Internal Server Error
 */
router.post("/", validateRequest(registerSchema), userController.register);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user dan dapatkan token
 *     tags: [Users]
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
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login berhasil, token dikembalikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *                 data:
 *                   type: string
 *                   example: abc123xyz...
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", validateRequest(loginSchema), userController.login);

/**
 * @swagger
 * /api/v1/users/current:
 *   get:
 *     summary: Ambil data user yang sedang login
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User found
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: clx123abc
 *                     firstname:
 *                       type: string
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T00:00:00.000Z
 *       401:
 *         description: Token tidak valid atau tidak dikirim
 *       500:
 *         description: Internal Server Error
 */
router.get("/current", authMiddleware, userController.getCurrentUser);

/**
 * @swagger
 * /api/v1/users/logout:
 *   delete:
 *     summary: Logout user (hapus session)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout success
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Token tidak valid atau tidak dikirim
 *       500:
 *         description: Internal Server Error
 */
router.delete("/logout", authMiddleware, userController.logout);

export default router;
