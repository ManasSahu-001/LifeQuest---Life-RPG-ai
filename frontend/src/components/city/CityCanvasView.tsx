import React, { useState, useEffect } from 'react';
import { api } from '../../api/client.js';
import { audioEngine } from '../../services/audioEngine.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import {
  Building2,
  Users,
  Coins,
  Trophy,
  Hammer,
  Cpu,
  BookOpen,
  Dumbbell,
  Heart,
  Landmark,
  Palette,
  Sparkles,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CityCanvasView: React.FC = () => {
  const { character, refreshCharacter } = useAuth();
  const { showToast } = useToast();
  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [constructingKey, setConstructingKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchCity = async () => {
    try {
      const res = await api.getCity();
      if (res.data?.success) {
        setCityData(res.data);
      }
    } catch (err) {
      console.error('Failed to load city data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCity();
  }, []);

  const handleConstruct = async (buildingKey: string) => {
    setConstructingKey(buildingKey);
    audioEngine.playClick();

    try {
      const res = await api.constructBuilding(buildingKey);
      if (res.data?.success) {
        audioEngine.playLevelUp();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        setMessage(res.data.message);
        showToast(res.data.message || 'District upgraded!', 'success');
        if (refreshCharacter) refreshCharacter();
        fetchCity();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Construction failed.', 'error');
    } finally {
      setConstructingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono animate-pulse">
        Surveying territorial blueprints and urban districts...
      </div>
    );
  }

  const districtsConfig = [
    { key: 'technology', label: 'Technology District', icon: Cpu, color: 'text-cyan-400' },
    { key: 'knowledge', label: 'Knowledge Academy', icon: BookOpen, color: 'text-blue-400' },
    { key: 'strength', label: 'Strength & Defense', icon: Dumbbell, color: 'text-red-400' },
    { key: 'wellness', label: 'Sanctuary of Wellness', icon: Heart, color: 'text-emerald-400' },
    { key: 'economy', label: 'Treasury & Commerce', icon: Landmark, color: 'text-amber-400' },
    { key: 'culture', label: 'Cultural Arts', icon: Palette, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* City Overview Hero Card */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                METROPOLITAN CHARTER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Tier {Math.min(6, Math.floor((cityData?.level || 1) / 2) + 1)} Settlement
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-wide text-white">
              {cityData?.cityName || 'Neo Haven'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Governed by:</span>
              <span className="text-slate-200 font-semibold">{cityData?.governorTitle || 'Founder'}</span>
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Population</span>
              </div>
              <span className="text-base sm:text-lg font-black font-mono text-white">
                {(cityData?.population || 120).toLocaleString()}
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buildings</span>
              </div>
              <span className="text-base sm:text-lg font-black font-mono text-white">
                {cityData?.buildings?.length || 0}
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Treasury</span>
              </div>
              <span className="text-base sm:text-lg font-black font-mono text-amber-300">
                {cityData?.gold || character?.gold || 0} G
              </span>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Visual District Status Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-heading font-black text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Metropolitan District Overview
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {districtsConfig.length} Specialized Sectors
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {districtsConfig.map((d) => {
            const DistrictIcon = d.icon;
            const districtBuildings = cityData?.buildings?.filter(
              (b: any) => b.district?.toLowerCase() === d.key.toLowerCase()
            ) || [];
            const isOperational = districtBuildings.length > 0;

            return (
              <div
                key={d.key}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isOperational
                    ? 'bg-slate-900/60 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                }`}
              >
                <div className={`p-2 rounded-lg bg-white/5 mb-2 ${d.color}`}>
                  <DistrictIcon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 truncate w-full">{d.label}</h4>
                <span className="text-[10px] font-mono mt-1 text-slate-400">
                  {isOperational ? `${districtBuildings.length} Facilities` : 'Undeveloped'}
                </span>
                {isOperational ? (
                  <span className="mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
                    ACTIVE
                  </span>
                ) : (
                  <span className="mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-500 border border-slate-800">
                    OPEN LOT
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Districts Construction Catalog */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-black text-white flex items-center gap-2">
          <Hammer className="w-5 h-5 text-[var(--rpg-primary)]" />
          District Construction Blueprint Catalog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityData?.catalog?.map((b: any) => {
            const isBuilt = b.isUnlocked;
            const canBuild = b.canAfford && b.meetsLevel && !isBuilt;

            return (
              <div
                key={b.key}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isBuilt
                    ? 'bg-slate-900/40 border-emerald-500/30'
                    : canBuild
                    ? 'bg-[var(--rpg-surface)] border-[var(--rpg-border)] hover:border-[var(--rpg-primary)]/60'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      {b.district}
                    </span>
                    {isBuilt ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Built
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {b.cost} G
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{b.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{b.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Requires Level {b.minLevel}
                  </span>

                  {isBuilt ? (
                    <span className="text-emerald-400 font-bold text-xs">Operational</span>
                  ) : (
                    <button
                      onClick={() => handleConstruct(b.key)}
                      disabled={!canBuild || constructingKey === b.key}
                      className="px-3 py-1.5 rounded-lg bg-[var(--rpg-primary)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs flex items-center gap-1.5 transition-opacity"
                    >
                      {constructingKey === b.key ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" /> Building...
                        </>
                      ) : !b.meetsLevel ? (
                        <>
                          <Lock className="w-3 h-3" /> Locked
                        </>
                      ) : !b.canAfford ? (
                        'Need Gold'
                      ) : (
                        <>
                          <Hammer className="w-3 h-3" /> Construct
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
    </div>
  );
};
