import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { WalkingHeroSprite } from '../character/WalkingHeroSprite.js';
import { Modal } from '../shared/Modal.js';
import { audioEngine } from '../../services/audioEngine.js';
import {
  Compass,
  MapPin,
  CheckCircle2,
  Lock,
  Sparkles,
  Sword,
  Building2,
  Award,
  Zap,
  Gift,
  Flame,
  ArrowRight,
  Shield,
  Coins,
  Gem,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const JourneyView: React.FC = () => {
  const { currentThemeId, switchTheme } = useTheme();
  const { character } = useAuth();
  const [selectedWaypoint, setSelectedWaypoint] = useState<any>(null);

  const currentLevel = character?.level || 1;
  const currentXp = character?.current_xp || 0;
  const requiredXp = character?.requiredXP || 100;
  const progressPercent = Math.min(100, Math.round((currentXp / requiredXp) * 100));

  // 8 Progressive Waypoints along the Adventure Track
  const waypoints = [
    {
      level: 1,
      name: 'Cyberpunk Neon Outpost',
      realm: 'Cyberpunk Synthwave',
      themeId: 'theme-a',
      boss: 'The Procrastination Behemoth',
      icon: 'Cpu',
      description: 'The glowing neon threshold where rookies overcome digital chaos and build initial focus.',
      rewards: { gold: 50, xp: 100, title: 'Cyber Netrunner' },
    },
    {
      level: 2,
      name: 'High Fantasy Bastion',
      realm: 'High Fantasy Realm',
      themeId: 'theme-b',
      boss: 'Dread Dragon Fafnir',
      icon: 'Shield',
      description: 'Ancient stone fortress where heroic paladins study arcane scriptures and forge iron will.',
      rewards: { gold: 100, xp: 250, title: 'Paladin Knight' },
    },
    {
      level: 3,
      name: 'Solar Biophilic Canopy',
      realm: 'Solarpunk Metropolis',
      themeId: 'theme-c',
      boss: 'The Smog Colossus',
      icon: 'Sun',
      description: 'Sun-drenched urban glass domes combining ecological harmony with rigorous habits.',
      rewards: { gold: 150, xp: 400, title: 'Solar Botanist' },
    },
    {
      level: 4,
      name: 'The Sacred Druidic Grove',
      realm: 'Enchanted Forest',
      themeId: 'theme-d',
      boss: 'Malakor, The Blight Treant',
      icon: 'TreePine',
      description: 'Ancient world tree radiating primal vitality and physical endurance.',
      rewards: { gold: 200, xp: 600, title: 'Forest Druid' },
    },
    {
      level: 5,
      name: 'Mount Ronin Dojo',
      realm: 'Last Samurai Standing',
      themeId: 'theme-e',
      boss: 'Kurokage, The Shadow Shogun',
      icon: 'Sword',
      description: 'Mist-shrouded temple testing the warrior code of honor, patience, and relentless discipline.',
      rewards: { gold: 250, xp: 850, title: 'Samurai Ronin' },
    },
    {
      level: 6,
      name: 'Metropolitan Core Megastructure',
      realm: 'Build Your City',
      themeId: 'theme-f',
      boss: 'Titan OVERLOAD-9',
      icon: 'Building2',
      description: 'Sprawling high-tech metropolis where master architects direct civil construction.',
      rewards: { gold: 300, xp: 1200, title: 'Cyber Architect' },
    },
    {
      level: 7,
      name: 'Spectral Necropolis of Malathrax',
      realm: 'Haunted World: Cursed Necropolis',
      themeId: 'theme-g',
      boss: 'Lord Malathrax, The Cursed Lich',
      icon: 'Ghost',
      description: 'Cursed gothic catacombs where sorcerers shatter ancient procrastination phylacteries.',
      rewards: { gold: 400, xp: 1600, title: 'Eldritch Sorcerer' },
    },
    {
      level: 8,
      name: 'The Upside Down Dimensional Rift',
      realm: 'The Upside Down: Hawkins 1984',
      themeId: 'theme-h',
      boss: 'The Mind Flayer',
      icon: 'Radio',
      description: 'Interdimensional dark reflection of reality where psionic masters close the Hawkins gate.',
      rewards: { gold: 500, xp: 2000, title: 'Psionic Shadow Walker' },
    },
  ];

  const handleSelectWaypoint = (wp: any) => {
    audioEngine.playClick();
    setSelectedWaypoint(wp);
  };

  const handleTravelToRealm = async (themeId: string) => {
    try {
      await switchTheme(themeId);
      audioEngine.playLevelUp();
      setSelectedWaypoint(null);
    } catch (err: any) {
      alert(err.message || 'Failed to travel to realm.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              EXPEDITION MAP
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Level {currentLevel} Pathfinder
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Realm Odyssey & Journey Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Traverse 8 progressive realms, vanquish world bosses, and unlock legendary character classes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <WalkingHeroSprite level={currentLevel} isWalking={true} scale={1.2} />
        </div>
      </div>

      {/* Interactive Waypoint Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {waypoints.map((wp, idx) => {
          const isUnlocked = currentLevel >= wp.level;
          const isCurrent = currentLevel === wp.level;
          const isPast = currentLevel > wp.level;
          const isSelectedRealm = currentThemeId === wp.themeId;

          return (
            <motion.div
              key={wp.themeId}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelectWaypoint(wp)}
              className={`p-5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                isSelectedRealm
                  ? 'bg-gradient-to-b from-[var(--rpg-primary)]/20 to-[var(--rpg-surface)] border-[var(--rpg-primary)] shadow-lg shadow-[var(--rpg-primary)]/20'
                  : isUnlocked
                  ? 'bg-[var(--rpg-surface)] border-[var(--rpg-border)] hover:border-white/30'
                  : 'bg-slate-950/60 border-slate-800 opacity-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                    STAGE {idx + 1}
                  </span>
                  {isPast ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conquered
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 animate-pulse">
                      <Compass className="w-3.5 h-3.5" /> Active Frontier
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <Lock className="w-3.5 h-3.5" /> Lvl {wp.level}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{wp.name}</h3>
                <span className="text-[11px] font-mono text-[var(--rpg-primary)] block mb-2 font-semibold">
                  {wp.realm}
                </span>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {wp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sword className="w-3.5 h-3.5 text-red-400" />
                  <span className="truncate max-w-[120px]">{wp.boss}</span>
                </span>
                <span className="text-amber-400 font-bold font-mono">+{wp.rewards.gold} G</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Waypoint Details Modal */}
      {selectedWaypoint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedWaypoint(null)}
          title={selectedWaypoint.name}
          subtitle={`Milestone Level ${selectedWaypoint.level} • ${selectedWaypoint.realm}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedWaypoint.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Nemesis World Boss:</span>
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <Sword className="w-3.5 h-3.5" /> {selectedWaypoint.boss}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Class Unlock:</span>
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {selectedWaypoint.rewards.title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Bounty Rewards:</span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <span>+{selectedWaypoint.rewards.gold} G</span>
                  <span>+{selectedWaypoint.rewards.xp} XP</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedWaypoint(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              {currentLevel >= selectedWaypoint.level ? (
                <button
                  onClick={() => handleTravelToRealm(selectedWaypoint.themeId)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--rpg-primary)] to-[var(--rpg-secondary)] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Compass className="w-3.5 h-3.5" /> Travel to this Realm
                </button>
              ) : (
                <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Requires Character Level {selectedWaypoint.level}
                </span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
