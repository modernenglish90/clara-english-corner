import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;

export function db() {
  if (!client) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) throw new Error("POSTGRES_URL is not configured.");
    client = postgres(connectionString, { prepare: false });
  }
  return client;
}

export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
}
