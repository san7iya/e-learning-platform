const request = require("supertest");
const app = require("../app");
const pool = require("../services/db");

// Unique per run so re-running the suite against the shared dev DB never
// collides with a previous run's rows (no separate test DB in this project).
const runId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const password = "password123";

afterAll(async () => {
  await pool.end();
});

describe("POST /register", () => {
  it("registers a new user with valid data", async () => {
    const res = await request(app)
      .post("/register")
      .send({ name: "Register Happy", email: `register-happy-${runId}@example.com`, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(`register-happy-${runId}@example.com`);
    expect(res.body.user.role).toBe("student");
    expect(res.body.user.password).toBeUndefined();
  });

  it("rejects registration with missing fields", async () => {
    const res = await request(app)
      .post("/register")
      .send({ email: `register-missing-${runId}@example.com` });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects registration with an invalid email format", async () => {
    const res = await request(app)
      .post("/register")
      .send({ name: "Bad Email", email: "not-an-email", password });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a duplicate email", async () => {
    const email = `register-dupe-${runId}@example.com`;
    await request(app).post("/register").send({ name: "First", email, password });

    const res = await request(app)
      .post("/register")
      .send({ name: "Second", email, password });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /login", () => {
  const email = `login-happy-${runId}@example.com`;

  beforeAll(async () => {
    await request(app).post("/register").send({ name: "Login Happy", email, password });
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/login").send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
  });

  it("rejects an incorrect password", async () => {
    const res = await request(app).post("/login").send({ email, password: "wrongpassword" });

    expect(res.body.success).toBe(false);
  });

  it("rejects a nonexistent email", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: `nobody-${runId}@example.com`, password });

    expect(res.body.success).toBe(false);
  });
});
