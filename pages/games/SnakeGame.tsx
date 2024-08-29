import { useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Game.module.css'; // Create this CSS file for custom styles if needed

const SnakeGame = () => {
  useEffect(() => {
    // Any additional scripts or setups for the game can go here
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Play Snake</title>
        <meta name="description" content="Play the Snake Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <iframe
        src="/snake/index.html"
        className={styles.gameFrame}
        title="Snake Game"
      ></iframe>
    </div>
  );
};

export default SnakeGame;
