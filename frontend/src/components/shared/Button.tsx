import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.js';
import { audioEngine } from '../../services/audioEngine.js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const { currentThemeId } = useTheme();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--rpg-primary)] text-black font-bold hover:brightness-110 shadow-[0_0_15px_var(--rpg-card-glow)] border border-[var(--rpg-primary)]/80';
      case 'secondary':
        return 'bg-[var(--rpg-secondary)] text-white font-medium hover:brightness-110 shadow-md border border-[var(--rpg-secondary)]/60';
      case 'gold':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold hover:brightness-110 shadow-md border border-amber-300';
      case 'danger':
        return 'bg-red-600/90 text-white hover:bg-red-500 border border-red-500/50 shadow-sm';
      case 'outline':
      default:
        return 'bg-transparent text-[var(--rpg-text)] border border-[var(--rpg-border)] hover:bg-[var(--rpg-surface-hover)] hover:text-[var(--rpg-primary)]';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audioEngine.playClick();
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-[var(--rpg-radius)] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rpg-primary)] ${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      {...props as any}
      onClick={handleClick}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};
