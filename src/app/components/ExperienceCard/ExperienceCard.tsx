import styles from "./ExperienceCard.module.css";

interface ExperienceCardProps {
  company: string;
  dateRange: string;
  role: string;
}

export default function ExperienceCard({
  company,
  dateRange,
  role,
}: ExperienceCardProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.placeholderIcon}></div>
      <div className={styles.infoStack}>
        <div className={styles.titleRow}>
          <div className={styles.titleSet}>
            <p>{company}</p>
          </div>
          <p className={styles.projectYear}>{dateRange}</p>
        </div>
        <p className={styles.role}>{role}</p>
      </div>
    </div>
  );
}
