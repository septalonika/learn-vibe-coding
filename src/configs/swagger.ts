import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRUD Basic Template", 
      version: "1.0.0",
      description:
        "API Documentation for Basic CRUD template. Use the /api/v1/users/login endpoint to get a token, then click the Authorize button in the top right corner.",
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
