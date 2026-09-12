import React, { useState, useEffect } from 'react';
import { api } from '../../api/client.js';
import { audioEngine } from '../../services/audioEngine.js';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useToast } from '../../context/ToastContext.js';
import {
  Coins,
  Shield,
  Flame,
  Skull,
  Crown,
  Gem,
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TreasuryView: React.FC = () => {
  const { character, refreshCharacter } = useAuth();
  const { currentThemeId, switchTheme } = useTheme();
  const { showToast } = useToast();
  const [shopData, setShopData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasingKey, setPurchasingKey] = useState<string | null>(null);
  const [equippingKey, setEquippingKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchShop = async () => {
    try {
      const res = await api.getEconomy();
      if (res.data?.success) {
        setShopData(res.data);
      }
    } catch (err) {
      console.error('Failed to load shop:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handlePurchase = async (itemKey: string) => {
    setPurchasingKey(itemKey);
    audioEngine.playClick();

    try {
      const res = await api.purchaseEconomyItem(itemKey);
      if (res.data?.success) {
        audioEngine.playLevelUp();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
        setMessage(res.data.message);
        showToast(res.data.message || 'Item acquired!', 'success');
        if (refreshCharacter) refreshCharacter();
        fetchShop();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Purchase failed.', 'error');
    } finally {
      setPurchasingKey(null);
    }
  };

  const handleEquip = async (item: any) => {
    setEquippingKey(item.key);
    audioEngine.playClick();

    // If theme item, switch realm!
    if (item.type === 'theme' && item.themeId) {
      try {
        await switchTheme(item.themeId);
        setMessage(`Realm activated: ${item.name}!`);
        showToast(`Realm activated: ${item.name}!`, 'realm');
        setTimeout(() => setMessage(''), 4000);
      } catch (err: any) {
        showToast(err.message || 'Theme switch failed.', 'error');
      }
    }

    try {
      const res = await api.equipEconomyItem(item.key);
      if (res.data?.success) {
        showToast(`Equipped ${item.name}`, 'info');
        fetchShop();
      }
    } catch (err) {
      console.error('Equip error:', err);
    } finally {
      setEquippingKey(null);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame': return Flame;
      case 'skull': return Skull;
      case 'shield': return Shield;
      case 'crown': return Crown;
      case 'gem': return Gem;
      default: return Sparkles;
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono animate-pulse">
        Accessing Founders Treasury & Black Market vault...
      </div>
    );
  }

  const userGold = character?.gold ?? shopData?.gold ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              FOUNDERS VAULT
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Treasury Exchange
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            City Treasury & Item Shop
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acquire realm licenses, guild pins, and mystical relics to empower your journey.
          </p>
        </div>

        {/* Current Gold Reserve */}
        <div className="px-5 py-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center gap-3">
          <Coins className="w-6 h-6 text-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Your Balance</div>
            <div className="text-xl font-mono font-black text-amber-300">{userGold} G</div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopData?.shop?.map((item: any) => {
          const IconComp = getIcon(item.icon);
          const isOwned = item.isOwned;
          const isEquipped = item.isEquipped || (item.themeId && currentThemeId === item.themeId);
          const canAfford = userGold >= item.cost;

          return (
            <div
              key={item.key}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isOwned
                  ? 'bg-slate-900/50 border-cyan-500/30'
                  : canAfford
                  ? 'bg-[var(--rpg-surface)] border-[var(--rpg-border)] hover:border-[var(--rpg-primary)]/60'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-[var(--rpg-primary)]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  {isOwned ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 border border-cyan-700 text-cyan-300">
                      Owned
                    </span>
                  ) : (
                    <span className="text-sm font-mono font-bold text-amber-400">
                      {item.cost} G
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
                  {item.type}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {isOwned ? (
                  <button
                    onClick={() => handleEquip(item)}
                    disabled={equippingKey === item.key}
                    className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isEquipped
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Equipped / Active
                      </>
                    ) : (
                      'Equip / Activate'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.key)}
                    disabled={!canAfford || purchasingKey === item.key}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-[var(--rpg-primary)] to-[var(--rpg-secondary)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-opacity"
                  >
                    {purchasingKey === item.key ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Purchasing...
                      </>
                    ) : !canAfford ? (
                      'Insufficient Gold'
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" /> Purchase ({item.cost} G)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
