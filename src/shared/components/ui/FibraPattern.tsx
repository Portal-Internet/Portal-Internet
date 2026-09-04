import styles from './FibraPattern.module.css'

/** Textura decorativa das seções verdes. O container precisa ser `position: relative`. */
export function FibraPattern() {
  return <div className={styles.pattern} aria-hidden="true" />
}
