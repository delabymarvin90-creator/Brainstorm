/**
 * HUD — in-game overlay showing HP, XP, wave/timer, gold, level, weapons, items.
 */
import { useTranslation } from '@/game/i18n';
import { RARITIES } from '@/game/data/items';

export default function HUD({ stats, onExit }) {
  const { t, lang } = useTranslation();
  if (!stats || !stats.maxHp) return null;

  const hpPct = (stats.hp / stats.maxHp) * 100;
  const xpPct = stats.xpToNext > 0 ? (stats.xp / stats.xpToNext) * 100 : 0;
  const timerStr = `${String(Math.floor(stats.timer / 60)).padStart(2, '0')}:${String(stats.timer % 60).padStart(2, '0')}`;

  const nameOf = (obj) => (lang === 'fr' ? obj.name_fr : obj.name) || obj.name;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 font-body">
      {/* Top bar: wave + timer + gold */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-2">
        {/* Left: wave + level */}
        <div className="bg-black/60 rounded px-3 py-1 text-white text-sm">
          <span className="text-game-accent font-bold">{t('hud.wave')} {stats.wave}</span>
          <span className="mx-2 text-gray-500">|</span>
          <span className="text-game-xp font-bold">{t('hud.level')} {stats.level}</span>
        </div>

        {/* Center: timer */}
        <div className="bg-black/60 rounded px-4 py-1 text-white text-sm font-bold">
          {timerStr}
        </div>

        {/* Right: gold + exit */}
        <div className="flex items-center gap-2">
          <div className="bg-black/60 rounded px-3 py-1 text-game-gold text-sm font-bold">
            {stats.gold}G
          </div>
          <button className="pointer-events-auto bg-black/60 rounded px-2 py-1 text-gray-400 text-xs hover:text-white"
            onClick={onExit}>✕</button>
        </div>
      </div>

      {/* HP bar */}
      <div className="absolute top-12 left-2 right-2 flex items-center gap-2">
        <span className="text-game-hp text-xs font-bold w-8">HP</span>
        <div className="flex-1 h-3 bg-black/60 rounded overflow-hidden border border-gray-700">
          <div className="h-full bg-game-hp transition-all duration-200" style={{ width: `${hpPct}%` }} />
        </div>
        <span className="text-white text-xs w-16 text-right">{stats.hp}/{stats.maxHp}</span>
      </div>

      {/* XP bar */}
      <div className="absolute top-16 left-2 right-2 flex items-center gap-2">
        <span className="text-game-xp text-xs font-bold w-8">XP</span>
        <div className="flex-1 h-2 bg-black/60 rounded overflow-hidden border border-gray-700">
          <div className="h-full bg-game-xp transition-all duration-200" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* Bottom: weapons + items */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end p-2 gap-2">
        {/* Weapons */}
        <div className="flex gap-1 flex-wrap max-w-[60%]">
          {stats.weapons?.map((w, i) => (
            <div key={i} className="bg-black/70 rounded px-2 py-1 text-white text-xs border border-gray-600">
              {nameOf(w)}
            </div>
          ))}
        </div>
        {/* Items */}
        <div className="flex gap-1 flex-wrap justify-end max-w-[35%]">
          {stats.items?.map((item, i) => {
            const rarColor = `#${(RARITIES[item.rarity]?.color || 0xaaaaaa).toString(16).padStart(6, '0')}`;
            return (
              <div key={i} className="w-7 h-7 rounded border-2 flex items-center justify-center text-xs font-bold"
                style={{ borderColor: rarColor }}>
                <span style={{ color: rarColor }}>{nameOf(item)[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
