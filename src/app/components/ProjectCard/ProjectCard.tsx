import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  name: string;
  href: string;
  description: string;
  year: number;
  bullets: string[];
}

export default function ProjectCard({
  name,
  href,
  description,
  year,
  bullets,
}: ProjectCardProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.placeholderIcon}></div>
      <div className={styles.infoStack}>
        <div className={styles.titleRow}>
          <div className={styles.titleSet}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              {name}
            </a>
            <span className={styles.projectDescription}>•</span>
            <p className={styles.projectDescription}>{description}</p>
          </div>
          <p className={styles.projectYear}>{year}</p>
        </div>
        {bullets.map((bullet, i) => (
          <div key={i} className={styles.descriptionRow}>
            <span>—</span>
            <p>{bullet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
