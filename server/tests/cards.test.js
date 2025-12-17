const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Card = require("../models/Card");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("Cards API", () => {
  let token;
  let userId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await User.create({
      username: "cardUser",
      email: "card@test.com",
      password: hashedPassword
    });

    userId = user._id;

    token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // system card
    await Card.create({
      front: "hello",
      back: "שלום",
      explanation: "Greeting",
      level: 1,
      createdBy: "system"
    });
  });

  test("✅ Create card with valid data", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        front: "dog",
        back: "כלב",
        level: 2
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.card).toHaveProperty("front", "dog");
  });

  test("❌ Fail to create card without level", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        front: "cat",
        back: "חתול"
      });

    expect(res.statusCode).toBe(400);
  });

  test("❌ Fail to create card with invalid level", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        front: "bird",
        back: "ציפור",
        level: 20
      });

    expect(res.statusCode).toBe(400);
  });

  test("❌ Fail to create card without token", async () => {
    const res = await request(app)
      .post("/api/cards")
      .send({
        front: "tree",
        back: "עץ",
        level: 3
      });

    expect(res.statusCode).toBe(401);
  });

  test("✅ Get system cards and user cards only", async () => {
    await Card.create({
      front: "user word",
      back: "מילה",
      level: 3,
      createdBy: "user",
      createdByUser: userId
    });

    // card of another user
    const otherUser = await User.create({
      username: "other",
      email: "other@test.com",
      password: "123456"
    });

    await Card.create({
      front: "should not see",
      back: "אסור",
      level: 5,
      createdBy: "user",
      createdByUser: otherUser._id
    });

    const res = await request(app)
      .get("/api/cards")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // system + own
  });
});
