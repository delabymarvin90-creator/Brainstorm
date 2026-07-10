/**
 * GameCanvas — mounts the Phaser game into a container div.
 * Uses key prop to force remount on retry (old game is destroyed, new one created).
 */
import { useEffect, useRef } from 'react';
import { createPhaserGame } from '@/game/PhaserGame';

export default function GameCanvas({ character, seed, options, savedRun, gameMode, metaMods }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const game = createPhaserGame(containerRef.current, character, seed, options, savedRun, gameMode, metaMods);
    return () => {
      try { game.destroy(true); } catch (e) { /* noop */ }
    };
  }, []); // eslint-disable-line

  return <div ref={containerRef} className="w-full h-full" />;
}
