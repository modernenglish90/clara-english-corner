"use client";

import { FormEvent, useEffect, useState } from "react";
type Student = { id: number; display_name: string };

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]); const [name, setName] = useState(""); const [message, setMessage] = useState("");
  async function load() { const response = await fetch("/api/admin/students"); if (response.ok) setStudents((await response.json()).students); }
  useEffect(() => { void load(); }, []);
  async function addStudent(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage(""); const response = await fetch("/api/admin/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) }); const data = await response.json(); if (!response.ok) setMessage(data.error ?? "Unable to add student."); else { setName(""); await load(); } }
  async function removeStudent(id: number, studentName: string) { if (!window.confirm(`Remove ${studentName} from the sign-in list?`)) return; await fetch(`/api/admin/students?id=${id}`, { method: "DELETE" }); await load(); }
  async function signOut() { await fetch("/api/logout", { method: "POST" }); window.location.assign("/admin/login"); }
  return <main className="admin-page"><header><div><p className="access-eyebrow">CLARA ENGLISH CORNER</p><h1>Student list</h1></div><button className="admin-logout" onClick={signOut}>Sign out</button></header><section className="admin-panel"><h2>Add a student</h2><form onSubmit={addStudent} className="add-student"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Student full name" required /><button type="submit">Add name</button></form>{message && <p className="access-error">{message}</p>}</section><section className="admin-panel"><div className="list-title"><h2>Active students</h2><span>{students.length} names</span></div><ul className="student-list">{students.map((student) => <li key={student.id}><span>{student.display_name}</span><button onClick={() => removeStudent(student.id, student.display_name)}>Remove</button></li>)}</ul></section></main>;
}
