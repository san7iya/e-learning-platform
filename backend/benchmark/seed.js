// Seeds (or removes) a large batch of benchmark-only data so query performance
// can be measured at a realistic scale. All rows are clearly namespaced
// ("Benchmark Instructor %", "Benchmark Course %") so they never mix with
// real seed.sql data and can be cleanly removed with --reset.
//
// Usage:
//   node benchmark/seed.js          seed (skips if already seeded)
//   node benchmark/seed.js --reset  delete benchmark rows, then re-seed
//   node benchmark/seed.js --clean  delete benchmark rows only, no re-seed

require("dotenv").config();
const pool = require("../services/db");

const N_INSTRUCTORS = 250;
const N_COURSES = 3000;
const CATEGORIES = [
  "Development", "Design", "Business", "Data Science",
  "Marketing", "IT & Software", "Personal Development", "Photography",
];

async function reset() {
  console.log("Removing existing benchmark data...");
  await pool.query(
    `DELETE FROM module WHERE course_id IN (SELECT course_id FROM course WHERE title LIKE 'Benchmark Course %')`
  );
  await pool.query(`DELETE FROM course WHERE title LIKE 'Benchmark Course %'`);
  await pool.query(`DELETE FROM instructor WHERE name LIKE 'Benchmark Instructor %'`);
}

async function seed() {
  const existing = await pool.query(
    `SELECT COUNT(*)::int AS n FROM course WHERE title LIKE 'Benchmark Course %'`
  );
  if (existing.rows[0].n > 0) {
    console.log(`Already seeded (${existing.rows[0].n} benchmark courses found). Use --reset to re-seed.`);
    return;
  }

  console.log(`Inserting ${N_INSTRUCTORS} instructors...`);
  await pool.query(
    `INSERT INTO instructor (name, bio)
     SELECT 'Benchmark Instructor ' || gs, 'Bio for instructor ' || gs
     FROM generate_series(1, $1) gs`,
    [N_INSTRUCTORS]
  );

  console.log(`Inserting ${N_COURSES} courses across ${CATEGORIES.length} categories...`);
  await pool.query(
    `WITH benchmark_instructors AS (
       SELECT instructor_id, row_number() OVER (ORDER BY instructor_id) AS rn
       FROM instructor
       WHERE name LIKE 'Benchmark Instructor %'
     )
     INSERT INTO course (title, description, duration_weeks, instructor_id, category)
     SELECT
       'Benchmark Course ' || gs,
       'Auto-generated benchmark course ' || gs,
       (floor(random() * 12) + 1)::int,
       (SELECT instructor_id FROM benchmark_instructors WHERE rn = ((gs - 1) % $1) + 1),
       ($2::text[])[(floor(random() * array_length($2::text[], 1)) + 1)::int]
     FROM generate_series(1, $3) gs`,
    [N_INSTRUCTORS, CATEGORIES, N_COURSES]
  );

  console.log("Inserting modules (3-8 per benchmark course)...");
  const moduleResult = await pool.query(
    `INSERT INTO module (course_id, title, duration_minutes)
     SELECT c.course_id, 'Module ' || gs.n, (floor(random() * 30) + 10)::int
     FROM course c
     CROSS JOIN LATERAL generate_series(1, 3 + floor(random() * 6)::int) AS gs(n)
     WHERE c.title LIKE 'Benchmark Course %'
     RETURNING module_id`
  );

  const counts = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM course WHERE title LIKE 'Benchmark Course %') AS courses,
       (SELECT COUNT(*)::int FROM instructor WHERE name LIKE 'Benchmark Instructor %') AS instructors,
       (SELECT COUNT(*)::int FROM module m JOIN course c ON m.course_id = c.course_id WHERE c.title LIKE 'Benchmark Course %') AS modules`
  );

  console.log("Seed complete:");
  console.log(counts.rows[0]);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--clean")) {
    await reset();
    await pool.end();
    console.log("Benchmark data removed.");
    return;
  }
  if (args.includes("--reset")) {
    await reset();
  }
  await seed();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
