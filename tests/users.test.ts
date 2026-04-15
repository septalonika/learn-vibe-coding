import { describe, expect, it, beforeEach } from "bun:test";
import request from "supertest";
import { app } from "../src/app";
import { clearDatabase, createTestUser, getTestToken } from "./utils";

describe("Users API", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/v1/users (Registration)", () => {
    it("should register a new user successfully", async () => {
      const response = await createTestUser(app);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.email).toBe("john@example.com");
    });

    it("should fail to register with an existing email", async () => {
      await createTestUser(app);

      const response = await request(app)
        .post("/api/v1/users")
        .send({
          firstname: "Jane",
          lastname: "Doe",
          email: "john@example.com",
          password: "password456",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });

    it("should fail with validation errors for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/users")
        .send({
          firstname: "",
          lastname: "Doe",
          email: "invalid-email",
          password: "123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body).toHaveProperty("error");
    });

    it("should fail when input exceeds 255 characters", async () => {
      const longString = "a".repeat(256);
      const response = await request(app)
        .post("/api/v1/users")
        .send({
          firstname: longString,
          lastname: "Doe",
          email: "john@example.com",
          password: "password123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
    });
  });

  describe("POST /api/v1/users/login", () => {
    beforeEach(async () => {
      await createTestUser(app);
    });

    it("should login successfully and return a token", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "john@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successfully");
      expect(typeof response.body.data).toBe("string");
    });

    it("should fail to login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User not found");
    });

    it("should fail to login with incorrect password", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "john@example.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User not found");
    });

    it("should fail with validation error for bad payload", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "not-an-email",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
    });
  });

  describe("GET /api/v1/users/current", () => {
    let token: string;

    beforeEach(async () => {
      await createTestUser(app);
      token = await getTestToken(app);
    });

    it("should get current user with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/users/current")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User found");
      expect(response.body.data.email).toBe("john@example.com");
    });

    it("should fail without token", async () => {
      const response = await request(app)
        .get("/api/v1/users/current");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should fail with invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/users/current")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });

  describe("DELETE /api/v1/users/logout", () => {
    let token: string;

    beforeEach(async () => {
      await createTestUser(app);
      token = await getTestToken(app);
    });

    it("should logout successfully", async () => {
      const response = await request(app)
        .delete("/api/v1/users/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout success");

      const currentResponse = await request(app)
        .get("/api/v1/users/current")
        .set("Authorization", `Bearer ${token}`);
      expect(currentResponse.status).toBe(401);
    });

    it("should fail to logout without token", async () => {
      const response = await request(app)
        .delete("/api/v1/users/logout");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should fail to logout with invalid token", async () => {
      const response = await request(app)
        .delete("/api/v1/users/logout")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });
});
