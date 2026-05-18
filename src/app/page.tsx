import TopBar from "./components/TopBar/TopBar"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div>
      <TopBar cvUrl="https://google.com"/>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>

        </aside>
        <main className={styles.content}>

        </main>
      </div>
    </div>
  )
}