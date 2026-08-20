"use client";

import { useMemo, useState } from "react";

type Question = { category: string; part: string; title: string; prompt: string; points: string[]; sample: string };

const questions: Question[] = [
  { category: "Lifestyle", part: "Part 2", title: "A healthy habit", prompt: "Describe one healthy habit that you practise every day.", points: ["what the habit is", "when you do it", "why it is important"], sample: "I would like to talk about drinking enough water. I keep a bottle on my desk and drink water throughout the day. This simple habit helps me stay focused and energetic, especially during lessons." },
  { category: "Technology", part: "Part 3", title: "Technology in school", prompt: "How can technology make learning more effective?", points: ["give your opinion", "explain one reason", "give an example"], sample: "In my opinion, technology can make learning more effective because information is easier to access. For example, students can watch a short video to understand a difficult science topic. Besides that, online quizzes give us feedback immediately." },
  { category: "Community", part: "Part 3", title: "Helping the community", prompt: "Why should teenagers take part in community activities?", points: ["state your view", "give benefits", "suggest an activity"], sample: "I think teenagers should take part in community activities because they learn to care about other people. For instance, they can help to clean a park or collect food for families in need. It also teaches teamwork and responsibility." },
  { category: "Travel", part: "Part 2", title: "A memorable trip", prompt: "Talk about a place you would like to visit.", points: ["name the place", "say who you would go with", "explain why you want to go"], sample: "I would like to visit Langkawi with my family. We could enjoy the beach, try local food and take photos together. I want to go there because it would be a relaxing break after a busy school term." },
  { category: "Environment", part: "Part 3", title: "Reducing waste", prompt: "What can schools do to reduce plastic waste?", points: ["suggest an idea", "explain how it works", "say why it matters"], sample: "Schools can encourage students to bring reusable bottles and lunch containers. They can also place recycling bins in every block. This matters because small daily actions can reduce the amount of rubbish sent to landfills." },
  { category: "Hobbies", part: "Part 2", title: "A hobby you enjoy", prompt: "Describe a hobby that helps you relax.", points: ["what it is", "how often you do it", "how it makes you feel"], sample: "One hobby that helps me relax is listening to music. I usually do it after I finish my homework. It helps me feel calm, and it gives me a short break before I start another task." },
];

const frameworks = [
  ["Part 2", "Personal response", ["I would like to talk about…", "The first thing I want to mention is…", "For example,…", "That is why it is meaningful to me."]],
  ["Part 3", "Opinion response", ["In my opinion,…", "One reason is that…", "Besides that,…", "Therefore, I think…"]],
  ["HOTS", "Balanced response", ["I partly agree because…", "This can affect…", "However, we should also…", "In conclusion,…"]],
] as const;

