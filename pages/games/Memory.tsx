import { useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Game.module.css'; // Create this CSS file for custom styles if needed

const MemoryGame = () => {
  useEffect(() => {
    // Any additional scripts or setups for the game can go here
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Play Memory Game</title>
        <meta name="description" content="Play the Memory Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <iframe
        src="/memory/index.html"
        className={styles.gameFrame}
        title="Memory Game"
      ></iframe>
    </div>
  );
};

export default MemoryGame;
