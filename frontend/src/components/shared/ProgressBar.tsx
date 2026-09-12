import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.js';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  subLabel?: string;
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  subLabel,
  color,
  height = 'md',
  showPercentage = true,
}) => {
  const { currentThemeId } = useTheme();
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  const getDefaultColor = () => {
    if (color) return color;
    if (currentThemeId === 'theme-a') return '#00f0ff';
    if (currentThemeId === 'theme-b') return '#d4af37';
    return '#10b981';
  };

  const activeColor = getDefaultColor();

  return (
    <div className="w-full">
      {(label || showPercentage || subLabel) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-[var(--rpg-muted)]">
          <span className="text-[var(--rpg-text)] font-semibold flex items-center gap-1.5">
            {label}
          </span>
          <div className="flex items-center gap-2">
            {subLabel && <span>{subLabel}</span>}
            {showPercentage && (
              <span className="font-mono text-[var(--rpg-text)] font-bold">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}
      <div
        className={`w-full bg-[var(--rpg-surface)] rounded-full overflow-hidden border border-[var(--rpg-border)] relative p-0.5 ${heightClasses[height]}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full relative overflow-hidden"
          style={{
            backgroundColor: activeColor,
            boxShadow: `0 0 12px ${activeColor}80`,
          }}
        >
          {/* Animated gradient shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  );
};
