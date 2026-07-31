const request = require("supertest");
const app = require("../app");
const pool = require("../services/db");
const authService = require("../services/authService");
const { signToken } = require("../utils/jwt");

const runId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const password = "password123";

// org-admin isn't self-servable via POST /register, so tests provision it
// directly through the service layer and mint a token the same way login would.
async function registerOrgAdmin(name, email, orgId) {
  const user = await authService.registerUser(name, email, password, "org-admin");
  if (orgId != null) {
    await pool.query("UPDATE users SET org_id = $1 WHERE user_id = $2", [orgId, user.user_id]);
  }
  return signToken({ user_id: user.user_id, role: "org-admin" });
}

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

describe("RBAC on POST /enroll", () => {
  it("denies an instructor attempting to enroll in a course", async () => {
    const email = `rbac-instructor-enroll-${runId}@example.com`;
    const registerRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Instructor", email, password, role: "instructor" });

      
    const token = registerRes.body.token;

    const res = await request(app)
      .post("/enroll")
      .set("Authorization", `Bearer ${token}`)
      .send({ course_id: 1 });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("allows a student to enroll in a course", async () => {
    const email = `rbac-student-enroll-${runId}@example.com`;
    const registerRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Student Enroll", email, password, role: "student" });

    const token = registerRes.body.token;

    const res = await request(app)
      .post("/enroll")
      .set("Authorization", `Bearer ${token}`)
      .send({ course_id: 1 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

describe("RBAC on GET /my-taught-courses", () => {
  it("denies a student", async () => {
    const email = `rbac-student-taught-${runId}@example.com`;
    const registerRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Student Taught", email, password, role: "student" });

    const token = registerRes.body.token;

    const res = await request(app)
      .get("/my-taught-courses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("returns the instructor's own courses with an enrolled_count", async () => {
    const email = `rbac-instructor-taught-${runId}@example.com`;
    const registerRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Instructor Taught", email, password, role: "instructor" });

    const token = registerRes.body.token;

    const createRes = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "RBAC Instructor's Course" });

    const courseId = createRes.body.course.course_id;

    const res = await request(app)
      .get("/my-taught-courses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const course = res.body.courses.find(c => c.course_id === courseId);
    expect(course).toBeDefined();
    expect(course.enrolled_count).toBe(0);
  });

  it("denies with no token at all", async () => {
    const res = await request(app).get("/my-taught-courses");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("denies an org-admin (org-admins use /org-courses instead)", async () => {
    const token = await registerOrgAdmin("RBAC Org Admin Taught", `rbac-orgadmin-taught-${runId}@example.com`, 1);

    const res = await request(app)
      .get("/my-taught-courses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

describe("RBAC on GET /org-courses", () => {
  it("denies a student", async () => {
    const email = `rbac-student-org-${runId}@example.com`;
    const registerRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Student Org", email, password, role: "student" });

    const res = await request(app)
      .get("/org-courses")
      .set("Authorization", `Bearer ${registerRes.body.token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("denies an instructor", async () => {
    const email = `rbac-instructor-org-${runId}@example.com`;
    const registerRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Instructor Org", email, password, role: "instructor" });

    const res = await request(app)
      .get("/org-courses")
      .set("Authorization", `Bearer ${registerRes.body.token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("returns courses scoped to the admin's own organization", async () => {
    const email = `rbac-orgadmin-scoped-${runId}@example.com`;
    const token = await registerOrgAdmin("RBAC Org Admin Scoped", email, 1);

    // An instructor in org 1 creates a course; it should show up for this admin.
    // The instructor row is created lazily on first POST /courses and inherits
    // org_id from the user's own org_id, so that must be set beforehand.
    const instructorEmail = `rbac-instructor-for-org1-${runId}@example.com`;
    const instructorRes = await request(app)
      .post("/register")
      .send({ name: "RBAC Instructor For Org1", email: instructorEmail, password, role: "instructor" });
    await pool.query(
      "UPDATE users SET org_id = $1 WHERE user_id = $2",
      [1, instructorRes.body.user.user_id]
    );
    const createRes = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${instructorRes.body.token}`)
      .send({ title: "RBAC Org1 Course" });
    const courseId = createRes.body.course.course_id;

    const res = await request(app)
      .get("/org-courses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const course = res.body.courses.find(c => c.course_id === courseId);
    expect(course).toBeDefined();
    expect(course.enrolled_count).toBe(0);
  });

  it("returns an empty list when the admin has no organization assigned", async () => {
    const email = `rbac-orgadmin-noorg-${runId}@example.com`;
    const token = await registerOrgAdmin("RBAC Org Admin No Org", email, null);

    const res = await request(app)
      .get("/org-courses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.courses).toEqual([]);
  });

  it("denies with no token at all", async () => {
    const res = await request(app).get("/org-courses");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
