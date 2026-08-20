import { readFile } from "node:fs/promises";
import postgres from "postgres";

const filename = process.argv[2];
if (!filename) throw new Error("Pass a JSON file containing an array of student names.");
if (!process.env.POSTGRES_URL) throw new Error("POSTGRES_URL is not configured.");

const names = JSON.parse(await readFile(filename, "utf8"));
if (!Array.isArray(names) || names.some((name) => typeof name !== "string")) throw new Error("The seed file must contain a string array.");

const sql = postgres(process.env.POSTGRES_URL, { prepare: false });
await sql`
  create table if not exists students (
    id bigint generated always as identity primary key,
    display_name text not null,
    normalized_name text not null unique,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
  )
`;

const rows = names.map((rawName) => ({
  display_name: rawName.trim().replace(/\s+/g, " "),
  normalized_name: rawName.trim().replace(/\s+/g, " ").toLocaleLowerCase("en"),
  is_active: true,
}));
await sql`
  insert into students ${sql(rows, "display_name", "normalized_name", "is_active")}
  on conflict (normalized_name) do update set display_name = excluded.display_name, is_active = true
`;

await sql.end({ timeout: 5 });
console.log(`Student list ready: ${names.length} names.`);
