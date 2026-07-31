const request = require("supertest");
const app = require("../app");
const pool = require("../services/db");

const runId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const password = "password123";

afterAll(async () => {
  await pool.end();
});

async function registerInstructor(name, email) {
  const res = await request(app)
    .post("/register")
    .send({ name, email, password, role: "instructor" });
  return res.body.token;
}

describe("Course lessons (modules)", () => {
  it("creates a course with lessons in one request", async () => {
    const token = await registerInstructor("Modules Instructor", `modules-create-${runId}@example.com`);

    const res = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Course With Lessons",
        modules: [
          { title: "Intro", duration_minutes: 30 },
          { title: "Deep Dive", duration_minutes: "45" }
        ]
      });

    expect(res.status).toBe(201);
    const courseId = res.body.course.course_id;

    const detail = await request(app).get(`/courses/${courseId}`);
    expect(detail.body.course.modules).toHaveLength(2);
    expect(detail.body.course.modules.map(m => m.title)).toEqual(["Intro", "Deep Dive"]);
    expect(detail.body.course.modules[1].duration_minutes).toBe(45);
  });

  it("ignores lesson rows with a blank title", async () => {
    const token = await registerInstructor("Modules Instructor Blank", `modules-blank-${runId}@example.com`);

    const res = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Course With A Blank Lesson",
        modules: [{ title: "Real Lesson", duration_minutes: 10 }, { title: "   ", duration_minutes: 5 }]
      });

    const detail = await request(app).get(`/courses/${res.body.course.course_id}`);
    expect(detail.body.course.modules).toHaveLength(1);
    expect(detail.body.course.modules[0].title).toBe("Real Lesson");
  });

  it("replaces the lesson list on update when modules is provided", async () => {
    const token = await registerInstructor("Modules Instructor Edit", `modules-edit-${runId}@example.com`);

    const createRes = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Editable Course", modules: [{ title: "Old Lesson", duration_minutes: 20 }] });
    const courseId = createRes.body.course.course_id;

    await request(app)
      .patch(`/courses/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ modules: [{ title: "New Lesson", duration_minutes: 15 }] });

    const detail = await request(app).get(`/courses/${courseId}`);
    expect(detail.body.course.modules).toHaveLength(1);
    expect(detail.body.course.modules[0].title).toBe("New Lesson");
  });

  it("leaves existing lessons untouched when modules is omitted from an update", async () => {
    const token = await registerInstructor("Modules Instructor Omit", `modules-omit-${runId}@example.com`);

    const createRes = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Untouched Course", modules: [{ title: "Keep Me", duration_minutes: 20 }] });
    const courseId = createRes.body.course.course_id;

    await request(app)
      .patch(`/courses/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Just updating the description" });

    const detail = await request(app).get(`/courses/${courseId}`);
    expect(detail.body.course.modules).toHaveLength(1);
    expect(detail.body.course.modules[0].title).toBe("Keep Me");
  });
});
