import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";
import floor from "./floor.png";

export const metadata: Metadata = {
  title: "RoombaRat",
  description:
    "RoombaRat patrols the floor and snitches on anyone using their phone.",
};

export default function RoombaRat() {
  return (
    <div className={styles.layout}>
      {/* Plain <a>, not next/link: this forces a real page navigation so
          the crossfade in globals.css (@view-transition) actually applies.
          next/link's client-side transition wouldn't trigger it. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" className={styles.back}>
        ← back
      </a>
      <figure className={styles.figure}>
        <div className={styles.imageFrame}>
          <Image
            src={floor}
            alt="A Roomba rigged with a camera and face-detection script, aimed at someone lying against a wall on their phone."
            className={styles.image}
            priority
          />
        </div>
        <figcaption className={styles.caption}>
          RoombaRat patrols the floor and snitches on anyone using their
          phone.
        </figcaption>
      </figure>
    </div>
  );
}
