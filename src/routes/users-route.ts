import { Router } from "express";
import { usersService } from "../services/users-service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: "Bad Request",
      });
    }

    const newUser = await usersService.registerUser({
      firstname,
      lastname,
      email,
      password,
    });

    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(400).json({
        message: "User already exists",
        error: "Bad Request",
      });
    }
    console.error(error);
    res.status(500).json({
      message: "An unexpected error occurred",
      error: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: "Bad Request",
      });
    }

    const token = await usersService.loginUser({ email, password });

    res.status(200).json({
      message: "Login successfully",
      data: token,
    });
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(400).json({
        message: "User not found",
        error: "Bad Request",
      });
    }
    console.error(error);
    res.status(500).json({
      message: "An unexpected error occurred",
      error: "Internal Server Error",
    });
  }
});

router.get("/current", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
        error: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    const user = await usersService.getCurrentUser(token);

    res.status(200).json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return res.status(401).json({
        message: "Unauthorized",
        error: "Unauthorized",
      });
    }
    console.error(error);
    res.status(500).json({
      message: "An unexpected error occurred",
      error: "Internal Server Error",
    });
  }
});

export default router;
