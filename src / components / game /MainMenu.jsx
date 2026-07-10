/**
 * MainMenu — title screen with animated logo and navigation buttons.
 */
import { useState } from 'react';
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { AudioManager } from '@/game/systems/AudioManager';

export default function MainMenu() {
  const game = useGame();
  const { t } = useTranslation();
  const [seedInput, setSeedInput] = useState('');

  const handleNewGame = () => {
    AudioManager.buttonClick();
    game.setSeed(seedInput || null);
    game.navigate('mode_select');
  };

  const handleContinue = () => {
    AudioManager.buttonClick();
    game.continueGame();
  };

  const btn = "w-full px-6 py-3 rounded-lg font-bold transition hover:scale-[1.02]";

  return (
    <div className="fixed inset-0 bg-game-bg flex flex-col items-center justify-center gap-6 overflow-hidden">
      {/* Decorative background dots */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-game-accent animate-pulse"
            style={{
              width: `${4 + (i % 4) * 3}px`, height: `${4 + (i % 4) * 3}px`,
              left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full px-4">
        {/* Title */}
        <div className="text-center">
          <h1 className="font-pixel text-4xl text-game-accent mb-2 drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]">
            BROTATO
          </h1>
          <div className="font-pixel text-xl text-white">2.0</div>
          <p className="text-gray-500 text-xs mt-3">{t('menu.subtitle')}</p>
        </div>

        {/* Seed input */}
        <div className="w-full">
          <input
            type="text"
            placeholder={t('menu.seed_placeholder')}
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            className="w-full px-4 py-2 bg-game-card border border-gray-700 rounded text-white text-sm text-center placeholder-gray-600 focus:border-game-accent focus:outline-none"
            maxLength={20}
          />
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2">
          <button className={`${btn} bg-game-accent text-black`} onClick={handleNewGame}>
            {t('menu.new_game')}
          </button>
          {game.hasSavedRun && (
            <button className={`${btn} bg-game-card text-white border border-gray-600`} onClick={handleContinue}>
              {t('menu.continue')}
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button className={`${btn} bg-game-card text-gray-300 border border-gray-700 text-sm`}
              onClick={() => { AudioManager.buttonClick(); game.navigate('meta_upgrades'); }}>
              {t('menu.meta_shop')}
            </button>
            <button className={`${btn} bg-game-card text-gray-300 border border-gray-700 text-sm`}
              onClick={() => { AudioManager.buttonClick(); game.navigate('meta_shop'); }}>
              {t('menu.characters')}
            </button>
            <button className={`${btn} bg-game-card text-gray-300 border border-gray-700 text-sm`}
              onClick={() => { AudioManager.buttonClick(); game.navigate('achievements'); }}>
              {t('menu.achievements')}
            </button>
            <button className={`${btn} bg-game-card text-gray-300 border border-gray-700 text-sm`}
              onClick={() => { AudioManager.buttonClick(); game.navigate('stats'); }}>
              {t('menu.stats')}
            </button>
            <button className={`${btn} bg-game-card text-gray-300 border border-gray-700 text-sm`}
              onClick={() => { AudioManager.buttonClick(); game.navigate('options'); }}>
              {t('menu.options')}
            </button>
            <button className={`${btn} bg-game-card text-gray-300 border border-gray-700 text-sm`}
              onClick={() => { AudioManager.buttonClick(); game.navigate('tutorial'); }}>
              {t('menu.tutorial')}
            </button>
          </div>
        </div>

        {/* Materials display */}
        <div className="text-game-gold text-sm">
          {t('meta.materials')}: {game.progression.materials}
        </div>
      </div>
    </div>
  );
}
