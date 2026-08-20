"use client";

import { FormEvent, useState } from "react";

export default function TeacherLogin() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json();
    if (response.ok) window.location.assign("/admin"); else setMessage(result.error ?? "Unable to sign in.");
  }
  return <main className="access-page teacher-page"><section className="access-card"><p className="access-eyebrow">TEACHER CLARA ENGLISH CORNER</p><h1>Teacher<br /><em>dashboard</em></h1><p>Manage the active student name list safely.</p><form onSubmit={submit}><label htmlFor="teacher-password">Teacher password</label><input id="teacher-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />{message && <p className="access-error" role="alert">{message}</p>}<button type="submit">Sign in →</button></form><a href="/login">← Student sign in</a></section></main>;
}
