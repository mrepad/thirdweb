// pages/GamePage.tsx

import React, { useEffect, useRef } from 'react';
import styles from '../../styles/GameFrame.module.css'; // Optional: Add styles for your game page

const GamePage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const container = iframe.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          const gameWidth = 1920; // Original game width
          const gameHeight = 1080; // Original game height

          const scale = Math.min(containerWidth / gameWidth, containerHeight / gameHeight);

          iframe.style.width = `${gameWidth}px`;
          iframe.style.height = `${gameHeight}px`;
          iframe.style.transform = `scale(${scale}) translate(-50%, -50%)`;
          iframe.style.transformOrigin = 'top left';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameContainer}>
        <iframe
          ref={iframeRef}
          src="/flappy/index.html" // Path to your game file in the public directory
          title="HTML5 Game"
          className={styles.gameFrame}
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default GamePage;
