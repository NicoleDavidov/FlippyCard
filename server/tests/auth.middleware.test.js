const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("Authorization Middleware", () => {
  let validToken;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await User.create({
      username: "authUser",
      email: "auth@test.com",
      password: hashedPassword
    });

    validToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("❌ Access protected route without token", async () => {
    const res = await request(app).get("/api/cards");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("❌ Access protected route with invalid token", async () => {
    const res = await request(app)
      .get("/api/cards")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });

  test("✅ Access protected route with valid token", async () => {
    const res = await request(app)
      .get("/api/cards")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
  });
});
