// src/components/GameFrame.tsx
import React from 'react';
import styles from '../styles/GameFrame.module.css'; // Optional: Add styles for your iframe

const GameFrame: React.FC = () => {
  return (
    <div className={styles.gameContainer}>
      <iframe
        src="/game/index.html" // Path to your game file in the public directory
        title="HTML5 Game"
        className={styles.gameFrame}
        frameBorder="0"
        width="100%"
        height="600px" // Adjust height as needed
        allowFullScreen
      />
    </div>
  );
};

export default GameFrame;
