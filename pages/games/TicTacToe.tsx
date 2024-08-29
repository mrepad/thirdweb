import { useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Game.module.css'; // Create this CSS file for custom styles if needed

const TicTacToeGame = () => {
  useEffect(() => {
    // Any additional scripts or setups for the game can go here
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Play Tic Tac Toe</title>
        <meta name="description" content="Play the Tic Tac Toe Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <iframe
        src="/TicTacToe/index.html"
        className={styles.gameFrame}
        title="Tic Tac Toe Game"
      ></iframe>
    </div>
  );
};

export default TicTacToeGame;
