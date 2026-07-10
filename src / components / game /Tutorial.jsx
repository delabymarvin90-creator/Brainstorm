/**
 * Tutorial — step-by-step overlay teaching the basics.
 */
import { useState } from 'react';
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { AudioManager } from '@/game/systems/AudioManager';

export default function Tutorial() {
  const game = useGame();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const steps = [t('tut.step1'), t('tut.step2'), t('tut.step3'), t('tut.step4'), t('tut.step5')];

  const next = () => {
    AudioManager.buttonClick();
    if (step < steps.length - 1) setStep(step + 1);
    else game.navigate('menu');
  };

  const skip = () => {
    AudioManager.buttonClick();
    game.navigate('menu');
  };

  return (
    <div className="fixed inset-0 bg-game-bg flex flex-col items-center justify-center gap-8 p-8">
      <h2 className="font-pixel text-xl text-game-accent">{t('tut.title')}</h2>

      <div className="flex gap-2">
        {steps.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition ${i === step ? 'bg-game-accent' : 'bg-gray-700'}`} />
        ))}
      </div>

      <p className="text-white text-center max-w-md text-lg leading-relaxed">{steps[step]}</p>

      <div className="flex gap-4">
        <button className="px-6 py-2 border border-gray-700 text-gray-400 rounded hover:bg-gray-800 transition"
          onClick={skip}>
          {t('tut.skip')}
        </button>
        <button className="px-8 py-2 bg-game-accent text-black font-bold rounded hover:scale-105 transition"
          onClick={next}>
          {step < steps.length - 1 ? t('tut.next') : t('tut.done')}
        </button>
      </div>
    </div>
  );
}
