import Image from "next/image";
import styles from "./Painting.module.css";

export default function Painting() {
  return (
    <div className={styles.container}>
      <Image
        src="/venice.webp"
        alt="Watercolor painting of Venice, Italy"
        width={4096}
        height={2871}
        className={styles.image}
        priority
      />
    </div>
  );
}
