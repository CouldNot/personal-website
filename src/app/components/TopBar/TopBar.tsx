import styles from "./TopBar.module.css"
import { Icon } from "@iconify/react"

interface TopBarProps {
  cvUrl: string
}

export default function TopBar({ cvUrl }: TopBarProps) {
  return (
    <header className={styles.header}>
      <span className={styles.wordmark}>dale dai</span>
      <a href={cvUrl} target="_blank" rel="noopener noreferrer" className={styles.cv}>
        cv <Icon icon="ph:arrow-up-right"></Icon>
      </a>
    </header>
  )
}