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
            I'm a frontend engineer with an expertise in building accessible,
            pixel-perfect user interfaces. I take pride in crafting thoughtful,
            inclusive products and have a sharp eye for the little details that
            elevate user experience. I do my best work at the intersection of
            design and engineering, where great UX meets clean, scalable code.
            Currently, I'm on the component library team at Klaviyo, where I
            maintain and evolve the design system. I lead engineering efforts
            across components, tooling, and patterns, partnering closely with
            designers and engineers to ensure accessibility is built into the
            foundation of our products. Previously, I've worked across a wide
            range of environments — from product studios to startups and large
            tech companies — including Apple, Starry Internet, and Upstatement.
            Outside of my day-to-day work, I also created an online video course
            a few years ago which walks through building a real-world,
            API-driven application from scratch. These experiences have shaped
            how I think about building products that are both well-crafted and
            widely usable. In my spare time, you can usually find me climbing,
            playing tennis, hanging out with my wife and two cats, or running
            around Hyrule searching for Korok seedsKorok seeds.
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
