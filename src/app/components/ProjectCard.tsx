import styles from "./ProjectCard.module.css";

export default function ProjectCard() {
  return (
    <div className={styles.layout}>
      <div className={styles.placeholderIcon}></div>
      <div className={styles.infoStack}>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
      </div>
    </div>
  );
}
