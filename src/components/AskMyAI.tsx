"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { AI_FACTS, PROJECTS, SERVICES, SITE, STACK_ACTIVE } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* "Ask My AI" — a grounded, browser-only assistant.                   */
/* No API, no hallucination surface: it pattern-matches the visitor's  */
/* question and answers strictly from src/lib/content.ts — the same    */
/* source the page renders from.                                      */
/* ------------------------------------------------------------------ */

interface Message {
  role: "bot" | "user";
  text: string;
  cta?: "contact";
}

const SUGGESTIONS = [
  "What can you build for me?",
  "Show me your live projects",
  "How do you work?",
  "What does it cost?",
];

const projectLines = (p: (typeof PROJECTS)[number]) =>
  `• ${p.name} — ${p.tagline}. ${p.features[0].toLowerCase()}, ${p.features[1].toLowerCase()}. Stack: ${p.stack.join(", ")}. Try it: ${p.liveUrl}`;

function answerFor(input: string): Message {
  const q = input.toLowerCase();

  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("snake", "easter", "game"))
    return { role: "bot", text: AI_FACTS.snake };
  if (has("suki", "salon", "booking", "appointment"))
    return {
      role: "bot",
      text: [
        "SukiSuite is Jhon Rey's salon management SaaS — live right now:",
        projectLines(PROJECTS[0]),
        "It exists because salon owners were juggling appointments over chat and paper. It's a real deployed product, not a mockup.",
      ].join("\n"),
    };
  if (has("arena", "barangay", "tournament", "bracket", "sports"))
    return {
      role: "bot",
      text: [
        "Barangay Arena is a community tournament platform — also live:",
        projectLines(PROJECTS[1]),
        "It gives local organizers brackets and team management that used to live in group chats.",
      ].join("\n"),
    };
  if (has("project", "portfolio", "your work", "products", "apps", "built", "case stud", "proof"))
    return {
      role: "bot",
      text: [
        `Two products are live and publicly reachable:`,
        projectLines(PROJECTS[0]),
        projectLines(PROJECTS[1]),
        "Written case studies for both are on the roadmap — for now the live apps are the proof.",
      ].join("\n"),
    };
  if (has("automat", "n8n", "workflow", "zapier", "integrate", "integration"))
    return {
      role: "bot",
      text: [
        `Automation is one of the three core services. Jhon Rey connects your tools and removes repetitive work:`,
        ...SERVICES[1].bullets.map((b) => `• ${b}`),
        "If you tell me which tools you use, the contact form can scope it — I'll point you there.",
      ].join("\n"),
      cta: "contact",
    };
  if (has(" ai", "ai ", "chatbot", "rag", "agent", "gpt", "llm", "model"))
    return {
      role: "bot",
      text: [
        "AI is the thread through everything — including me, this little grounded assistant. For clients it means:",
        ...SERVICES[2].bullets.map((b) => `• ${b}`),
        `He's currently going deeper on: ${STACK_ACTIVE[0].toLowerCase()}, custom agents, and RAG architectures.`,
      ].join("\n"),
    };
  if (has("price", "cost", "rate", "how much", "budget", "bayad", "magkano"))
    return { role: "bot", text: AI_FACTS.pricing, cta: "contact" };
  if (has("how do you work", "process", "how you work", "timeline", "how long", "workflow for"))
    return { role: "bot", text: AI_FACTS.process };
  if (has("contact", "email", "reach", "message", "phone", "number"))
    return { role: "bot", text: AI_FACTS.contact, cta: "contact" };
  if (has("who", "about", "beginner", "experience", "background", "jhon", "intro"))
    return { role: "bot", text: AI_FACTS.about };
  if (has("service", "hire", "build me", "can you build", "website", "web site", "web app", "mvp", "what can you", "help me"))
    return {
      role: "bot",
      text: [
        "Three ways to work together:",
        ...SERVICES.map((s) => `• ${s.title} — ${s.description}`),
        "Every engagement ends with something deployed, not a deck. Describe your idea in the contact form and you'll get a scoped proposal.",
      ].join("\n"),
      cta: "contact",
    };
  if (has("stack", "tech", "tools", "language", "framework"))
    return {
      role: "bot",
      text: `Daily stack: ${STACK_ACTIVE.join(", ")}. Deeper AI next: agents, RAG, Python pipelines.`,
    };
  if (has("thank", "salamat", "cool", "nice", "awesome", "great"))
    return {
      role: "bot",
      text: "Glad this helped! If you'd like to start something, the contact form is the fastest route — I'll take you there.",
      cta: "contact",
    };
  if (has("hi", "hello", "hey", "yo", "kamusta", "good morning", "good afternoon"))
    return { role: "bot", text: AI_FACTS.greeting };
  if (has("location", "where", "philippine", "based"))
    return { role: "bot", text: `Jhon Rey is based in the ${SITE.location} (GMT+8) and works with clients remotely.` };

  return {
    role: "bot",
    text: "I only know what's on this page — projects, services, stack, and how to reach Jhon Rey. Try asking about his live products, what he can build for you, or pricing. For anything deeper, the contact form goes straight to him.",
    cta: "contact",
  };
}

