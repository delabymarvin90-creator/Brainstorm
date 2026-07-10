/**
 * GameOverScreen — end-of-run stats overlay with Retry and Main Menu buttons.
 */
import { useTranslation } from '@/game/i18n';

export default function GameOverScreen({ stats, onRetry, onMainMenu }) {
  const { t } = useTranslation();
  const isVictory = stats.victory;
  const mins = Math.floor(stats.timeSurvived / 60);
  const secs = stats.timeSurvived % 60;

  const rows = [
    { label: t('gameover.wave_reached'), value: stats.waveReached },
    { label: t('gameover.enemies_killed'), value: stats.enemiesKilled },
    { label: t('gameover.damage_dealt'), value: stats.damageDealt },
    { label: t('gameover.time_survived'), value: `${mins}:${String(secs).padStart(2, '0')}` },
    { label: t('gameover.gold_earned'), value: stats.goldEarned },
    { label: t('gameover.materials_earned'), value: stats.materialsEarned },
  ];

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 z-50">
      <h2 className={`font-pixel text-3xl ${isVictory ? 'text-game-gold' : 'text-game-danger'}`}>
        {isVictory ? t('gameover.victory') : t('gameover.title')}
      </h2>

      <div className="bg-game-card rounded-lg p-6 border border-gray-700 min-w-[300px]">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between py-1 text-sm">
            <span className="text-gray-400">{r.label}</span>
            <span className="text-white font-bold">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button className="px-8 py-3 bg-game-accent text-black font-bold rounded hover:scale-105 transition"
          onClick={onRetry}>
          {t('gameover.retry')}
        </button>
        <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition"
          onClick={onMainMenu}>
          {t('gameover.menu')}
        </button>
      </div>
    </div>
  );
}
