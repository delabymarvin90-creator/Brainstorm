/**
 * ModeSelect — choose a game mode before selecting a character.
 * Modes: Normal, Endless, Hardcore, Daily Challenge.
 */
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { AudioManager } from '@/game/systems/AudioManager';
import { GAME_MODES, getDailySeed } from '@/game/data/gameModes';

export default function ModeSelect() {
  const game = useGame();
  const { t, lang } = useTranslation();
  const nameOf = (m) => (lang === 'fr' ? m.name_fr : m.name);
  const descOf = (m) => (lang === 'fr' ? m.desc_fr : m.desc);

  const selectMode = (mode) => {
    AudioManager.buttonClick();
    if (mode.daily) {
      game.setSeed(getDailySeed());
    }
    game.setGameMode(mode.id);
    game.navigate('character_select');
  };

  return (
    <div className="fixed inset-0 bg-game-bg flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="font-pixel text-2xl text-game-accent text-center">{t('mode.title')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {GAME_MODES.map((mode) => (
          <button key={mode.id}
            onClick={() => selectMode(mode)}
            className="bg-game-card rounded-lg p-5 border-2 border-gray-700 hover:border-game-accent transition text-left flex flex-col gap-2 hover:scale-[1.02]">
            <div className="text-3xl">{mode.icon}</div>
            <div className="font-bold text-white text-lg">{nameOf(mode)}</div>
            <div className="text-gray-400 text-sm">{descOf(mode)}</div>
            {mode.daily && (
              <div className="text-game-gold text-xs mt-1">{t('mode.daily_seed')}: {getDailySeed()}</div>
            )}
          </button>
        ))}
      </div>

      <button className="px-6 py-2 bg-game-card text-gray-300 border border-gray-700 rounded hover:text-white transition"
        onClick={() => { AudioManager.buttonClick(); game.navigate('menu'); }}>
        {t('common.back')}
      </button>
    </div>
  );
}
