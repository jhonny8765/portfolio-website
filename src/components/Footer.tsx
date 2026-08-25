"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/content";

function GithubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.7a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13 13 0 0 0-7 0C4.3 1.6 3 2 3 2a5.5 5.5 0 0 0-.1 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5.2 3 6.4 6 6.7a4.8 4.8 0 0 0-1 3.2v4" />
    </svg>
  );
}

export default function Footer() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="border-t border-line">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mono text-[0.78rem] text-faint">
            {SITE.handle}/portfolio-website · v2.0 — rebuilt on the{" "}
            <span className="text-lilac">Signal</span> system
          </p>
          <p className="mono mt-2 text-[0.72rem] text-faint">
            © {new Date().getFullYear()} {SITE.name} · {SITE.location} · local
            time {time} MNL
          </p>
        </div>

        <div className="flex items-center gap-5">
          <p className="mono hidden text-[0.72rem] text-faint sm:block">
            <kbd className="rounded border border-line-strong bg-raised px-1.5 py-0.5 text-[0.68rem] text-muted">
              ⌘K
            </kbd>{" "}
            shortcuts · try <span className="text-lilac">snake</span>
          </p>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-lilac-strong"
          >
            <GithubIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
