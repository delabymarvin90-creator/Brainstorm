/**
 * MetaUpgradesScreen — purchase permanent stat upgrades with materials.
 * Each upgrade has multiple levels with escalating cost.
 */
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { AudioManager } from '@/game/systems/AudioManager';
import { META_UPGRADES, getMetaUpgradeCost } from '@/game/data/metaUpgrades';

export default function MetaUpgradesScreen() {
  const game = useGame();
  const { t, lang } = useTranslation();
  const metaLevels = game.progression.metaUpgrades || {};
  const nameOf = (u) => (lang === 'fr' ? u.name_fr : u.name);
  const descOf = (u) => (lang === 'fr' ? u.desc_fr : u.desc);

  const handleBuy = (up) => {
    const level = metaLevels[up.id] || 0;
    if (level >= up.max_level) { AudioManager.error(); return; }
    const cost = getMetaUpgradeCost(up, level);
    if (game.purchaseMetaUpgrade(up.id, cost)) {
      AudioManager.purchase();
    } else {
      AudioManager.error();
    }
  };

  return (
    <div className="fixed inset-0 bg-game-bg overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-pixel text-xl text-game-accent">{t('meta.title')}</h1>
          <div className="text-game-gold font-bold">{t('meta.materials')}: {game.progression.materials}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {META_UPGRADES.map((up) => {
            const level = metaLevels[up.id] || 0;
            const maxed = level >= up.max_level;
            const cost = getMetaUpgradeCost(up, level);
            const canBuy = !maxed && game.progression.materials >= cost;
            return (
              <div key={up.id} className="bg-game-card rounded-lg p-4 border border-gray-700 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-white text-sm">{nameOf(up)}</div>
                  <div className="text-xs text-gray-500">{t('meta.level')} {level}/{up.max_level}</div>
                </div>
                <div className="text-gray-400 text-xs">{descOf(up)}</div>
                {/* Level bar */}
                <div className="flex gap-0.5">
                  {Array.from({ length: up.max_level }).map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded ${i < level ? 'bg-game-accent' : 'bg-gray-700'}`} />
                  ))}
                </div>
                <button disabled={!canBuy}
                  className={`px-3 py-1.5 rounded text-sm font-bold transition ${maxed ? 'bg-gray-800 text-gray-600' : canBuy ? 'bg-game-accent text-black hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                  onClick={() => handleBuy(up)}>
                  {maxed ? t('meta.maxed') : `${t('meta.buy')} — ${cost}`}
                </button>
              </div>
            );
          })}
        </div>

        <button className="px-6 py-2 bg-game-card text-gray-300 border border-gray-700 rounded hover:text-white transition"
          onClick={() => { AudioManager.buttonClick(); game.navigate('menu'); }}>
          {t('common.back')}
        </button>
      </div>
    </div>
  );
}
