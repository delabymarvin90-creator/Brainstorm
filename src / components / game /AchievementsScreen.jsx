/**
 * AchievementsScreen — grid of all achievements with unlocked/locked status.
 */
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { ACHIEVEMENTS } from '@/game/data/achievements';
import { AudioManager } from '@/game/systems/AudioManager';

export default function AchievementsScreen() {
  const game = useGame();
  const { t, lang } = useTranslation();
  const nameOf = (a) => (lang === 'fr' ? a.name_fr : a.name);
  const descOf = (a) => (lang === 'fr' ? a.desc_fr : a.desc);

  const unlockedCount = ACHIEVEMENTS.filter(a => game.achievements[a.id]?.unlocked).length;

  return (
    <div className="fixed inset-0 bg-game-bg overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-400 hover:text-white text-sm"
            onClick={() => { AudioManager.buttonClick(); game.navigate('menu'); }}>
            ← {t('common.back')}
          </button>
          <h2 className="font-pixel text-lg text-game-accent">{t('ach.title')}</h2>
          <div className="text-gray-400 text-sm">{t('ach.count', { unlocked: unlockedCount, total: ACHIEVEMENTS.length })}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = game.achievements[a.id]?.unlocked;
            return (
              <div key={a.id} className={`rounded-lg p-4 border ${unlocked ? 'bg-game-card border-game-accent' : 'bg-gray-900 border-gray-800 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>{unlocked ? '🏆' : '🔒'}</div>
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-500'}`}>{nameOf(a)}</div>
                    <div className="text-gray-400 text-xs">{descOf(a)}</div>
                  </div>
                  <div className={`text-xs font-bold ${unlocked ? 'text-game-accent' : 'text-gray-600'}`}>
                    {unlocked ? t('ach.unlocked') : t('ach.locked')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
