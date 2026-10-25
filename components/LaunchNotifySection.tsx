import Link from 'next/link';
import { LaunchNotify } from './LaunchNotify';
import { launchNotifyReady } from '@/lib/launch-notify-config';
import { LAUNCH_NOTIFY_ENABLED_COPY, type LaunchNotifyPlacement } from '@/lib/launch-notify';
import styles from './LaunchNotify.module.css';

export function LaunchNotifySection({ placement }: { placement: LaunchNotifyPlacement }) {
  if (launchNotifyReady()) {
    return <LaunchNotify placement={placement} intro={placement === 'home' ? LAUNCH_NOTIFY_ENABLED_COPY.homeIntro : undefined} />;
  }
  return (
    <section className={styles.box} aria-labelledby={`launch-news-${placement}`}>
      <h2 id={`launch-news-${placement}`} className={styles.title}>출시 소식은 공식 채널에서 확인해 주세요</h2>
      <p className={styles.body}>레터 올인원은 출시 준비 중입니다. 가격과 출시일은 아직 정해지지 않았습니다.</p>
      <p className={styles.body}>제품 준비 내용은 <Link href="/about/facts">공식 정보</Link>에서, 새로운 소식은 <a href="https://www.instagram.com/dearpapa.kr/" data-track-action="social_channel_opened">인스타그램 @dearpapa.kr</a>에서 확인하실 수 있습니다.</p>
    </section>
  );
}
