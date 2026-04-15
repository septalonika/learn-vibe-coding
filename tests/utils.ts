import { sql } from "drizzle-orm";
import { db } from "../src/db";
import request from "supertest";
import { Express } from "express";

export async function clearDatabase() {
  const tables = ["sessions", "users"];
  
  for (const table of tables) {
    await db.execute(sql.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`));
  }
}

export async function createTestUser(app: Express) {
  return await request(app)
    .post("/api/v1/users")
    .send({
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "password123",
    });
}

export async function getTestToken(app: Express) {
  const response = await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "john@example.com",
      password: "password123",
    });
  return response.body.data;
}
