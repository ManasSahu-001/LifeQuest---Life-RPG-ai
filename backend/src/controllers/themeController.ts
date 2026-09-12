import { Request, Response } from 'express';
import { db } from '../db/index.js';

export const THEME_REQUIRED_LEVELS: Record<string, { level: number; name: string }> = {
  'theme-a': { level: 1, name: 'Cyberpunk Synthwave' },
  'theme-b': { level: 2, name: 'High Fantasy Realm' },
  'theme-c': { level: 3, name: 'Solarpunk Metropolis' },
  'theme-d': { level: 4, name: 'Enchanted Forest' },
  'theme-e': { level: 5, name: 'Last Samurai Standing' },
  'theme-f': { level: 6, name: 'Build Your City' },
  'theme-g': { level: 7, name: 'Deep Space Odyssey' },
  'theme-h': { level: 8, name: 'Eldritch Void' },
};

export const THEME_ALIASES: Record<string, string> = {
  cyberpunk: 'theme-a',
  fantasy: 'theme-b',
  solarpunk: 'theme-c',
  forest: 'theme-d',
  samurai: 'theme-e',
  city: 'theme-f',
};

export class ThemeController {
  static async updateTheme(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { theme } = req.body;

      if (!theme || typeof theme !== 'string') {
        res.status(400).json({ success: false, error: 'Theme identifier is required.' });
        return;
      }

      let cleanTheme = theme.toLowerCase().trim();
      if (THEME_ALIASES[cleanTheme]) {
        cleanTheme = THEME_ALIASES[cleanTheme];
      }

      const themeConfig = THEME_REQUIRED_LEVELS[cleanTheme];
      if (!themeConfig) {
        res.status(400).json({
          success: false,
          error: `Invalid theme. Must be one of: ${Object.keys(THEME_REQUIRED_LEVELS).join(', ')}`,
        });
        return;
      }

      // Server-authoritative Level Lock verification
      const charRes = await db.query('SELECT level FROM characters WHERE user_id = $1', [userId]);
      const currentLevel = charRes.rows[0]?.level || 1;

      if (currentLevel < themeConfig.level) {
        res.status(403).json({
          success: false,
          error: `Theme locked! "${themeConfig.name}" requires Character Level ${themeConfig.level}. Your current level is ${currentLevel}. Complete more quests to unlock this realm!`,
          requiredLevel: themeConfig.level,
          currentLevel,
        });
        return;
      }

      const updateRes = await db.query(
        `UPDATE users
         SET theme = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, email, theme`,
        [cleanTheme, userId]
      );

      res.json({
        success: true,
        message: `Realm successfully switched to ${themeConfig.name}!`,
        theme: updateRes.rows[0].theme,
      });
    } catch (err: any) {
      console.error('[UPDATE THEME ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to update theme preference.' });
    }
  }
}

