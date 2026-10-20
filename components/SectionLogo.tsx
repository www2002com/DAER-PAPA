import { Logo } from './Logo';
import styles from './SectionLogo.module.css';

export function SectionLogo({ overlay = false }: { overlay?: boolean }) {
  return (
    <div className={overlay ? styles.overlay : styles.heading}>
      <Logo className={styles.logo} />
    </div>
  );
}
