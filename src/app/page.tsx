import styles from "./page.module.css";
import ProjectCard from "./components/ProjectCard/ProjectCard";
import ExperienceCard from "./components/ExperienceCard/ExperienceCard";
import Seascape from "./components/Seascape/Seascape";
import TableOfContents from "./components/TableOfContents/TableOfContents";
import ArrowUpRight from "./components/ArrowUpRight/ArrowUpRight";
import beaconIcon from "./assets/icons/beacon.png";
import brawldleIcon from "./assets/icons/brawldle.png";
import gitIcon from "./assets/icons/git.png";
import millenniumStemIcon from "./assets/icons/millenium_stem.png";

export default function Home() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.paintingContainer}>
          <Seascape />
        </div>

        <TableOfContents />

        <nav className={styles.links}>
          <a
            href="https://github.com/CouldNot"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            github <ArrowUpRight />
          </a>
          <a
            href="https://www.linkedin.com/in/dale-dai"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            linkedin <ArrowUpRight />
          </a>
          <a
            href="/Dale_Dai.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            cv <ArrowUpRight />
          </a>
          <a
            href="https://www.goodreads.com/user/show/156001052-dale-dai"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            goodreads <ArrowUpRight />
          </a>
        </nav>
      </aside>

      <main className={styles.content}>
        <h1 className={styles.wordmark}>dale dai</h1>

        <section id="about" className={styles.about}>
          <p>
            Hi, I&apos;m Dale. I&apos;m a Computer Science student at the{" "}
            <a
              href="https://www.usc.edu"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLink}
            >
              University of Southern California
            </a>{" "}
            and I like to tinker with product, engineering, and everything in
            between.
          </p>
          <p>
            My love of software began with making animations on{" "}
            <a
              href="https://scratch.mit.edu"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLink}
            >
              Scratch
            </a>{" "}
            at eight years old. I&apos;ve made a lot of other things since then,
            like{" "}
            <a
              href="https://github.com/CouldNot/brawldle"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLink}
            >
              a puzzle game
            </a>{" "}
            that reached more than 200,000 users, contributed to a few
            open-source projects, and briefly become the kind of person who uses
            Arch, btw 🤓.
          </p>
          <p>
            Recently, I&apos;ve been working on{" "}
            <a
              href="https://tracksideracing.app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLink}
            >
              Trackside
            </a>
            , a social motorsports app for live races.
          </p>
          <p className={styles.email}>hi@daled.ai</p>
        </section>

        <section id="projects" className={styles.projects}>
          <div className={styles.projectContainer}>
            {[
              {
                name: "Trackside",
                href: "https://tracksideracing.app",
                description:
                  "Motorsport app for live race tracking and predictions",
                year: 2026,
                bullets: [
                  "Cross-platform mobile app (React Native/Expo)",
                  "Beta waitlist with 500+ registered testers",
                ],
                icon: "/icons/trackside.svg",
              },
              {
                name: "Brawldle.io",
                href: "https://brawldle.io",
                description: "Daily puzzle site (acquired in 2026)",
                year: 2026,
                bullets: [
                  "Reached 200K+ users and 500k+ plays across 150+ countries",
                  "Developed and designed in HTML/CSS/JS",
                ],
                icon: brawldleIcon,
              },
              {
                name: "Beacon",
                href: "https://github.com/CouldNot/beacon",
                description: "Multi-protocol proxy client for macOS",
                year: 2026,
                bullets: [
                  "Native SwiftUI on top of Xray-core and sing-box",
                  "Routing, subscriptions, and live connection monitoring",
                ],
                icon: beaconIcon,
              },
            ].map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
          </div>
        </section>

        <section id="experience" className={styles.experience}>
          <div className={styles.experienceContainer}>
            {[
              {
                company: "Trackside",
                dateRange: "Jul 2026 - Present",
                role: "Co-Founder",
                icon: "/icons/trackside.svg",
              },
              {
                company: "The Algorithms, Nikola, Matplotlib",
                dateRange: "2022 - 2026",
                role: "Open-Source Contributor",
                icon: gitIcon,
              },
              {
                company: "Millennium STEM BC",
                dateRange: "Feb 2024 - Jan 2025",
                role: "Director of IT",
                icon: millenniumStemIcon,
              },
            ].map((experience, i) => (
              <ExperienceCard key={i} {...experience} />
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            The water in the sidebar is a live GPU simulation published by{" "}
            <a
              href="https://www.shadertoy.com/user/TDM"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLink}
            >
              TDM
            </a>{" "}
            in 2014.
          </p>
          <p>Built with Next.js in SoCal ☀️</p>
        </footer>
      </main>
    </div>
  );
}