/* ------------------------------- UI ------------------------------- */

export default function AskMyAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: AI_FACTS.greeting },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("ask-ai-open", onOpen);
    return () => window.removeEventListener("ask-ai-open", onOpen);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => () => {
    if (streamRef.current) clearInterval(streamRef.current);
  }, []);

  const respond = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);

    const reply = answerFor(text);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setTimeout(() => {
      setTyping(false);
      if (reduce) {
        setMessages((m) => [...m, reply]);
        return;
      }
      // stream the reply in
      setMessages((m) => [...m, { role: "bot", text: "" }]);
      let i = 0;
      streamRef.current = setInterval(() => {
        i += 3;
        const slice = reply.text.slice(0, i);
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { ...reply, text: slice };
          return next;
        });
        if (i >= reply.text.length && streamRef.current) {
          clearInterval(streamRef.current);
          streamRef.current = null;
        }
      }, 14);
    }, 750);
  };

  const goContact = () => {
    setOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderText = (text: string) =>
    text.split("\n").map((line, i) => {
      const linkMatch = line.match(/(https?:\/\/\S+)/);
      if (linkMatch) {
        const [url] = linkMatch;
        const [before, after] = line.split(url);
        return (
          <p key={i}>
            {before}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lilac underline decoration-lilac/40 underline-offset-2 hover:text-lilac-strong"
            >
              {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
            {after}
          </p>
        );
      }
      return <p key={i}>{line || "\u00A0"}</p>;
    });

  return (
    <>
      {/* floating trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask My AI — chat about projects and services"
          className="group fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-2xl bg-violet text-white shadow-[0_10px_36px_-8px_rgba(109,40,217,0.8)] transition-all duration-300 hover:-translate-y-1 hover:bg-violet-hover"
        >
          <span className="absolute inset-0 rounded-2xl border border-lilac/40 status-dot-ring" aria-hidden="true" />
          <Sparkles size={22} aria-hidden="true" />
          <span className="mono pointer-events-none absolute right-[4.4rem] whitespace-nowrap rounded-lg border border-line-strong bg-raised px-3 py-1.5 text-[0.72rem] text-muted opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100">
            ask my AI
          </span>
        </button>
      )}

      {/* panel */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:p-0"
          role="dialog"
          aria-modal="true"
          aria-label="Ask My AI chat"
        >
          <div
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="surface-raised relative flex h-[86dvh] w-full flex-col overflow-hidden sm:h-[560px] sm:w-[400px]">
            {/* header */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet font-mono text-xs font-bold text-white">
                JC
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">Jhon&apos;s AI</p>
                <p className="mono flex items-center gap-1.5 text-[0.66rem] text-faint">
                  <span className="status-dot h-1.5! w-1.5!" aria-hidden="true" />
                  grounded in this portfolio
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            {/* messages */}
            <div
              ref={listRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"} space-y-1.5`}
                >
                  {renderText(m.text)}
                  {m.cta && m.role === "bot" && m.text.length > 20 && (
                    <button onClick={goContact} className="btn btn-primary btn-sm mt-2">
                      Start a project →
                    </button>
                  )}
                </div>
              ))}
              {typing && (
                <div className="chat-bubble-bot w-fit">
                  <span className="typing-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              )}
            </div>

            {/* suggestions */}
            <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => respond(s)}
                  className="chip text-[0.68rem]! flex-none"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                respond(input);
              }}
              className="flex items-center gap-2 border-t border-line px-4 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, services, pricing…"
                aria-label="Your question"
                className="input-flat py-2.5! text-[0.82rem]!"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send question"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-violet text-white transition-all hover:bg-violet-hover disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>

            <p className="mono border-t border-line bg-obsidian/60 px-5 py-2 text-center text-[0.62rem] text-faint">
              demo assistant — runs 100% in your browser · answers only from this page
            </p>
          </div>
        </div>
      )}
    </>
  );
}
