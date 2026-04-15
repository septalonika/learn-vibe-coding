import express from "express";
import "dotenv/config";
import usersRouter from "./routes/users-route";
import { errorMiddleware } from "./middlewares/error-middleware";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/v1/users", usersRouter);

// Global Error Handler (Must be registered after routes)
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
