"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
};

/**
 * Scroll-reveal wrapper. Adds `.is-visible` once when the element enters
 * the viewport. Hidden state only applies when JS is running
 * (`[data-js]` gate in globals.css) so content is never lost if JS fails.
 * Reduced-motion users see content instantly (CSS guard).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      // Reveal slightly before the element is fully on screen.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
