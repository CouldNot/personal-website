import styles from "./TopBar.module.css";
import { Icon } from "@iconify/react";

interface TopBarProps {
  cvUrl: string;
}

export default function TopBar({ cvUrl }: TopBarProps) {
  return (
    <header className={styles.header}>
      <span className={styles.wordmark}>dale dai</span>
      <span className={styles.linkrow}>
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          github <Icon icon="ph:arrow-up-right"></Icon>
        </a>
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          linkedin <Icon icon="ph:arrow-up-right"></Icon>
        </a>
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          goodreads <Icon icon="ph:arrow-up-right"></Icon>
        </a>
      </span>
    </header>
  );
}
