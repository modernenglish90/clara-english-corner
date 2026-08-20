"use client";

import { FormEvent, useState } from "react";

export default function StudentLogin() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/student-login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
    const result = await response.json();
    if (response.ok) window.location.assign("/daily-english/index.html");
    else setMessage(result.error ?? "Unable to sign in.");
    setLoading(false);
  }

  return <main className="access-page"><section className="access-card"><p className="access-eyebrow">CLARA ENGLISH CORNER</p><h1>Welcome back,<br /><em>speaker!</em></h1><p>Enter your full name exactly as Clara registered it. Then you can start practising.</p><form onSubmit={submit}><label htmlFor="student-name">Your full name</label><input id="student-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aisyah Ahmad" autoComplete="name" required />{message && <p className="access-error" role="alert">{message}</p>}<button type="submit" disabled={loading}>{loading ? "Checking…" : "Enter my English Corner →"}</button></form><a href="/admin/login">Teacher sign in</a></section><div className="access-art" aria-hidden="true"><img src="/daily-english/assets/clara-chibi-classroom.png" alt="" /></div></main>;
}
