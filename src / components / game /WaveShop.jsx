/**
 * WaveShop — inter-wave shop overlay. Buy/sell weapons and items, then start next wave.
 */
import { useTranslation } from '@/game/i18n';
import { EventBus } from '@/game/systems/EventBus';
import { RARITIES } from '@/game/data/items';

const RARITY_BORDER = {
  common: 'border-gray-600', uncommon: 'border-green-600',
  rare: 'border-blue-600', epic: 'border-purple-600', legendary: 'border-amber-600',
};
const RARITY_TEXT = {
  common: 'text-gray-400', uncommon: 'text-green-400',
  rare: 'text-blue-400', epic: 'text-purple-400', legendary: 'text-amber-400',
};

export default function WaveShop({ data, onNextWave }) {
  const { t, lang } = useTranslation();
  const nameOf = (o) => (lang === 'fr' ? o.name_fr : o.name) || o.name;
  const descOf = (o) => (lang === 'fr' ? o.desc_fr : o.desc) || o.desc;

  const buyWeapon = (w) => EventBus.emit('ui:buy_weapon', { weaponId: w.id, cost: w.cost });
  const buyItem = (item) => EventBus.emit('ui:buy_item', { itemId: item.id, cost: item.cost });
  const sellWeapon = (idx) => EventBus.emit('ui:sell_weapon', { index: idx });
  const sellItem = (idx) => EventBus.emit('ui:sell_item', { index: idx });

  return (
    <div className="absolute inset-0 bg-game-bg/95 overflow-y-auto z-50 p-4">
      <div className="max-w-[850px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-lg text-game-accent">{t('shop.title')} — {t('hud.wave')} {data.wave}</h2>
          <div className="text-game-gold font-bold text-lg">{data.gold}G</div>
        </div>

        {/* Current loadout */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-game-card rounded-lg p-3 border border-gray-700">
            <h3 className="text-white font-bold text-sm mb-2">{t('shop.weapons')} ({data.weapons.length}/6)</h3>
            <div className="flex flex-wrap gap-2">
              {data.weapons.map((w) => (
                <div key={w.index} className="flex items-center gap-1 bg-black/40 rounded px-2 py-1">
                  <span className="text-white text-xs">{nameOf(w)}</span>
                  <button className="text-red-400 text-xs hover:text-red-300"
                    onClick={() => sellWeapon(w.index)}>✕{w.sellPrice}G</button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-game-card rounded-lg p-3 border border-gray-700">
            <h3 className="text-white font-bold text-sm mb-2">{t('shop.items')} ({data.items.length}/12)</h3>
            <div className="flex flex-wrap gap-2">
              {data.items.map((item) => (
                <div key={item.index} className={`flex items-center gap-1 bg-black/40 rounded px-2 py-1 border ${RARITY_BORDER[item.rarity] || 'border-gray-700'}`}>
                  <span className={`text-xs ${RARITY_TEXT[item.rarity] || 'text-gray-300'}`}>{nameOf(item)[0]}</span>
                  <button className="text-red-400 text-xs hover:text-red-300"
                    onClick={() => sellItem(item.index)}>✕{item.sellPrice}G</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop: weapons */}
        <div className="mb-4">
          <h3 className="text-game-accent font-bold text-sm mb-2">{t('shop.weapons')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {data.shopWeapons.map((w) => {
              const canBuy = data.gold >= w.cost;
              return (
                <div key={w.id} className="bg-game-card rounded-lg p-3 border border-gray-700 flex flex-col gap-2">
                  <div className="text-white font-bold text-sm">{nameOf(w)}</div>
                  <div className="text-gray-400 text-xs flex-1">{descOf(w)}</div>
                  <button disabled={!canBuy}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${canBuy ? 'bg-game-accent text-black hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    onClick={() => buyWeapon(w)}>
                    {t('shop.buy')} — {w.cost}G
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shop: items */}
        <div className="mb-4">
          <h3 className="text-game-accent font-bold text-sm mb-2">{t('shop.items')}</h3>
          <div className="grid grid-cols-4 gap-3">
            {data.shopItems.map((item) => {
              const canBuy = data.gold >= item.cost;
              return (
                <div key={item.id} className={`bg-game-card rounded-lg p-3 border-2 ${RARITY_BORDER[item.rarity] || 'border-gray-700'} flex flex-col gap-2`}>
                  <div className={`text-xs uppercase ${RARITY_TEXT[item.rarity] || 'text-gray-400'}`}>{t(`rarity.${item.rarity}`)}</div>
                  <div className="text-white font-bold text-sm">{nameOf(item)}</div>
                  <div className="text-gray-400 text-xs flex-1">{descOf(item)}</div>
                  <button disabled={!canBuy}
                    className={`px-2 py-1 rounded text-xs font-bold transition ${canBuy ? 'bg-game-accent text-black hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    onClick={() => buyItem(item)}>
                    {t('shop.buy')} — {item.cost}G
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next wave button */}
        <button className="w-full py-3 bg-game-accent text-black font-bold rounded-lg hover:scale-[1.02] transition mb-4"
          onClick={onNextWave}>
          {t('shop.next_wave')} →
        </button>
      </div>
    </div>
  );
}
