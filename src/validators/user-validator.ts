import { z } from "zod";

export const registerSchema = z.object({
  firstname: z.string().min(1, "Firstname is required").max(255, "Firstname must not exceed 255 characters"),
  lastname: z.string().min(1, "Lastname is required").max(255, "Lastname must not exceed 255 characters"),
  email: z.string().email("Invalid email format").max(255, "Email must not exceed 255 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password must not exceed 255 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email must not exceed 255 characters"),
  password: z.string().min(1, "Password is required").max(255, "Password must not exceed 255 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
