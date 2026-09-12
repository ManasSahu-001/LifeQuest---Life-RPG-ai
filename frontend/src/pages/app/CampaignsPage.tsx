import React, { useState, useEffect } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { audioEngine } from '../../services/audioEngine.js';
import { AIQuestMasterModal } from '../../components/campaigns/AIQuestMasterModal.js';
import { BossArenaView } from '../../components/campaigns/BossArenaView.js';
import {
  Wand2,
  Sparkles,
  Sword,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Trophy,
  Loader2,
  Calendar,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CampaignsPage: React.FC = () => {
  const { character, refreshCharacter } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeBoss, setActiveBoss] = useState<any>(null);
  const [campaignQuests, setCampaignQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastDamage, setLastDamage] = useState<any>(null);
  const [completingQuestId, setCompletingQuestId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [cRes, bRes, qRes] = await Promise.all([
        api.get('/api/campaigns'),
        api.get('/api/campaigns/active-boss'),
        api.get('/api/quests?status=active'),
      ]);

      if (cRes.data?.success) setCampaigns(cRes.data.campaigns || []);
      if (bRes.data?.success) setActiveBoss(bRes.data.boss || null);
      if (qRes.data?.success) {
        // filter quests that have campaign_id
        setCampaignQuests(
          (qRes.data.quests || []).filter((q: any) => q.campaign_id)
        );
      }
    } catch (err) {
      console.error('Failed to load campaigns data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCampaignForged = (newCampaignData: any) => {
    fetchData();
    if (refreshCharacter) refreshCharacter();
  };

  const handleCompleteQuest = async (questId: number) => {
    setCompletingQuestId(questId);
    audioEngine.playAttack();

    try {
      const res = await api.post(`/api/quests/${questId}/complete`);
      if (res.data?.success) {
        audioEngine.playLevelUp();
        if (res.data.campaignBossDamage) {
          setLastDamage(res.data.campaignBossDamage);
        } else {
          setLastDamage({ damageDealt: 75, isDefeated: false });
        }

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });

        if (refreshCharacter) refreshCharacter();
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || 'Quest completion failed.');
    } finally {
      setCompletingQuestId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono animate-pulse">
        Consulting the AI Quest Master oracle...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              AI CAMPAIGN HEADQUARTERS
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Generative RPG Forge
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            AI Quest Master & Boss Incursions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Turn real-world ambitions into multi-phase quest chains and summon towering Nemesis Bosses.
          </p>
        </div>

        <button
          onClick={() => {
            audioEngine.playClick();
            setIsModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--rpg-primary)] via-[var(--rpg-secondary)] to-[var(--rpg-accent)] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:opacity-95 transition-opacity"
        >
          <Wand2 className="w-4 h-4" /> Forge New Campaign
        </button>
      </div>

      {/* Active Campaign Nemesis Boss Arena */}
      <BossArenaView boss={activeBoss} lastDamage={lastDamage} />

      {/* Active Campaign Quests Ready for Combat */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-black text-white flex items-center gap-2">
          <Sword className="w-5 h-5 text-red-400" />
          Active Campaign Strikes (Direct Boss Damage)
        </h2>

        {campaignQuests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[var(--rpg-surface)] border border-[var(--rpg-border)] text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-300">All Campaign Quests Cleared!</p>
            <p className="text-xs text-slate-500 mt-1">
              Click "Forge New Campaign" above to spawn your next epic challenge.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaignQuests.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-xl bg-[var(--rpg-surface)] border border-[var(--rpg-border)] hover:border-[var(--rpg-primary)]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                      {q.difficulty?.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> -{q.boss_damage || 75} Boss HP
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{q.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{q.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-cyan-400 font-bold">+{q.xp_reward} XP</span>
                    <span className="text-amber-400 font-bold">+{q.gold_reward} G</span>
                  </div>

                  <button
                    onClick={() => handleCompleteQuest(q.id)}
                    disabled={completingQuestId === q.id}
                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    {completingQuestId === q.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Striking...
                      </>
                    ) : (
                      <>
                        <Sword className="w-3.5 h-3.5" /> Strike Boss
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forged Campaigns Archive */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-black text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Campaign History & Ambitions
        </h2>

        {campaigns.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
            No active campaigns recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        c.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Goal: <span className="text-slate-200 italic">"{c.real_life_goal}"</span>
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400">
                    {c.completed_quests} / {c.total_quests} Quests
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Quest Master Modal */}
      <AIQuestMasterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCampaignForged={handleCampaignForged}
      />
    </div>
  );
};
