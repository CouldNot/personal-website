"use client";

import { useEffect, useState } from "react";
import styles from "../../page.module.css";

const sections = [
  { id: "about", index: 1, label: "about" },
  { id: "projects", index: 2, label: "projects" },
  { id: "experience", index: 3, label: "experience" },
  { id: "writing", index: 4, label: "writing" },
];

export default function TableOfContents() {
  const [active, setActive] = useState("about");

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
    <nav className={styles.toc}>
      {sections.map(({ id, index, label }) => (
        <a
          key={id}
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
          {index} / {label}
        </a>
      ))}
    </nav>
  );
}
