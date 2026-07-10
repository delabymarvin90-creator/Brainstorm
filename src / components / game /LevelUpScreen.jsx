/**
 * LevelUpScreen — overlay shown when the player levels up.
 * Displays 3 upgrade cards; clicking one applies it and resumes the game.
 */
import { useTranslation } from '@/game/i18n';
import { RARITIES } from '@/game/data/items';

const RARITY_COLORS = {
  common: { bg: 'bg-gray-800', border: 'border-gray-500', text: 'text-gray-300' },
  uncommon: { bg: 'bg-green-900/40', border: 'border-green-500', text: 'text-green-400' },
  rare: { bg: 'bg-blue-900/40', border: 'border-blue-500', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-900/40', border: 'border-purple-500', text: 'text-purple-400' },
  legendary: { bg: 'bg-amber-900/40', border: 'border-amber-500', text: 'text-amber-400' },
};

export default function LevelUpScreen({ data, onChoose }) {
  const { t, lang } = useTranslation();
  const nameOf = (u) => (lang === 'fr' ? u.name_fr : u.name) || u.name;
  const descOf = (u) => (lang === 'fr' ? u.desc_fr : u.desc) || u.desc;

  return (
    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-6 z-50">
      <h2 className="font-pixel text-2xl text-game-accent">{t('levelup.title')}</h2>
      <p className="text-gray-400 text-sm">{t('levelup.choose')} — {t('hud.level')} {data.level}</p>

      <div className="flex gap-4 flex-wrap justify-center max-w-[800px]">
        {data.choices.map((upgrade, i) => {
          const c = RARITY_COLORS[upgrade.rarity] || RARITY_COLORS.common;
          return (
            <button key={i}
              className={`${c.bg} ${c.border} border-2 rounded-lg p-5 w-52 text-left hover:scale-105 transition cursor-pointer`}
              onClick={() => onChoose(upgrade)}>
              <div className={`text-xs uppercase mb-2 ${c.text}`}>{t(`rarity.${upgrade.rarity}`)}</div>
              <div className="text-white font-bold text-lg mb-2">{nameOf(upgrade)}</div>
              <div className="text-gray-300 text-sm">{descOf(upgrade)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
