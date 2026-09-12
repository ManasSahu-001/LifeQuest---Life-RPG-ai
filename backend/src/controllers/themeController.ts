import { Request, Response } from 'express';
import { db } from '../db/index.js';

export const THEME_REQUIRED_LEVELS: Record<string, { level: number; name: string }> = {
  'theme-a': { level: 1, name: 'Cyberpunk Synthwave' },
  'theme-b': { level: 2, name: 'High Fantasy Realm' },
  'theme-c': { level: 3, name: 'Solarpunk Metropolis' },
  'theme-d': { level: 4, name: 'Enchanted Forest' },
  'theme-e': { level: 5, name: 'Last Samurai Standing' },
  'theme-f': { level: 6, name: 'Build Your City' },
  'theme-g': { level: 7, name: 'Haunted World: Cursed Necropolis' },
  'theme-h': { level: 8, name: 'The Upside Down: Hawkins 1984' },
};

export const THEME_ALIASES: Record<string, string> = {
  cyberpunk: 'theme-a',
  fantasy: 'theme-b',
  solarpunk: 'theme-c',
  forest: 'theme-d',
  samurai: 'theme-e',
  city: 'theme-f',
  haunted: 'theme-g',
  necropolis: 'theme-g',
  upside: 'theme-h',
  stranger: 'theme-h',
};

export const THEME_TO_SHOP_KEY: Record<string, string> = {
  'theme-a': 'theme_cyberpunk',
  'theme-b': 'theme_high_fantasy',
  'theme-c': 'theme_solarpunk',
  'theme-d': 'theme_enchanted_forest',
  'theme-e': 'theme_last_samurai',
  'theme-f': 'theme_build_city',
  'theme-g': 'theme_haunted_world',
  'theme-h': 'theme_upside_down',
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

      // Server-authoritative Unlock Verification:
      // A theme is unlocked if:
      // 1. It is the starter theme ('theme-a')
      // 2. The character level meets or exceeds the required level
      // 3. The user owns the realm license in inventory_items
      const charRes = await db.query('SELECT level FROM characters WHERE user_id = $1', [userId]);
      const currentLevel = charRes.rows[0]?.level || 1;
      const shopKey = THEME_TO_SHOP_KEY[cleanTheme];

      const invRes = await db.query(
        `SELECT id FROM inventory_items 
         WHERE user_id = $1 AND (item_key = $2 OR item_key = $3)`,
        [userId, shopKey, cleanTheme]
      );
      const isPurchased = invRes.rows.length > 0;
      const isStarterTheme = cleanTheme === 'theme-a';
      const hasLevelRequirement = currentLevel >= themeConfig.level;

      if (!isStarterTheme && !hasLevelRequirement && !isPurchased) {
        res.status(403).json({
          success: false,
          error: `Theme locked! "${themeConfig.name}" requires Character Level ${themeConfig.level} or acquire it from the Treasury Shop. Your current level is ${currentLevel}.`,
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

      // Keep inventory_items in sync: equip the chosen theme and unequip others
      await db.query(
        `UPDATE inventory_items 
         SET is_equipped = (item_key = $1 OR item_key = $2) 
         WHERE user_id = $3 AND item_type = 'theme'`,
        [shopKey, cleanTheme, userId]
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

