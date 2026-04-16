import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./configs/swagger";
import usersRouter from "./routes/users-route";
import { errorMiddleware } from "./middlewares/error-middleware";

const app = express();

app.use(express.json());

// Swagger UI — harus didaftarkan SEBELUM route lainnya
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/v1/users", usersRouter);


// Global Error Handler (Must be registered after routes)
app.use(errorMiddleware);

export { app };
