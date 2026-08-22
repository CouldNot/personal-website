import Image, { type StaticImageData } from "next/image";
import styles from "./ExperienceCard.module.css";

interface ExperienceCardProps {
  company: string;
  dateRange: string;
  role: string;
  icon?: StaticImageData;
}

export default function ExperienceCard({
  company,
  dateRange,
  role,
  icon,
}: ExperienceCardProps) {
  return (
    <div className={styles.layout}>
      {icon ? (
        <Image src={icon} alt="" className={styles.icon} />
      ) : (
        <div className={styles.placeholderIcon}></div>
      )}
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
