/**
 * CharacterSelect — grid of character cards with stats display.
 * Unlocked characters can be selected; locked ones show unlock conditions.
 */
import { useState } from 'react';
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { CHARACTERS, DEFAULT_STATS } from '@/game/data/characters';
import { getWeapon } from '@/game/data/weapons';
import { AudioManager } from '@/game/systems/AudioManager';

const STAT_KEYS = [
  'max_hp', 'speed', 'damage_multiplier', 'range', 'attack_speed',
  'luck', 'armor', 'dodge', 'crit_chance', 'life_steal',
];

export default function CharacterSelect() {
  const game = useGame();
  const { t, lang } = useTranslation();
  const [selected, setSelected] = useState(game.selectedCharacterId);

  const isUnlocked = (c) => game.progression.unlockedCharacters.includes(c.id);
  const nameOf = (c) => (lang === 'fr' ? c.name_fr : c.name);
  const descOf = (c) => (lang === 'fr' ? c.desc_fr : c.desc);

  const handleStart = () => {
    AudioManager.buttonClick();
    game.startGame(selected, game.seed, game.gameMode);
  };

  const getUnlockText = (c) => {
    if (!c.unlock_condition) return null;
    const cond = c.unlock_condition;
    switch (cond.type) {
      case 'wave': return t('char.unlock_at', { wave: cond.value });
      case 'kills': return t('char.unlock_kills', { kills: cond.value });
      case 'gold': return t('char.unlock_gold', { gold: cond.value });
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-game-bg overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-400 hover:text-white text-sm"
            onClick={() => { AudioManager.buttonClick(); game.navigate('mode_select'); }}>
            ← {t('common.back')}
          </button>
          <h2 className="font-pixel text-lg text-game-accent">{t('char.title')}</h2>
          <div className="w-16" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {CHARACTERS.map((c) => {
            const unlocked = isUnlocked(c);
            const isSelected = selected === c.id;
            return (
              <button key={c.id} disabled={!unlocked}
                className={`rounded-lg p-3 border-2 transition text-left ${isSelected ? 'border-game-accent scale-[1.02]' : 'border-gray-700'} ${unlocked ? 'bg-game-card hover:border-gray-500 cursor-pointer' : 'bg-gray-900 opacity-50 cursor-not-allowed'}`}
                onClick={() => { if (unlocked) { AudioManager.buttonClick(); setSelected(c.id); } }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: `#${c.color.toString(16).padStart(6, '0')}` }} />
                  <div className="text-white font-bold text-sm">{nameOf(c)}</div>
                </div>
                <div className="text-gray-400 text-xs mb-2">{descOf(c)}</div>
                {!unlocked && (
                  <div className="text-red-400 text-xs font-bold">🔒 {getUnlockText(c)}</div>
                )}
                {unlocked && (
                  <div className="text-gray-500 text-xs">
                    {t('char.starting_weapon')}: {lang === 'fr' ? getWeapon(c.starting_weapon)?.name_fr : getWeapon(c.starting_weapon)?.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Stats display for selected character */}
        {(() => {
          const c = CHARACTERS.find(ch => ch.id === selected);
          if (!c) return null;
          return (
            <div className="bg-game-card rounded-lg p-4 border border-gray-700 mb-4">
              <h3 className="text-white font-bold text-sm mb-3">{nameOf(c)} — Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {STAT_KEYS.map(key => {
                  const val = c.stats[key] ?? DEFAULT_STATS[key] ?? 0;
                  const defaultVal = DEFAULT_STATS[key] ?? 0;
                  const diff = val - defaultVal;
                  const isPct = key === 'damage_multiplier' || key === 'attack_speed' || key === 'luck' || key === 'armor' || key === 'dodge' || key === 'crit_chance';
                  const displayVal = isPct ? `${Math.round(val * 100)}%` : val;
                  const diffStr = diff > 0 ? `(+${isPct ? Math.round(diff * 100) + '%' : diff})` : diff < 0 ? `(${isPct ? Math.round(diff * 100) + '%' : diff})` : '';
                  const diffColor = diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-gray-600';
                  return (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-400">{t(`stat.${key}`)}</span>
                      <span className="text-white">{displayVal} <span className={diffColor}>{diffStr}</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <button className="w-full py-3 bg-game-accent text-black font-bold rounded-lg hover:scale-[1.01] transition"
          onClick={handleStart}>
          {t('common.start')} →
        </button>
      </div>
    </div>
  );
}
