import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'life-rpg-super-secret-jwt-key-2026-prod-grade',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL,
  pgliteDir: process.env.PGLITE_DIR || path.resolve(process.cwd(), 'data', 'rpg-pglite'),
  rpg: {
    baseXP: 100,
    growthFactor: 1.25,
    defaultStreakMultiplier: 0.1, // +10% XP per streak day (up to max)
    maxStreakMultiplier: 1.0, // max 100% bonus (2x)
    goldStreakMultiplier: 0.05 // +5% Gold per streak day
  }
};
