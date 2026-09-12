import { Request, Response } from 'express';
import { db } from '../db/index.js';

export class ThemeController {
  static async updateTheme(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { theme } = req.body;

      if (!theme || typeof theme !== 'string') {
        res.status(400).json({ success: false, error: 'Theme identifier is required.' });
        return;
      }

      // Valid themes supported by the Life RPG ecosystem
      const allowedThemes = [
        'theme-a',
        'theme-b',
        'theme-c',
        'theme-d',
        'theme-e',
        'theme-f',
        'theme-g',
        'theme-h',
      ];

      const cleanTheme = theme.toLowerCase().trim();
      if (!allowedThemes.includes(cleanTheme)) {
        res.status(400).json({
          success: false,
          error: `Invalid theme. Must be one of: ${allowedThemes.join(', ')}`,
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
        message: 'Theme updated successfully.',
        theme: updateRes.rows[0].theme,
      });
    } catch (err: any) {
      console.error('[UPDATE THEME ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to update theme preference.' });
    }
  }
}
