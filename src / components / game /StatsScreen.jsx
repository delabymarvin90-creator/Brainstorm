/**
 * StatsScreen — displays lifetime statistics and progression.
 */
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { AudioManager } from '@/game/systems/AudioManager';
import { SaveManager } from '@/game/systems/SaveManager';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function StatsScreen() {
  const game = useGame();
  const { t } = useTranslation();
  const stats = SaveManager.getStats();
  const prog = game.progression;
  const runsByMode = stats.runsByMode || {};

  const statRows = [
    { label: t('stats.total_play_time'), value: formatTime(stats.totalPlayTime || 0) },
    { label: t('stats.total_kills'), value: prog.totalKills },
    { label: t('stats.total_gold'), value: prog.totalGold },
    { label: t('stats.total_runs'), value: prog.totalRuns },
    { label: t('stats.total_wins'), value: prog.totalWins },
    { label: t('stats.highest_wave'), value: prog.highestWave },
    { label: t('stats.highest_wave_infinite'), value: stats.highestWaveInfinite || 0 },
    { label: t('stats.bosses_killed'), value: prog.bossesKilled },
    { label: t('stats.total_damage'), value: Math.round(stats.totalDamageDealt || 0) },
    { label: t('stats.total_xp'), value: Math.round(stats.totalXPEarned || 0) },
    { label: t('stats.chars_unlocked'), value: `${prog.unlockedCharacters.length}/10` },
  ];

  return (
    <div className="fixed inset-0 bg-game-bg overflow-y-auto p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="font-pixel text-xl text-game-accent mb-4 text-center">{t('stats.title')}</h1>

        <div className="bg-game-card rounded-lg border border-gray-700 divide-y divide-gray-800 mb-4">
          {statRows.map((row, i) => (
            <div key={i} className="flex justify-between items-center px-4 py-2.5">
              <span className="text-gray-400 text-sm">{row.label}</span>
              <span className="text-white font-bold text-sm">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Runs by mode */}
        {Object.keys(runsByMode).length > 0 && (
          <div className="bg-game-card rounded-lg border border-gray-700 p-4 mb-4">
            <h3 className="text-game-accent font-bold text-sm mb-2">{t('stats.runs_by_mode')}</h3>
            {Object.entries(runsByMode).map(([mode, count]) => (
              <div key={mode} className="flex justify-between text-sm py-1">
                <span className="text-gray-400 capitalize">{mode.replace('mode_', '')}</span>
                <span className="text-white">{count}</span>
              </div>
            ))}
          </div>
        )}

        <button className="px-6 py-2 bg-game-card text-gray-300 border border-gray-700 rounded hover:text-white transition"
          onClick={() => { AudioManager.buttonClick(); game.navigate('menu'); }}>
          {t('common.back')}
        </button>
      </div>
    </div>
  );
}
