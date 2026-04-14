import express from "express";
import "dotenv/config";
import { db } from "./db";
import { users } from "./db/schema";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

import usersRouter from "./routes/users-route";

app.use("/api/v1/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
