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
  // intersection tracking below doesn't recompute "active" from a section
  // the scroll is only passing through and flash the slash back before it
  // reaches the clicked target.
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
    // A section is "active" once it crosses a thin reading line near the
    // top of the viewport. IntersectionObserver reports this directly from
    // real element geometry, so there's no scroll listener, no rAF
    // throttling, and no magic pixel threshold to keep in sync by hand.
    const isIntersecting = new Map<string, boolean>();

    // Only tracks organic scrolling. A click already knows its target and
    // sets `active` directly (see below), bypassing this entirely. That
    // split matters: a short trailing section can sit low enough on the
    // page that its top never nears the reading line no matter how far you
    // scroll, so geometry alone can't always tell "the user is looking at
    // the last section" apart from "the user clicked an earlier section
    // that happens to leave little further to scroll". Once we've hit the
    // bottom of the page with no click in flight, there's no such
    // ambiguity: the last section is unambiguously what's being read.
    const pickActive = () => {
      if (pendingRef.current) return;

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      const onScreen = sections.filter(({ id }) => isIntersecting.get(id));
      if (onScreen.length > 0) {
        // Normally only one section overlaps the thin band at a time; if
        // more than one briefly does (fast scroll), prefer the topmost.
        const topmost = onScreen.reduce((a, b) => {
          const aTop = document.getElementById(a.id)?.getBoundingClientRect().top ?? Infinity;
          const bTop = document.getElementById(b.id)?.getBoundingClientRect().top ?? Infinity;
          return aTop <= bTop ? a : b;
        });
        setActive(topmost.id);
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        pickActive();
        ticking = false;
      });
    };

    const clearPending = () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
      // Just hand tracking back to scroll-driven detection. Don't
      // recompute here: the section that was clicked stays active, which
      // is the whole point of the split above.
      pendingRef.current = null;
    };

    let observer: IntersectionObserver | undefined;
    const startTracking = () => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isIntersecting.set(entry.target.id, entry.isIntersecting);
          }
          pickActive();
        },
        // Shrink the viewport to a band from 15% to 30% down from the top.
        { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
      );
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer!.observe(el);
      });
      // IntersectionObserver only calls back when a section's intersection
      // state *changes*. Scrolling the last few pixels to the true bottom
      // of the page usually doesn't change any section's state (it was
      // already the only one crossing the reading line), so nothing would
      // otherwise re-run the atBottom check above right when it starts to
      // matter. This listener's only job is to catch that moment; it
      // doesn't do any of the section geometry work itself.
      window.addEventListener("scroll", handleScroll, { passive: true });
      // Modern browsers fire this once a (possibly smooth) scroll settles.
      window.addEventListener("scrollend", clearPending);
    };
    const stopTracking = () => {
      observer?.disconnect();
      observer = undefined;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", clearPending);
    };

    // This nav is hidden entirely below the mobile breakpoint (see
    // page.module.css), so there's nothing for the tracking above to
    // drive there. Watching 3 elements and one scroll listener is cheap,
    // but it's not free, and it's pure waste competing for main-thread
    // time on a phone mid-scroll for a nav the user can't even see. Only
    // run it above the breakpoint, toggling live across resizes and
    // orientation changes.
    const mobile = window.matchMedia("(max-width: 720px)");
    if (!mobile.matches) startTracking();
    const handleBreakpointChange = (e: MediaQueryListEvent) => {
      if (e.matches) stopTracking();
      else startTracking();
    };
    mobile.addEventListener("change", handleBreakpointChange);

    return () => {
      mobile.removeEventListener("change", handleBreakpointChange);
      stopTracking();
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
