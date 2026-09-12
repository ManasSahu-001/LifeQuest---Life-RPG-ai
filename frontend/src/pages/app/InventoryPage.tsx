import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Coffee,
  Gamepad2,
  Utensils,
  BookOpen,
  Compass,
  Coins,
  CheckCircle2,
  Gift,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { Button } from '../../components/shared/Button.js';

export const InventoryPage: React.FC = () => {
  const { character, refreshCharacter } = useAuth();
  const { showToast } = useToast();
  const [shopRewards, setShopRewards] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRewards = async () => {
    try {
      const res = await api.getRewards();
      if (res.data.success) {
        setShopRewards(res.data.shopRewards);
        setInventory(res.data.inventory);
      }
    } catch (err) {
      console.warn('Failed to load rewards', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const getRewardIcon = (icon: string) => {
    switch (icon) {
      case 'coffee':
        return Coffee;
      case 'gamepad-2':
        return Gamepad2;
      case 'utensils':
        return Utensils;
      case 'book-open':
        return BookOpen;
      case 'compass':
        return Compass;
      default:
        return Gift;
    }
  };

  const handlePurchase = async (reward: any) => {
    if ((character?.gold || 0) < reward.cost_gold) {
      showToast(`Insufficient gold! You need ${reward.cost_gold} Gold but only have ${character?.gold || 0}.`, 'error');
      return;
    }

    setPurchasingId(reward.id);
    try {
      const res = await api.purchaseReward(reward.id);
      if (res.data.success) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#ffe600', '#f59e0b', '#d4af37'],
        });
        setMessage(`🎉 Purchased "${reward.title}"! Added to your inventory.`);
        showToast(`Purchased "${reward.title}"! Added to your inventory.`, 'success');
        await fetchRewards();
        await refreshCharacter();
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Purchase failed', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  const handleClaim = async (userRewardId: number) => {
    setClaimingId(userRewardId);
    try {
      const res = await api.claimReward(userRewardId);
      if (res.data.success) {
        setMessage('✅ Reward marked as enjoyed/claimed!');
        showToast('Reward marked as enjoyed/claimed!', 'success');
        await fetchRewards();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to claim reward', 'error');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-[var(--rpg-text)] flex items-center gap-2">
            <Package className="w-6 h-6 text-[var(--rpg-primary)]" />
            Reward Shop & Inventory
          </h1>
          <p className="text-xs text-[var(--rpg-muted)] font-mono">
            Exchange your hard-earned gold for guilt-free real-world treats
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] px-4 py-2 rounded-[var(--rpg-radius)] font-mono text-xs font-bold text-amber-300">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Available Gold: {character?.gold || 0}</span>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded text-xs font-mono font-bold bg-amber-950/40 border border-amber-500/50 text-amber-300 text-center"
        >
          {message}
        </motion.div>
      )}

      {/* Shop Items Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-4 h-4 text-[var(--rpg-primary)]" />
          <h2 className="text-base font-heading font-bold text-[var(--rpg-text)]">
            The Grand Bazaar (Shop Items)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopRewards.map((reward) => {
            const Icon = getRewardIcon(reward.icon);
            const canAfford = (character?.gold || 0) >= reward.cost_gold;

            return (
              <div
                key={reward.id}
                className="p-5 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] flex flex-col justify-between hover:border-[var(--rpg-primary)] hover:shadow-[var(--rpg-glow)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-primary)]/40 flex items-center justify-center text-[var(--rpg-primary)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 font-mono text-sm font-bold text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">
                      <Coins className="w-3.5 h-3.5" />
                      {reward.cost_gold} Gold
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--rpg-text)] mb-1">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-[var(--rpg-muted)] mb-4 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <Button
                  variant={canAfford ? 'primary' : 'outline'}
                  size="sm"
                  disabled={!canAfford}
                  isLoading={purchasingId === reward.id}
                  onClick={() => handlePurchase(reward)}
                  className="w-full"
                >
                  {canAfford ? 'Purchase with Gold' : 'Need More Gold'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventory Section */}
      <div className="pt-6 border-t border-[var(--rpg-border)]">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-4 h-4 text-[var(--rpg-primary)]" />
          <h2 className="text-base font-heading font-bold text-[var(--rpg-text)]">
            Purchased Inventory ({inventory.length})
          </h2>
        </div>

        {inventory.length === 0 ? (
          <div className="p-8 text-center rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-dashed border-[var(--rpg-border)]">
            <p className="text-xs text-[var(--rpg-muted)]">
              Your inventory is empty. Save gold from completed quests and redeem items above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => {
              const Icon = getRewardIcon(item.icon);
              return (
                <div
                  key={item.user_reward_id}
                  className={`p-4 rounded-[var(--rpg-radius)] border flex items-center justify-between gap-3 ${
                    item.is_claimed
                      ? 'bg-[var(--rpg-bg)]/40 border-[var(--rpg-border)] opacity-60'
                      : 'bg-[var(--rpg-surface)] border-[var(--rpg-primary)]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded bg-[var(--rpg-bg)] text-[var(--rpg-primary)] flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[var(--rpg-text)] truncate">
                        {item.title}
                      </h4>
                      <div className="text-[10px] text-[var(--rpg-muted)] font-mono">
                        Purchased {new Date(item.purchased_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {item.is_claimed ? (
                      <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                        Claimed
                      </span>
                    ) : (
                      <Button
                        variant="gold"
                        size="sm"
                        isLoading={claimingId === item.user_reward_id}
                        onClick={() => handleClaim(item.user_reward_id)}
                        className="text-[11px]"
                      >
                        Redeem
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
