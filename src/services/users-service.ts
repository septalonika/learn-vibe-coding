import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { type RegisterInput, type LoginInput } from "../validators/user-validator";

export class UsersService {
  async registerUser(data: RegisterInput) {
    const { firstname, lastname, email, password } = data;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Insert user directly and handle potential unique constraint violation (email)
      const [newUser] = await db
        .insert(users)
        .values({
          firstname,
          lastname,
          email,
          password: hashedPassword,
        })
        .returning({
          id: users.id,
          firstname: users.firstname,
          lastname: users.lastname,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

      return newUser;
    } catch (error: any) {
      // 23505 is PostgreSQL error code for unique_violation
      // Drizzle/postgres.js might wrap the error in a DrizzleQueryError with the original error in .cause
      const pgCode = error.code || error.cause?.code;
      
      if (pgCode === "23505" || 
          error.message?.includes("23505") || 
          error.message?.includes("unique constraint") ||
          error.message?.includes("duplicate key")) {
        throw new Error("User already exists");
      }
      throw error;
    }
  }

  async loginUser(data: LoginInput) {
    const { email, password } = data;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("User not found");
    }

    // Generate token
    const token = crypto.randomUUID();

    // Save session
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return token;
  }

  async logoutUser(token: string) {
    // Optimized: Delete and check existence in one query
    const deletedSessions = await db
      .delete(sessions)
      .where(eq(sessions.token, token))
      .returning();

    if (deletedSessions.length === 0) {
      throw new Error("Unauthorized");
    }
  }

  async getCurrentUser(token: string) {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.token, token),
      with: {
        user: true,
      },
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    return {
      id: session.user.id,
      firstname: session.user.firstname,
      lastname: session.user.lastname,
      email: session.user.email,
      createdAt: session.user.createdAt,
    };
  }
}

export const usersService = new UsersService();
