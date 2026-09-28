# Mistakes

Record meaningful bugs or recurring misconceptions. Preserve the original reasoning.

<!--
Template — duplicate for each new entry:

## YYYY-MM-DD: Short title

- **Problem:**
- **Mistake:**
- **Original mental model:**
- **Correct mental model:**
- **Category:**
- **Prevention:**
- **Follow-up exercise:**
-->

## 2026-09-27: Prisma 7 no longer loads `.env` — dotenv must be explicit

- **Problem:**
  After the Prisma 6 → 7 upgrade, Prisma CLI commands that actually need `DATABASE_URL` failed even though it was set in `apps/backend/.env`:

  ```
  $ npx prisma migrate status
  Error: The datasource.url property is required in your Prisma config file
  when using prisma migrate status.
  ```

  `datasource.url` *was* declared, as `url: process.env.DATABASE_URL` in `prisma7.config.ts`. The error blamed the config file rather than the missing env loader, which pointed the investigation at the wrong file.

- **Mistake:**
  Treating `import 'dotenv/config'` at the top of the generated `prisma7.config.ts` as redundant boilerplate — the kind of auto-generated import you delete while tidying — on the assumption that the Prisma CLI still loads `.env` itself, as it did in v6.

- **Original mental model:**
  "Prisma has always read the `.env` file in the project directory automatically; that's part of what the CLI does. So `process.env.DATABASE_URL` will be populated by the time `defineConfig` evaluates, with or without that import line. The `// npm install --save-dev prisma dotenv` comment is just generated scaffolding noise."

- **Correct mental model:**
  Since Prisma ORM 7.0.0 the CLI does **not** load any `.env` file by default — loading environment variables is explicitly the caller's job. `import 'dotenv/config'` *is* the loader, not a convenience wrapper around one.

  Removing it leaves `process.env.DATABASE_URL` as `undefined` inside `prisma7.config.ts`, so `datasource.url` becomes `undefined` — and Prisma reports that as "the property is required," which does not match the actual cause.

  The `env()` helper from `prisma/config` does **not** replace the import either; it only reads `process.env` with type safety and still requires a separate loader to populate it.

- **Category:**
  Framework major-version upgrade — a silently removed default, combined with an error message that describes the symptom rather than the cause.

- **Prevention:**
  - Keep `import 'dotenv/config'` in generated `prisma*.config.ts` files; treat it as load-bearing. Verify with the docs or a test before deleting any generated import.
  - Pick the verifying command carefully. `npx prisma validate` checks schema syntax and passes even with dotenv removed, so it is **not** evidence that the env loaded. `npx prisma migrate status` reads `datasource.url` and does exercise it.
  - When an error message names a property that plainly exists in the source, distrust the message and print the actual value (`console.log(process.env.DATABASE_URL)` from inside the config file) before restructuring anything.
  - Remember that each env consumer has its own loader and cwd: the Prisma CLI reads `.env` via `prisma7.config.ts`, while NestJS reads it via `ConfigModule.forRoot` in `app.module.ts`. One working loader never implies the other works.

- **Follow-up exercise:**
  Remove `import 'dotenv/config'` from `apps/backend/prisma7.config.ts`, then run `prisma validate`, `prisma migrate status`, and `prisma db pull`. **Predict first** which fail and what each reports — specifically, why does `validate` succeed? Then restore the file and explain why `migrate status` claims `datasource.url` is missing when the line is present.

  Follow-up: run `npx prisma migrate status` from a different working directory (e.g. the monorepo root) and observe that `import 'dotenv/config'` resolves `.env` relative to `process.cwd()`, not to the config file's location.

---

**Note:** from Prisma 7.10, `prisma init` generates `prisma7.config.ts` rather than `prisma.config.ts` so it cannot clash with the Prisma 8 config format (which only accepts `prisma.config.ts`). The CLI discovers either name. Don't mistake the `7` in the filename for something you need to fix.
