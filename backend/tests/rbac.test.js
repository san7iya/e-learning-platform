const request = require("supertest");
const app = require("../app");
const pool = require("../services/db");

const runId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const password = "password123";

afterAll(async () => {
  await pool.end();
});

describe("RBAC on POST /courses", () => {
  it("denies a student attempting to create a course", async () => {
    const email = `rbac-student-${runId}@example.com`;
    const registerRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Student", email, password, role: "student" });

    const token = registerRes.body.token;

    const res = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Should Not Be Created" });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("denies course creation with no token at all", async () => {
    const res = await request(app)
      .post("/courses")
      .send({ title: "No Auth" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
