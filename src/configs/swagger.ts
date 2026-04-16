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
        url: process.env.SERVER_URL || "http://localhost:3000",
        description: process.env.NODE_ENV === "production" ? "Production Server" : "Local Development Server",
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
