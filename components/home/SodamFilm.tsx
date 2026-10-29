import styles from './SodamFilm.module.css';

const assets = '/media/sodam-teaser-r4';

export function SodamFilm() {
  return (
    <section id="sodam-film" className={styles.section} aria-labelledby="sodam-film-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>DEAR PAPA FILM <span>11초</span></p>
          <h2 id="sodam-film-title">아빠에게,<br />아직 전하지 못한 마음.</h2>
          <p className={styles.description}>
            길지 않아도 괜찮아요.<br />
            Sodam과 함께, 마음을 전할<br className={styles.desktopBreak} /> 한 줄을 떠올려 보세요.
          </p>
          <a className={styles.link} href="/#letter" data-letter-entry data-track-action="letter_entry_clicked">
            한 줄 편지 써보기 <span aria-hidden="true">↗</span>
          </a>
        </div>
        <figure className={styles.figure}>
          <video
            className={`${styles.video} ${styles.landscape}`}
            width="1280"
            height="720"
            controls
            muted
            playsInline
            preload="none"
            poster={`${assets}/poster-landscape.webp`}
            aria-label="Sodam과 함께하는 DEAR PAPA 티저, 11초 무음 영상"
            aria-describedby="sodam-film-description"
          >
            <source src={`${assets}/landscape-muted.mp4`} type="video/mp4" />
            <a href={`${assets}/landscape-muted.mp4`}>Sodam 티저 영상 열기</a>
          </video>
          <video
            className={`${styles.video} ${styles.portrait}`}
            width="720"
            height="1280"
            controls
            muted
            playsInline
            preload="none"
            poster={`${assets}/poster-portrait.webp`}
            aria-label="Sodam과 함께하는 DEAR PAPA 티저, 11초 무음 세로 영상"
            aria-describedby="sodam-film-description"
          >
            <source src={`${assets}/portrait-muted.mp4`} type="video/mp4" />
            <a href={`${assets}/portrait-muted.mp4`}>Sodam 티저 영상 열기</a>
          </video>
          <figcaption className={styles.caption}>
            <span>작은 편지에 담은 마음, Sodam</span>
            <span>소리 없이 감상하는 영상</span>
          </figcaption>
          <details className={styles.transcript}>
            <summary>영상 내용 읽기</summary>
            <div id="sodam-film-description">
              <p>편지를 든 파란 캐릭터 Sodam이 조용히 눈을 감았다가 바라봅니다.</p>
              <p>“아빠에게, 아직 전하지 못한 마음.” “한 줄이면 충분해요.”</p>
              <p>DEAR PAPA. 아빠의 매일에, 딸의 마음을. 출시 준비 중 · dearpapa.kr</p>
            </div>
          </details>
        </figure>
      </div>
    </section>
  );
}
