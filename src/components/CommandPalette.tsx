"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Command,
  CornerDownLeft,
  ArrowUp,
  Sparkles,
  Gamepad2,
  House,
  FolderOpen,
  Wrench,
  Layers,
  Mail,
  ExternalLink,
} from "lucide-react";
import { PROJECTS, SITE } from "@/lib/content";

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ size?: number }>;
  keywords: string;
  action: () => void;
  external?: boolean;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpenEvt = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette-open", onOpenEvt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette-open", onOpenEvt);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      setQuery("");
      setSelected(0);
      inputRef.current?.focus();
    }, 40);
    return () => clearTimeout(t);
  }, [open]);

  const close = () => setOpen(false);

  const go = (id: string) => () => {
    close();
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    );
  };

  const items = useMemo<Item[]>(
    () => [
      { id: "top", label: "Go to top", hint: "section", icon: House, keywords: "home start hero", action: go("top") },
      { id: "work", label: "Go to Proof of Work", hint: "section", icon: FolderOpen, keywords: "projects portfolio products", action: go("work") },
      { id: "services", label: "Go to Services", hint: "section", icon: Wrench, keywords: "hire build", action: go("services") },
      { id: "stack", label: "Go to Tech Arsenal", hint: "section", icon: Layers, keywords: "tools technologies", action: go("stack") },
      { id: "contact", label: "Go to Contact", hint: "section", icon: Mail, keywords: "email message hire form", action: go("contact") },
      {
        id: "ask-ai",
        label: "Ask My AI",
        hint: "action",
        icon: Sparkles,
        keywords: "chat assistant question bot",
        action: () => {
          close();
          setTimeout(() => window.dispatchEvent(new CustomEvent("ask-ai-open")), 120);
        },
      },
      {
        id: "suki",
        label: `Open ${PROJECTS[0].name} (live)`,
        hint: "external",
        icon: ExternalLink,
        keywords: "salon saas booking suki",
        external: true,
        action: () => window.open(PROJECTS[0].liveUrl, "_blank", "noopener"),
      },
      {
        id: "arena",
        label: `Open ${PROJECTS[1].name} (live)`,
        hint: "external",
        icon: ExternalLink,
        keywords: "barangay tournament bracket sports",
        external: true,
        action: () => window.open(PROJECTS[1].liveUrl, "_blank", "noopener"),
      },
      {
        id: "github",
        label: "Open GitHub profile",
        hint: "external",
        icon: ExternalLink,
        keywords: "code repos jhonny8765",
        external: true,
        action: () => window.open(SITE.github, "_blank", "noopener"),
      },
      {
        id: "snake",
        label: "Play Snake",
        hint: "easter egg",
        icon: Gamepad2,
        keywords: "game retro fun classic hidden",
        action: () => {
          close();
          setTimeout(() => window.dispatchEvent(new CustomEvent("snake-open")), 120);
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.keywords.includes(q)
    );
  }, [items, query]);

  // Reset selection whenever the query changes (in the handler, not an effect)
  const onQueryChange = (value: string) => {
    setQuery(value);
    setSelected(0);
  };

  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  const run = (item: Item) => {
    setOpen(false);
    item.action();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div className="surface-raised relative w-full max-w-lg overflow-hidden rounded-2xl!">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Command size={16} className="text-lilac" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((s) => Math.min(s + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter" && filtered[selected]) {
                e.preventDefault();
                run(filtered[selected]);
              }
            }}
            placeholder="Type a command or search… (try “snake”)"
            aria-label="Search commands"
            className="mono w-full bg-transparent text-[0.88rem] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="mono rounded border border-line-strong bg-obsidian px-1.5 py-0.5 text-[0.62rem] text-faint">
            esc
          </kbd>
        </div>

        <ul ref={listRef} className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="mono px-4 py-6 text-center text-[0.8rem] text-faint">
              no matching command
            </li>
          )}
          {filtered.map((item, i) => (
            <li key={item.id}>
              <button
                data-selected={i === selected}
                className="palette-item mono flex w-full items-center gap-3 rounded-lg border border-transparent px-3.5 py-2.5 text-left text-[0.82rem] text-muted transition-colors hover:text-ink"
                onMouseEnter={() => setSelected(i)}
                onClick={() => run(item)}
              >
                <item.icon size={15} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[0.62rem] uppercase tracking-wider text-faint">
                  {item.hint}
                </span>
                {i === selected && (
                  <CornerDownLeft size={13} className="text-lilac" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="mono flex items-center gap-4 border-t border-line px-5 py-2.5 text-[0.62rem] text-faint">
          <span className="flex items-center gap-1">
            <ArrowUp size={10} aria-hidden="true" />↓ navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft size={10} aria-hidden="true" /> run
          </span>
        </div>
      </div>
    </div>
  );
}
