import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { RpgEngine } from '../services/rpgEngine.js';

export class CharacterController {
  static async getCharacter(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const charRes = await db.query(
        'SELECT * FROM characters WHERE user_id = $1',
        [userId]
      );

      if (charRes.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Character not found.' });
        return;
      }

      const character = charRes.rows[0];
      const reqXP = RpgEngine.getRequiredXP(character.level);
      const progressPercentage = Math.min(100, Math.round((character.current_xp / reqXP) * 100));

      res.json({
        success: true,
        character: {
          ...character,
          requiredXP: reqXP,
          progressPercentage,
        },
      });
    } catch (err: any) {
      console.error('[GET CHARACTER ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve character.' });
    }
  }

  static async updateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { name, title, avatar_url } = req.body;

      const charRes = await db.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
      if (charRes.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Character not found.' });
        return;
      }

      const current = charRes.rows[0];
      const newName = name ? String(name).trim().slice(0, 50) : current.name;
      const newTitle = title ? String(title).trim().slice(0, 50) : current.title;
      const newAvatar = avatar_url || current.avatar_url;

      const updateRes = await db.query(
        `UPDATE characters
         SET name = $1, title = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4
         RETURNING *`,
        [newName, newTitle, newAvatar, userId]
      );

      const updated = updateRes.rows[0];
      const reqXP = RpgEngine.getRequiredXP(updated.level);

      res.json({
        success: true,
        character: {
          ...updated,
          requiredXP: reqXP,
          progressPercentage: Math.min(100, Math.round((updated.current_xp / reqXP) * 100)),
        },
      });
    } catch (err: any) {
      console.error('[UPDATE CHARACTER ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to update character.' });
    }
  }

  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const txRes = await db.query(
        `SELECT * FROM xp_transactions
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 50`,
        [userId]
      );

      res.json({
        success: true,
        transactions: txRes.rows,
      });
    } catch (err: any) {
      console.error('[GET TRANSACTIONS ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve transactions.' });
    }
  }
}
