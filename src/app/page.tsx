import Image from "next/image";
import { Icon } from "@iconify/react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.paintingContainer}>
          <Image
            src="/warbler.webp"
            alt="Warbler bird painting"
            fill
            className={styles.painting}
            priority
          />
        </div>

        <div className={styles.navPlaceholder} />

        <nav className={styles.links}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            github <Icon icon="ph:arrow-up-right" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            linkedin <Icon icon="ph:arrow-up-right" />
          </a>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            cv <Icon icon="ph:arrow-up-right" />
          </a>
          <a
            href="https://www.goodreads.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            goodreads <Icon icon="ph:arrow-up-right" />
          </a>
        </nav>
      </aside>

      <main className={styles.content}>
        <h1 className={styles.wordmark}>dale dai</h1>

        <section className={styles.about}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>
          <p>
            Phasellus tristique dui ut ligula pharetra, nec bibendum diam
            gravida. Sed euismod felis vel velit varius, ut faucibus odio
            dignissim. Donec malesuada eros et eros tincidunt, vel tincidunt
            lectus tincidunt. Proin vestibulum, lorem nec dictum posuere, lorem
            eros tincidunt turpis, nec bibendum diam gravida nec eros.
          </p>
          <p>
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Curabitur euismod, nisi vel consectetur
            tincidunt, nisi nisi aliquam eros, nec bibendum diam gravida nec
            eros. Sed euismod felis vel velit varius, ut faucibus odio
            dignissim.
          </p>
        </section>

        <section className={styles.projects}>
          <div className={styles.projectsPlaceholder}>
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className={styles.projectCard} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
