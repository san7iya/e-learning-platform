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

describe("POST /register as org-admin", () => {
  it("creates a new organization and links the admin to it", async () => {
    const email = `register-orgadmin-${runId}@example.com`;
    const res = await request(app)
      .post("/register")
      .send({
        name: "Register OrgAdmin",
        email,
        password,
        role: "org-admin",
        org_name: `RBAC Test Org ${runId}`,
        org_location: "Nowhere"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe("org-admin");
    expect(res.body.user.org_id).toBeDefined();

    const orgResult = await pool.query(
      "SELECT name, location FROM organization WHERE org_id = $1",
      [res.body.user.org_id]
    );
    expect(orgResult.rows[0].name).toBe(`RBAC Test Org ${runId}`);
    expect(orgResult.rows[0].location).toBe("Nowhere");
  });

  it("rejects org-admin registration without an organization name", async () => {
    const res = await request(app)
      .post("/register")
      .send({ name: "No Org Name", email: `register-orgadmin-noname-${runId}@example.com`, password, role: "org-admin" });

    expect(res.status).toBe(400);
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
