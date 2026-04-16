# Issue: Implementasi Swagger API Documentation

## 🎯 Tujuan

Menambahkan fitur **Swagger UI** ke dalam project ini agar user lain yang ingin menggunakan API
bisa langsung membuka halaman Swagger dan mencoba endpoint tanpa perlu membaca source code secara manual.

Setelah fitur ini selesai, user bisa mengakses dokumentasi API di:
```
http://localhost:3000/api-docs
```

---

## 📦 Tech Stack yang Digunakan

Pastikan kamu memahami bahwa project ini menggunakan:
- **Bun** sebagai runtime (bukan Node.js)
- **Express JS v5** sebagai web framework
- **TypeScript** sebagai bahasa pemrograman
- **Zod** untuk validasi request body

---

## 📋 Daftar API yang Sudah Ada

Berikut adalah semua endpoint yang perlu didokumentasikan di Swagger:

| Method | Endpoint              | Auth Required | Deskripsi                        |
|--------|-----------------------|:-------------:|----------------------------------|
| GET    | `/health`             | ❌            | Health check server              |
| POST   | `/api/v1/users`       | ❌            | Register user baru               |
| POST   | `/api/v1/users/login` | ❌            | Login user                       |
| GET    | `/api/v1/users/current` | ✅ Bearer   | Ambil data user yang sedang login |
| DELETE | `/api/v1/users/logout` | ✅ Bearer   | Logout user                      |

---

## 🪜 Tahapan Implementasi

### Tahap 1 — Install Dependency yang Dibutuhkan

Jalankan perintah berikut di terminal, dari root folder project:

```bash
bun add swagger-ui-express swagger-jsdoc
bun add -d @types/swagger-ui-express @types/swagger-jsdoc
```

**Penjelasan package:**
- `swagger-ui-express` → Menyajikan tampilan Swagger UI di browser via Express
- `swagger-jsdoc` → Membaca komentar JSDoc di route file dan mengonversinya ke format OpenAPI/Swagger
- `@types/swagger-ui-express` dan `@types/swagger-jsdoc` → Type definitions untuk TypeScript

---

### Tahap 2 — Buat File Konfigurasi Swagger

Buat file baru di path: **`src/configs/swagger.ts`**

File ini bertugas mendefinisikan konfigurasi dasar Swagger (info API, versi, server URL, dan skema keamanan).

```typescript
// src/configs/swagger.ts

import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learn Vibe Coding API",
      version: "1.0.0",
      description:
        "Dokumentasi API untuk project Learn Vibe Coding. Gunakan endpoint /api/v1/users/login untuk mendapatkan token, lalu klik tombol Authorize di pojok kanan atas.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    // Konfigurasi skema keamanan Bearer Token
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Masukkan token yang kamu dapatkan dari endpoint /login. Contoh: Bearer <token_kamu>",
        },
      },
    },
  },
  // Swagger akan membaca komentar JSDoc dari file-file berikut
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
```

> **Catatan penting:** Property `apis` menentukan dari mana swagger-jsdoc akan membaca komentar dokumentasi.
> Kita arahkan ke folder `src/routes/*.ts` karena semua definisi endpoint berada di sana.

---

### Tahap 3 — Tambahkan JSDoc Comment ke Route File

Buka file **`src/routes/users-route.ts`** dan tambahkan komentar JSDoc di atas setiap route.
Komentar ini yang akan dibaca oleh `swagger-jsdoc` untuk menghasilkan dokumentasi.

Ganti isi file `src/routes/users-route.ts` menjadi seperti berikut:

```typescript
// src/routes/users-route.ts

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
 *                   example: User registered successfully
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: abc123xyz...
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Email atau password salah
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
 *                   example: Success
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
 *                   example: Logout successful
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Token tidak valid atau tidak dikirim
 */
router.delete("/logout", authMiddleware, userController.logout);

export default router;
```

---

### Tahap 4 — Daftarkan Swagger ke `app.ts`

Buka file **`src/app.ts`** dan tambahkan kode berikut.

Perubahan yang harus dilakukan:
1. Import `swaggerUi` dan `swaggerSpec`
2. Daftarkan route `/api-docs` **sebelum** route API lainnya

```typescript
// src/app.ts

import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";           // ← TAMBAH INI
import { swaggerSpec } from "./configs/swagger";       // ← TAMBAH INI
import usersRouter from "./routes/users-route";
import { errorMiddleware } from "./middlewares/error-middleware";

const app = express();

app.use(express.json());

// Swagger UI — harus didaftarkan SEBELUM route lainnya
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // ← TAMBAH INI

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/v1/users", usersRouter);

// Global Error Handler (Must be registered after routes)
app.use(errorMiddleware);

export { app };
```

> **Kenapa Swagger didaftarkan sebelum route lain?**
> Supaya middleware Swagger UI tidak tertabrak oleh route-route lain, dan tidak terpengaruh oleh `errorMiddleware`.

---

### Tahap 5 — Verifikasi & Testing

1. **Jalankan server:**
   ```bash
   bun run dev
   ```

2. **Buka browser dan akses:**
   ```
   http://localhost:3000/api-docs
   ```

3. **Yang harus kamu lihat:**
   - Halaman Swagger UI terbuka dengan judul "Learn Vibe Coding API"
   - Ada section **Users** yang berisi semua 4 endpoint
   - Ada tombol **Authorize** di bagian kanan atas (untuk input Bearer token)

4. **Cara test endpoint yang membutuhkan auth (`/current` dan `/logout`):**
   - Jalankan POST `/api/v1/users/login` dari Swagger → copy nilai `token` dari response
   - Klik tombol **Authorize** → masukkan token (tanpa kata "Bearer", Swagger sudah menambahkannya otomatis)
   - Sekarang endpoint yang membutuhkan auth sudah bisa diakses

---

## ✅ Checklist

Centang ketika sudah selesai:

- [ ] `bun add swagger-ui-express swagger-jsdoc` berhasil dijalankan
- [ ] `bun add -d @types/swagger-ui-express @types/swagger-jsdoc` berhasil dijalankan
- [ ] File `src/configs/swagger.ts` sudah dibuat
- [ ] Komentar JSDoc sudah ditambahkan ke `src/routes/users-route.ts`
- [ ] `src/app.ts` sudah diupdate dengan import dan route `/api-docs`
- [ ] Server bisa berjalan tanpa error (`bun run dev`)
- [ ] Swagger UI bisa diakses di `http://localhost:3000/api-docs`
- [ ] Semua 4 endpoint User tampil di Swagger UI
- [ ] Endpoint `/current` dan `/logout` memiliki ikon gembok (🔒) di Swagger, menandakan butuh auth
- [ ] Login via Swagger, lalu gunakan tokennya untuk akses endpoint yang protected — berhasil

---

## ⚠️ Hal yang Perlu Diperhatikan

- Jangan hapus komentar yang sudah ada di file-file yang dimodifikasi
- Pastikan indentasi komentar `@swagger` menggunakan spasi (bukan tab), karena format YAML sensitif terhadap indentasi
- Field `apis` di `swagger.ts` menggunakan path relatif dari **root project**, bukan dari folder `src`
- Kalau ada error `Cannot find module 'swagger-ui-express'`, pastikan kamu sudah menjalankan `bun install`

---

## 📁 Ringkasan File yang Diubah

| Status | File |
|--------|------|
| 🆕 Baru | `src/configs/swagger.ts` |
| ✏️ Diubah | `src/routes/users-route.ts` |
| ✏️ Diubah | `src/app.ts` |
| 📦 Package | `package.json` (otomatis terupdate saat `bun add`) |
