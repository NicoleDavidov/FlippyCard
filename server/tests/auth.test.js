const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {

  const userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: "12345678"
  };

  test("Register new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect([201, 409]).toContain(res.statusCode);
  });

  test("Login returns token", async () => {
    // 👈 חשוב: נרשום משתמש כאן
    await request(app)
      .post("/api/auth/register")
      .send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
