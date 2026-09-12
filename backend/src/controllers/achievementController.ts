import { Request, Response } from 'express';
import { db } from '../db/index.js';

export class AchievementController {
  static async getAchievements(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      // Query all achievements and left join user_achievements
      const queryRes = await db.query(
        `SELECT a.*,
                CASE WHEN ua.id IS NOT NULL THEN TRUE ELSE FALSE END as is_unlocked,
                ua.unlocked_at
         FROM achievements a
         LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
         ORDER BY a.id ASC`,
        [userId]
      );

      res.json({
        success: true,
        achievements: queryRes.rows,
      });
    } catch (err: any) {
      console.error('[GET ACHIEVEMENTS ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve achievements.' });
    }
  }
}
