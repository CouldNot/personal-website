import Image, { type StaticImageData } from "next/image";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  name: string;
  href: string;
  description: string;
  year: number;
  bullets: string[];
  // Raster icons (StaticImageData) go through next/image; SVGs are passed
  // as a plain /public path string and rendered with a plain <img>, since
  // next/image's optimizer requires extra config to serve SVGs safely.
  icon?: StaticImageData | string;
}

export default function ProjectCard({
  name,
  href,
  description,
  year,
  bullets,
  icon,
}: ProjectCardProps) {
  return (
    <div className={styles.layout}>
      {icon ? (
        typeof icon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={icon} alt="" className={styles.icon} />
        ) : (
          <Image src={icon} alt="" className={styles.icon} />
        )
      ) : (
        <div className={styles.placeholderIcon}></div>
      )}
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
