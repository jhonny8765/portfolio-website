"use client";

import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { SITE, SERVICES } from "@/lib/content";

const SUBJECTS = [
  "General inquiry",
  ...SERVICES.map((s) => s.title),
  "Resume & portfolio site",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
    company: "", // honeypot — humans never see this
  });
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot filled → silently accept and drop.
    if (form.company) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    // No Supabase env (preview/demo) → simulate a round-trip.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes("placeholder")) {
      setTimeout(() => setStatus("success"), 900);
      return;
    }

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("contacts").insert([
        {
          name: form.name,
          email: form.email,
          service: form.subject,
          message: form.message,
        },
      ]);
      if (error) throw error;
      setStatus("success");
    } catch (err) {
      console.error("contact submit failed:", err);
      setStatus("error");
    }
  }

  const openAI = () => window.dispatchEvent(new CustomEvent("ask-ai-open"));

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <SectionHeading
          kicker="04 · start a project"
          title={
            <span id="contact-heading">
              Have an idea? <span className="text-gradient">Let&apos;s ship it</span>.
            </span>
          }
          sub="Tell me what you want to build — a website, an app, or a workflow that runs itself. I reply to every serious inquiry."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* left — context */}
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col gap-6">
              <div className="surface p-7">
                <div className="status-pill">
                  <span className="status-dot" aria-hidden="true" />
                  Currently accepting projects
                </div>
                <ul className="mt-5 space-y-3">
                  {SERVICES.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 text-sm text-muted">
                      <span className="mono text-[0.7rem] text-lilac">▸</span>
                      {s.title}
                    </li>
                  ))}
                </ul>
                <p className="mono mt-6 border-t border-line pt-5 text-[0.72rem] leading-relaxed text-faint">
                  <span className="mr-2 text-lilac">$</span>pricing: scoped per
                  requirement — describe the idea, get a real proposal
                </p>
              </div>

              <div className="surface p-7">
                <p className="mono text-[0.72rem] uppercase tracking-wider text-faint">
                  prefer async?
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={openAI}
                    className="btn btn-ghost btn-sm w-fit"
                  >
                    Ask My AI first
                  </button>
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm w-fit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.7a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13 13 0 0 0-7 0C4.3 1.6 3 2 3 2a5.5 5.5 0 0 0-.1 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5.2 3 6.4 6 6.7a4.8 4.8 0 0 0-1 3.2v4" />
                    </svg>
                    github.com/{SITE.handle}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* right — form */}
          <Reveal delay={160} className="lg:col-span-7">
            <div className="surface-raised h-full p-7 md:p-9">
              {status === "success" ? (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-mint/40 bg-mint/10 text-mint">
                    <Check size={26} aria-hidden="true" />
                  </span>
                  <h3 className="mono mt-6 text-lg text-ink">
                    200 OK — message sent
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    Thanks, {form.name || "friend"} — your message landed. Expect
                    a reply from Jhon Rey soon.
                  </p>
                  <button
                    onClick={() => {
                      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "", company: "" });
                      setStatus("idle");
                    }}
                    className="btn btn-ghost btn-sm mt-8"
                  >
                    send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate={false}>
                  <p className="mono mb-6 text-[0.72rem] text-faint">
                    fields marked <span className="text-lilac">*</span> are required
                  </p>

                  {/* honeypot */}
                  <div className="hp-field" aria-hidden="true">
                    <label htmlFor="company">Don&apos;t fill this out if you&apos;re human</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={set("company")}
                    />
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="mono mb-5 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-[0.8rem] text-red-300"
                    >
                      ERR_SEND_FAILED — something dropped. Please retry in a
                      moment.
                    </p>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="field-label">
                        name <span className="text-lilac">*</span>
                      </label>
                      <input
                        id="name"
                        required
                        autoComplete="name"
                        placeholder="Juan Dela Cruz"
                        value={form.name}
                        onChange={set("name")}
                        className="input-flat"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="field-label">
                        email <span className="text-lilac">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={set("email")}
                        className="input-flat"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="subject" className="field-label">
                      how can I help? <span className="text-lilac">*</span>
                    </label>
                    <select
                      id="subject"
                      value={form.subject}
                      onChange={set("subject")}
                      className="input-flat"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="message" className="field-label">
                      message <span className="text-lilac">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="What are we building? Rough scope, timeline, links — anything helps."
                      value={form.message}
                      onChange={set("message")}
                      className="input-flat resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn btn-primary mt-7 w-full disabled:opacity-60"
                    style={{ opacity: status === "submitting" ? 0.7 : undefined }}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                        transmitting…
                      </>
                    ) : (
                      <>
                        <Send size={15} aria-hidden="true" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
