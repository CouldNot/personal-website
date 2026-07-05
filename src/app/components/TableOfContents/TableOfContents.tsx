"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "../../page.module.css";

const sections = [
  { id: "about", index: 1, label: "about" },
  { id: "projects", index: 2, label: "projects" },
  { id: "experience", index: 3, label: "experience" },
  { id: "writing", index: 4, label: "writing" },
];

export default function TableOfContents() {
  const [active, setActive] = useState("about");
  const navRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [slashTop, setSlashTop] = useState<number | null>(null);

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
    const handleScroll = () => {
      let current = sections[0].id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          current = id;
        }
      }
      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={styles.toc} ref={navRef}>
      {slashTop !== null && (
        <span className={styles.tocSlash} style={{ top: slashTop }}>
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
