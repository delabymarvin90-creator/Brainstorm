/**
 * GameRun — the in-run orchestrator. Hosts the Phaser canvas and React UI overlays.
 * Listens to EventBus events from ArenaScene and manages sub-states:
 * playing → levelup → playing, wave_end → wave_shop → playing, death → game_over.
 */
import { useState, useEffect } from 'react';
import { useGame } from '@/game/GameContext';
import { EventBus } from '@/game/systems/EventBus';
import { getCharacter } from '@/game/data/characters';
import { SaveManager } from '@/game/systems/SaveManager';
import { useTranslation } from '@/game/i18n';
import GameCanvas from './GameCanvas';
import HUD from './HUD';
import LevelUpScreen from './LevelUpScreen';
import WaveShop from './WaveShop';
import GameOverScreen from './GameOverScreen';

export default function GameRun() {
  const game = useGame();
  const { t } = useTranslation();
  const [runState, setRunState] = useState('playing');
  const [stats, setStats] = useState({});
  const [levelUpData, setLevelUpData] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [gameOverData, setGameOverData] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const subs = [
      EventBus.on('game:stats_update', (d) => setStats(d)),
      EventBus.on('game:levelup', (d) => { setLevelUpData(d); setRunState('levelup'); }),
      EventBus.on('game:wave_complete', () => setRunState('wave_shop')),
      EventBus.on('game:shop_update', (d) => setShopData(d)),
      EventBus.on('game:game_over', (d) => { setGameOverData(d); setRunState('game_over'); }),
      EventBus.on('game:save_run', (rd) => game.saveRun(rd)),
      EventBus.on('game:paused', () => setRunState('paused')),
      EventBus.on('game:unpaused', () => setRunState('playing')),
    ];
    return () => subs.forEach(fn => fn && fn());
  }, []); // eslint-disable-line

  // ESC to toggle pause — handled at window level so it works even when the Phaser scene is paused
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Escape' && (runState === 'playing' || runState === 'paused')) {
        e.preventDefault();
        EventBus.emit('ui:toggle_pause');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [runState]);

  const handleChooseUpgrade = (upgrade) => {
    EventBus.emit('ui:choose_upgrade', upgrade);
    setLevelUpData(null);
    setRunState('playing');
  };

  const handleNextWave = () => {
    setRunState('playing');
    EventBus.emit('ui:start_wave');
  };

  const handleRetry = () => {
    setGameOverData(null);
    setRunState('playing');
    setGameKey(k => k + 1);
  };

  const handleMainMenu = () => {
    if (gameOverData) game.endGame(gameOverData);
    setGameOverData(null);
    setRunState('playing');
  };

  const character = getCharacter(game.selectedCharacterId);
  const savedRun = game.isContinuing ? SaveManager.getCurrentRun() : null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative" style={{ width: '900px', height: '600px', maxWidth: '100vw', maxHeight: '100vh' }}>
        <GameCanvas key={gameKey} character={character} seed={game.seed} options={game.options} savedRun={savedRun} gameMode={game.gameMode} metaMods={game.getMetaMods()} />

        {runState === 'playing' && <HUD stats={stats} onExit={handleMainMenu} />}
        {runState === 'levelup' && levelUpData && (
          <LevelUpScreen data={levelUpData} onChoose={handleChooseUpgrade} />
        )}
        {runState === 'wave_shop' && shopData && (
          <WaveShop data={shopData} onNextWave={handleNextWave} />
        )}
        {runState === 'game_over' && gameOverData && (
          <GameOverScreen stats={gameOverData} onRetry={handleRetry} onMainMenu={handleMainMenu} />
        )}
        {runState === 'paused' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-6 z-50">
            <h2 className="font-pixel text-2xl text-game-accent">{t('common.paused')}</h2>
            <button className="px-8 py-3 bg-game-accent text-black font-bold rounded hover:scale-105 transition"
              onClick={() => EventBus.emit('ui:toggle_pause')}>
              {t('common.resume')}
            </button>
            <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition"
              onClick={handleMainMenu}>
              {t('gameover.menu')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
