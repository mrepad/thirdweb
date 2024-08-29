import { useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Game.module.css'; // Create this CSS file for custom styles if needed

const PongGame = () => {
  useEffect(() => {
    // Any additional scripts or setups for the game can go here
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Play Pong</title>
        <meta name="description" content="Play the Pong Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <iframe
        src="/pong/index.html"
        className={styles.gameFrame}
        title="Pong Game"
      ></iframe>
    </div>
  );
};

export default PongGame;