export default function Home() {
  const [active, setActive] = useState<Question | null>(null);
  const [filter, setFilter] = useState("All");
  const [topic, setTopic] = useState("a healthy lifestyle");
  const [reason, setReason] = useState("it keeps us fit and active");
  const [example, setExample] = useState("students can exercise three times a week");
  const [showSample, setShowSample] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const categories = ["All", ...new Set(questions.map((q) => q.category))];
  const shown = useMemo(() => filter === "All" ? questions : questions.filter((q) => q.category === filter), [filter]);
  const answer = `In my opinion, ${topic} is important because ${reason}. For example, ${example}. Besides that, it can make a positive difference in our daily lives. Therefore, I think we should take this seriously.`;
  const speak = (text: string) => { if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); } };
  const startTimer = () => { setSeconds(60); const timer = window.setInterval(() => setSeconds((v) => { if (v <= 1) { window.clearInterval(timer); return 0; } return v - 1; }), 1000); };
  const open = (q: Question) => { setActive(q); setShowSample(false); setSeconds(60); };

  return <main>
    <section className="hero">
      <div className="nav"><a className="brand" href="#top">clara<span>english</span>corner</a><a href="#practice">Practice</a><a href="#builder">Answer Builder</a><button onClick={() => open(questions[Math.floor(Math.random() * questions.length)])}>Random question ↗</button></div>
      <div className="hero-grid" id="top">
        <div><p className="eyebrow">SPM SPEAKING PRACTICE</p><h1>Speak with clarity.<br/><em>Shine</em> with confidence.</h1><p className="intro">A friendly practice corner for Malaysian students: real speaking prompts, strong answer frames and gentle guidance whenever you get stuck.</p><div className="hero-actions"><a className="primary" href="#practice">Start practising <span>→</span></a><a className="text-link" href="#builder">Build my answer</a></div></div>
        <div className="hero-card"><p className="card-label">TODAY&apos;S SPEAKING TIP</p><div className="speech-mark">“</div><h2>Don&apos;t rush. Give one idea, explain it, then add an example.</h2><div className="tip-footer"><span>Clara&apos;s 3-step rule</span><b>IDEA · WHY · EXAMPLE</b></div></div>
      </div>
      <div className="stats"><div><b>40+</b><span>practice prompts</span></div><div><b>3</b><span>answer frameworks</span></div><div><b>1</b><span>braver speaker</span></div></div>
    </section>

    <section className="section practice" id="practice"><div className="section-title"><div><p className="eyebrow">QUESTION BANK</p><h2>Find your next <em>speaking</em> prompt.</h2></div><p>Pick a card, plan your ideas, then speak out loud. There is no perfect answer—only a clearer next one.</p></div>
      <div className="filters">{categories.map((category) => <button key={category} className={filter === category ? "selected" : ""} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <div className="question-grid">{shown.map((q) => <article className="question-card" key={q.title}><div className="card-top"><span>{q.part}</span><small>{q.category}</small></div><h3>{q.title}</h3><p>{q.prompt}</p><button onClick={() => open(q)}>Practise this →</button></article>)}</div>
    </section>

    <section className="section builder-section" id="builder"><div className="section-title"><div><p className="eyebrow">ANSWER BUILDER</p><h2>Turn your thoughts into <em>flowing English.</em></h2></div><p>Use this as a starting point. Change the details to make it sound like you.</p></div>
      <div className="builder"><div className="fields"><label>My topic<input value={topic} onChange={(e) => setTopic(e.target.value)} /></label><label>My main reason<input value={reason} onChange={(e) => setReason(e.target.value)} /></label><label>My example<input value={example} onChange={(e) => setExample(e.target.value)} /></label></div><div className="answer"><p className="card-label">YOUR SPEAKING STARTER</p><p>{answer}</p><button onClick={() => speak(answer)}>▶ Listen to a model reading</button></div></div>
      <div className="framework-grid">{frameworks.map(([tag, heading, lines]) => <article key={tag}><span>{tag}</span><h3>{heading}</h3>{lines.map((line, i) => <p key={line}><b>{i + 1}.</b> {line}</p>)}</article>)}</div>
    </section>

    <section className="confidence"><p className="eyebrow">WHEN YOU FEEL STUCK</p><h2>You&apos;re allowed to pause.<br/>Use a bridge and continue.</h2><div>{["Could you repeat the question, please?", "Let me think about it for a moment.", "I am not sure of the exact word, but…", "Besides that, I would also like to add that…"].map((line) => <button key={line} onClick={() => speak(line)}><span>▶</span>{line}</button>)}</div></section>
    <footer><a className="brand" href="#top">clara<span>english</span>corner</a><p>Small steps. Stronger voice.</p></footer>

    {active && <div className="modal-backdrop" role="presentation" onMouseDown={() => setActive(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="prompt-title" onMouseDown={(e) => e.stopPropagation()}><button className="close" onClick={() => setActive(null)} aria-label="Close">×</button><p className="eyebrow">{active.part} · {active.category}</p><h2 id="prompt-title">{active.prompt}</h2><div className="points"><p>Include these ideas:</p><ul>{active.points.map((point) => <li key={point}>{point}</li>)}</ul></div><div className="modal-actions"><button className="primary" onClick={() => speak(active.prompt)}>▶ Listen to question</button><button className="outline" onClick={() => setShowSample(!showSample)}>{showSample ? "Hide model answer" : "Show a model answer"}</button></div>{showSample && <div className="sample"><p className="card-label">MODEL ANSWER</p><p>{active.sample}</p><button onClick={() => speak(active.sample)}>▶ Listen</button></div>}<div className="timer"><b>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</b><span>your practice time</span><button onClick={startTimer}>Start 1-minute timer</button></div></section></div>}
  </main>;
}
