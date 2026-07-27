// Benchmarks GET /courses (courseService.getAllCourses) before and after adding
// an index on module.course_id, the join column used by every listing query
// (getAllCourses, getRecommendedCourses, getMyCourses all LEFT JOIN module on it,
// and none of them had an index on it before this benchmark).
//
// Measures two ways, on identical data, both returning the same result set:
//   A) DB-level:  EXPLAIN ANALYZE on the exact SQL from courseService.getAllCourses
//   B) App-level: performance.now() around the actual service function call
//      (same code path a real request hits — one query, one round trip either way;
//      this is NOT an N+1 case, so the round-trip *count* doesn't change, only
//      the execution time of that single query does)
//
// Requires benchmark/seed.js to have been run first.
//
// Usage: node benchmark/queryBenchmark.js

require("dotenv").config();
const pool = require("../services/db");
const courseService = require("../services/courseService");

const WARMUP_RUNS = 1;
const TIMED_RUNS = 10;
const PAGE_LIMIT = 10; // matches the real default page size used by GET /courses

// Exact query from courseService.getAllCourses, reproduced here so EXPLAIN ANALYZE
// runs against precisely the same SQL the app executes (no rewritten strawman).
const COURSES_QUERY = `
  SELECT c.course_id, c.title, c.description, c.duration_weeks, c.category,
         i.name AS instructor, COUNT(m.module_id)::int AS lessons_count
  FROM course c
  LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
  LEFT JOIN module m ON m.course_id = c.course_id
  WHERE $1::varchar IS NULL OR c.category = $1
  GROUP BY c.course_id, i.name
  ORDER BY c.course_id
  LIMIT $2 OFFSET $3
`;

function average(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

async function assertSeeded() {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM course WHERE title LIKE 'Benchmark Course %'`
  );
  if (rows[0].n < 1000) {
    console.error(
      `Only ${rows[0].n} benchmark courses found. Run "node benchmark/seed.js" first.`
    );
    process.exit(1);
  }
  return rows[0].n;
}

async function indexExists() {
  const { rows } = await pool.query(
    `SELECT 1 FROM pg_indexes WHERE tablename = 'module' AND indexname = 'idx_module_course_id'`
  );
  return rows.length > 0;
}

async function explainAnalyzeOnce() {
  const { rows } = await pool.query(
    `EXPLAIN (ANALYZE, FORMAT TEXT) ${COURSES_QUERY}`,
    [null, PAGE_LIMIT, 0]
  );
  const planText = rows.map((r) => r["QUERY PLAN"]).join("\n");
  const match = planText.match(/Execution Time: ([\d.]+) ms/);
  if (!match) throw new Error("Could not parse execution time from EXPLAIN ANALYZE output:\n" + planText);
  return parseFloat(match[1]);
}

async function appLevelOnce() {
  const start = performance.now();
  const result = await courseService.getAllCourses(null, { page: 1, limit: PAGE_LIMIT });
  const elapsed = performance.now() - start;
  return { elapsed, rowCount: result.courses.length };
}

async function measure(label, fn) {
  console.log(`\n--- ${label}: warmup (discarded) ---`);
  await fn();

  const times = [];
  for (let i = 1; i <= TIMED_RUNS; i++) {
    const t = await fn();
    const ms = typeof t === "number" ? t : t.elapsed;
    times.push(ms);
    console.log(`  run ${i}: ${ms.toFixed(2)} ms`);
  }
  const avg = average(times);
  console.log(`  average of ${TIMED_RUNS} runs: ${avg.toFixed(2)} ms`);
  return { times, avg };
}

async function runPhase(phaseName) {
  console.log(`\n=================== ${phaseName} ===================`);
  const db = await measure(`${phaseName} — DB-level (EXPLAIN ANALYZE)`, explainAnalyzeOnce);
  const app = await measure(`${phaseName} — App-level (service call)`, appLevelOnce);
  return { db, app };
}

function pctImprovement(before, after) {
  return ((before - after) / before) * 100;
}

async function main() {
  const seededCount = await assertSeeded();

  if (await indexExists()) {
    console.log("idx_module_course_id already exists — dropping it to measure a clean 'before' state.");
    await pool.query("DROP INDEX idx_module_course_id");
  }

  console.log(`Seeded benchmark courses: ${seededCount}`);
  const moduleCount = (
    await pool.query("SELECT COUNT(*)::int AS n FROM module")
  ).rows[0].n;
  console.log(`Total module rows: ${moduleCount}`);

  const before = await runPhase("BEFORE (no index on module.course_id)");

  console.log("\nCreating index: CREATE INDEX idx_module_course_id ON module(course_id);");
  await pool.query("CREATE INDEX idx_module_course_id ON module(course_id)");
  await pool.query("ANALYZE module");

  const after = await runPhase("AFTER (idx_module_course_id added)");

  const dbImprovement = pctImprovement(before.db.avg, after.db.avg);
  const appImprovement = pctImprovement(before.app.avg, after.app.avg);

  console.log("\n=================== SUMMARY ===================");
  console.log(`Rows: ${seededCount} courses, ${moduleCount} modules, page size ${PAGE_LIMIT}`);
  console.log(`DB-level (EXPLAIN ANALYZE):  before ${before.db.avg.toFixed(2)} ms -> after ${after.db.avg.toFixed(2)} ms  (${dbImprovement.toFixed(1)}% improvement)`);
  console.log(`App-level (service call):    before ${before.app.avg.toFixed(2)} ms -> after ${after.app.avg.toFixed(2)} ms  (${appImprovement.toFixed(1)}% improvement)`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
