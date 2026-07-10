/**
 * OptionsScreen — tabbed settings: Video, Audio, Controls, Language, Accessibility.
 */
import { useState } from 'react';
import { useGame } from '@/game/GameContext';
import { useTranslation } from '@/game/i18n';
import { AudioManager } from '@/game/systems/AudioManager';

const TABS = ['video', 'audio', 'controls', 'language', 'accessibility'];

export default function OptionsScreen() {
  const game = useGame();
  const { t } = useTranslation();
  const [tab, setTab] = useState('video');
  const [opts, setOpts] = useState(game.options);
  const [listening, setListening] = useState(null);

  const update = (path, value) => {
    const newOpts = { ...opts };
    const keys = path.split('.');
    let obj = newOpts;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setOpts(newOpts);
    game.updateOptions(newOpts);
  };

  const startRemap = (key) => {
    setListening(key);
    const handler = (e) => {
      e.preventDefault();
      update(`controls.${key}`, e.code);
      setListening(null);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('keydown', handler);
  };

  const resetAll = () => {
    if (window.confirm(t('opt.reset_confirm'))) {
      game.resetSave();
      window.location.reload();
    }
  };

  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className={`w-12 h-6 rounded-full transition ${on ? 'bg-game-accent' : 'bg-gray-700'}`}>
      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );

  const Slider = ({ value, onChange }) => (
    <input type="range" min="0" max="1" step="0.05" value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1 accent-game-accent" />
  );

  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between py-2 gap-4">
      <span className="text-gray-300 text-sm">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-game-bg overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-400 hover:text-white text-sm"
            onClick={() => { AudioManager.buttonClick(); game.navigate('menu'); }}>
            ← {t('common.back')}
          </button>
          <h2 className="font-pixel text-lg text-game-accent">{t('opt.title')}</h2>
          <div className="w-16" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {TABS.map(tb => (
            <button key={tb} onClick={() => setTab(tb)}
              className={`px-3 py-1.5 rounded text-sm transition ${tab === tb ? 'bg-game-accent text-black font-bold' : 'bg-game-card text-gray-400 hover:text-white'}`}>
              {t(`opt.${tb}`)}
            </button>
          ))}
        </div>

        <div className="bg-game-card rounded-lg p-4 border border-gray-700">
          {tab === 'video' && (
            <>
              <Row label={t('opt.quality')}>
                <select value={opts.video.quality} onChange={(e) => update('video.quality', e.target.value)}
                  className="bg-black/40 text-white text-sm rounded px-2 py-1 border border-gray-700">
                  <option value="low">{t('opt.quality_low')}</option>
                  <option value="medium">{t('opt.quality_medium')}</option>
                  <option value="high">{t('opt.quality_high')}</option>
                </select>
              </Row>
              <Row label={t('opt.fullscreen')}>
                <Toggle on={opts.video.fullscreen} onClick={() => update('video.fullscreen', !opts.video.fullscreen)} />
              </Row>
              <Row label={t('opt.vsync')}>
                <Toggle on={opts.video.vsync} onClick={() => update('video.vsync', !opts.video.vsync)} />
              </Row>
              <Row label={t('opt.screen_shake')}>
                <Toggle on={opts.video.screenShake} onClick={() => update('video.screenShake', !opts.video.screenShake)} />
              </Row>
            </>
          )}

          {tab === 'audio' && (
            <>
              <Row label={t('opt.master_volume')}>
                <Slider value={opts.audio.master} onChange={(v) => update('audio.master', v)} />
                <span className="text-white text-xs w-8">{Math.round(opts.audio.master * 100)}</span>
              </Row>
              <Row label={t('opt.music_volume')}>
                <Slider value={opts.audio.music} onChange={(v) => update('audio.music', v)} />
                <span className="text-white text-xs w-8">{Math.round(opts.audio.music * 100)}</span>
              </Row>
              <Row label={t('opt.sfx_volume')}>
                <Slider value={opts.audio.sfx} onChange={(v) => update('audio.sfx', v)} />
                <span className="text-white text-xs w-8">{Math.round(opts.audio.sfx * 100)}</span>
              </Row>
            </>
          )}

          {tab === 'controls' && (
            <>
              {['up', 'down', 'left', 'right'].map(key => (
                <Row key={key} label={t(`opt.${key}`)}>
                  <button onClick={() => startRemap(key)}
                    className="px-4 py-1.5 bg-black/40 text-white text-sm rounded border border-gray-700 hover:border-game-accent min-w-[100px]">
                    {listening === key ? '...' : opts.controls[key]}
                  </button>
                </Row>
              ))}
            </>
          )}

          {tab === 'language' && (
            <div className="flex gap-3 justify-center py-4">
              {['fr', 'en'].map(l => (
                <button key={l} onClick={() => update('language', l)}
                  className={`px-6 py-3 rounded font-bold transition ${opts.language === l ? 'bg-game-accent text-black' : 'bg-black/40 text-gray-400 border border-gray-700'}`}>
                  {l === 'fr' ? t('opt.french') : t('opt.english')}
                </button>
              ))}
            </div>
          )}

          {tab === 'accessibility' && (
            <>
              <Row label={t('opt.reduce_effects')}>
                <Toggle on={opts.accessibility.reduceEffects} onClick={() => update('accessibility.reduceEffects', !opts.accessibility.reduceEffects)} />
              </Row>
              <Row label={t('opt.colorblind')}>
                <select value={opts.accessibility.colorblind} onChange={(e) => update('accessibility.colorblind', e.target.value)}
                  className="bg-black/40 text-white text-sm rounded px-2 py-1 border border-gray-700">
                  <option value="none">{t('opt.colorblind_none')}</option>
                  <option value="protanopia">{t('opt.colorblind_protanopia')}</option>
                  <option value="deuteranopia">{t('opt.colorblind_deuteranopia')}</option>
                </select>
              </Row>
              <Row label={t('opt.text_size')}>
                <select value={opts.accessibility.textSize} onChange={(e) => update('accessibility.textSize', e.target.value)}
                  className="bg-black/40 text-white text-sm rounded px-2 py-1 border border-gray-700">
                  <option value="small">{t('opt.text_small')}</option>
                  <option value="medium">{t('opt.text_medium')}</option>
                  <option value="large">{t('opt.text_large')}</option>
                </select>
              </Row>
            </>
          )}
        </div>

        <button className="w-full mt-4 py-2 border border-red-800 text-red-400 rounded text-sm hover:bg-red-900/30 transition"
          onClick={resetAll}>
          {t('opt.reset')}
        </button>
      </div>
    </div>
  );
}
