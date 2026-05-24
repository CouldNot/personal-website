import styles from "./ExperienceCard.module.css";

export default function ExperienceCard() {
  return (
    <div className={styles.layout}>
      <div className={styles.placeholderIcon}></div>
      <div className={styles.infoStack}>
        <div className={styles.titleRow}>
          <div className={styles.titleSet}>
            <p>Apple</p>
          </div>
          <p className={styles.projectYear}>May 2025 — Present</p>
        </div>
        <p className={styles.role}>Software Engineer</p>
      </div>
    </div>
  );
}
