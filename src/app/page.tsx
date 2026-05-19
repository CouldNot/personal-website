import TopBar from "./components/TopBar/TopBar";
import styles from "./page.module.css";
import Painting from "./components/Painting/Painting";

export default function Home() {
  return (
    <>
      <TopBar cvUrl="https://google.com" />

      <section className={styles.hero}>
        <div className={styles.heroPainting}>
          <Painting />
        </div>
        <div className={styles.heroAbout}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor
            sit amet consectetur adipiscing elit. Quisque faucibus ex sapien
            vitae pellentesque sem placerat. In id cursus mi pretium tellus duis
            convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar
            vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa
            nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel
            class aptent taciti sociosqu. Ad litora torquent per conubia nostra
            inceptos himenaeos.
          </p>
        </div>
      </section>

      <div className={styles.body}>
        <aside className={styles.toc}>
          <p>1 / about</p>
          <p>2 projects</p>
          <p>3 experience</p>
          <p>4 writing</p>
        </aside>
        <main className={styles.content}>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>
              Paragraph {i + 1}. Lorem ipsum dolor sit amet consectetur
              adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
              placerat. In id cursus mi pretium tellus duis convallis.
            </p>
          ))}
        </main>
      </div>
    </>
  );
}
