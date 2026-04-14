import { db } from "../db";
import { users } from "../db/schema";
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
}

export const usersService = new UsersService();
