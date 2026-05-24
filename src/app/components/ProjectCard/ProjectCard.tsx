import styles from "./ProjectCard.module.css";

export default function ProjectCard() {
  return (
    <div className={styles.layout}>
      <div className={styles.placeholderIcon}></div>
      <div className={styles.infoStack}>
        <div className={styles.titleRow}>
          <div className={styles.titleSet}>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              OpenClaw
            </a>
            <span className={styles.projectDescription}>•</span>
            <p className={styles.projectDescription}>Personal AI Assistant</p>
          </div>
          <p className={styles.projectYear}>2026</p>
        </div>
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className={styles.descriptionRow}>
            <span>—</span>
            <p>lorem ipsum</p>
          </div>
        ))}
      </div>
    </div>
  );
}
