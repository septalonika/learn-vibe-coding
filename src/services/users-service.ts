import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class UsersService {
  async registerUser(data: any) {
    const { firstname, lastname, email, password } = data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
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
  }

  async loginUser(data: any) {
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
}

export const usersService = new UsersService();
