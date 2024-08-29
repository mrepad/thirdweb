import { useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Game.module.css'; // Create this CSS file for custom styles if needed

const Minesweeper = () => {
  useEffect(() => {
    // Any additional scripts or setups for the game can go here
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Play Minesweeper</title>
        <meta name="description" content="Play Minesweeper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <iframe
        src="/minesweeper/index.html"
        className={styles.gameFrame}
        title="Minesweeper"
      ></iframe>
    </div>
  );
};

export default Minesweeper;
