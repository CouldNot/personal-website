"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../../page.module.css";

const sections = [
  { id: "about", index: 1, label: "about" },
  { id: "projects", index: 2, label: "projects" },
  { id: "experience", index: 3, label: "experience" },
];

export default function TableOfContents() {
  const [active, setActive] = useState("about");
  const navRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [slashTop, setSlashTop] = useState<number | null>(null);
  // Set while a click-triggered smooth scroll is in flight, so the
  // scroll listener doesn't recompute "active" from the stale scroll
  // position mid-flight and flash back to the previous item.
  const pendingRef = useRef<string | null>(null);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const activeIndex = sections.findIndex((s) => s.id === active);
    const activeRow = rowRefs.current[activeIndex];
    const nav = navRef.current;
    if (activeRow && nav) {
      const navRect = nav.getBoundingClientRect();
      const rowRect = activeRow.getBoundingClientRect();
      setSlashTop(rowRect.top - navRect.top);
    }
  }, [active]);

  useEffect(() => {
    const updateActive = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      let current = sections[0].id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          current = id;
        }
      }
      setActive(current);
    };

    // Scroll fires far more often than the browser repaints, so reading
    // layout (getBoundingClientRect) on every event causes forced reflows
    // that fight with the slash's transform transition and show up as
    // stutter. Coalesce to at most once per animation frame instead.
    let ticking = false;
    const handleScroll = () => {
      // A click already knows its target; don't let the stale scroll
      // position (read mid-animation) recompute a different "active"
      // and flash the slash back before the scroll catches up.
      if (pendingRef.current) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    const clearPending = () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
      if (pendingRef.current) {
        pendingRef.current = null;
        updateActive();
      }
    };

    updateActive();
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Modern browsers fire this once the (possibly smooth) scroll settles.
    window.addEventListener("scrollend", clearPending);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", clearPending);
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    };
  }, []);

  return (
    <nav className={styles.toc} ref={navRef}>
      {slashTop !== null && (
        <span
          className={styles.tocSlash}
          style={{ transform: `translateY(${slashTop}px)` }}
        >
          /
        </span>
      )}
      {sections.map(({ id, index, label }, i) => (
        <a
          key={id}
          ref={(el) => {
            rowRefs.current[i] = el;
          }}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            pendingRef.current = id;
            if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
            // Fallback in case "scrollend" doesn't fire (unsupported
            // browser, or the scroll gets interrupted).
            pendingTimeoutRef.current = setTimeout(() => {
              pendingRef.current = null;
            }, 1000);
            setActive(id);
            if (id === "about") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={`${styles.tocItem} ${active === id ? styles.tocItemActive : ""}`}
        >
          <span className={styles.tocNum}>{index}</span>
          <span className={styles.tocGap} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
