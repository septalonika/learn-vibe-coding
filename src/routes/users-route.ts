import { Router } from "express";
import { userController } from "../controllers/user-controller";
import { validateRequest } from "../middlewares/validate-middleware";
import { registerSchema, loginSchema } from "../validators/user-validator";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.post("/", validateRequest(registerSchema), userController.register);
router.post("/login", validateRequest(loginSchema), userController.login);
router.get("/current", authMiddleware, userController.getCurrentUser);
router.delete("/logout", authMiddleware, userController.logout);

export default router;
