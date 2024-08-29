import { useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Game.module.css'; // Create this CSS file for custom styles if needed

const BreakoutGame = () => {
  useEffect(() => {
    // Any additional scripts or setups for the game can go here
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Play Breakout</title>
        <meta name="description" content="Play the Breakout Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <iframe
        src="/breakout/index.html"
        className={styles.gameFrame}
        title="Breakout Game"
      ></iframe>
    </div>
  );
};

export default BreakoutGame;
