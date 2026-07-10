/**
 * MetaShop — spend materials to unlock characters permanently.
 */
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { CHARACTERS } from '@/game/data/characters';
import { AudioManager } from '@/game/systems/AudioManager';

export default function MetaShop() {
  const game = useGame();
  const { t, lang } = useTranslation();
  const nameOf = (c) => (lang === 'fr' ? c.name_fr : c.name);
  const descOf = (c) => (lang === 'fr' ? c.desc_fr : c.desc);

  const lockedChars = CHARACTERS.filter(c => c.unlock_cost > 0 && !game.progression.unlockedCharacters.includes(c.id));

  const handleUnlock = (c) => {
    if (game.unlockCharacter(c.id, c.unlock_cost)) {
      AudioManager.purchase();
    } else {
      AudioManager.error();
    }
  };

  return (
    <div className="fixed inset-0 bg-game-bg overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-400 hover:text-white text-sm"
            onClick={() => { AudioManager.buttonClick(); game.navigate('menu'); }}>
            ← {t('common.back')}
          </button>
          <h2 className="font-pixel text-lg text-game-accent">{t('meta.title')}</h2>
          <div className="text-game-gold font-bold text-sm">{t('meta.materials')}: {game.progression.materials}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lockedChars.map((c) => {
            const canAfford = game.progression.materials >= c.unlock_cost;
            return (
              <div key={c.id} className="bg-game-card rounded-lg p-4 border border-gray-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-white/30 flex-shrink-0"
                  style={{ backgroundColor: `#${c.color.toString(16).padStart(6, '0')}` }} />
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">{nameOf(c)}</div>
                  <div className="text-gray-400 text-xs">{descOf(c)}</div>
                </div>
                <button disabled={!canAfford}
                  className={`px-4 py-2 rounded font-bold text-sm transition ${canAfford ? 'bg-game-accent text-black hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                  onClick={() => handleUnlock(c)}>
                  {c.unlock_cost} {t('meta.materials')}
                </button>
              </div>
            );
          })}
          {lockedChars.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              {lang === 'fr' ? 'Tous les personnages sont débloqués!' : 'All characters unlocked!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
