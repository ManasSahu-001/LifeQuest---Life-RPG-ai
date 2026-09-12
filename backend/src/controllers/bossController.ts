import { Request, Response } from 'express';
import { db } from '../db/index.js';

export class BossController {
  static async getActiveBoss(req: Request, res: Response): Promise<void> {
    try {
      const bossRes = await db.query(
        'SELECT * FROM bosses WHERE is_active = TRUE ORDER BY id ASC LIMIT 1'
      );

      if (bossRes.rows.length === 0) {
        // Return completed/defeated boss fallback
        const lastBoss = await db.query('SELECT * FROM bosses ORDER BY id DESC LIMIT 1');
        res.json({
          success: true,
          boss: lastBoss.rows[0] || null,
          isDefeated: true,
        });
        return;
      }

      const boss = bossRes.rows[0];

      // Top damage contributors
      const attacksRes = await db.query(
        `SELECT u.id as user_id, c.name as hero_name, SUM(ba.damage) as total_damage
         FROM boss_attacks ba
         JOIN users u ON ba.user_id = u.id
         JOIN characters c ON c.user_id = u.id
         WHERE ba.boss_id = $1
         GROUP BY u.id, c.name
         ORDER BY total_damage DESC
         LIMIT 10`,
        [boss.id]
      );

      res.json({
        success: true,
        boss,
        contributors: attacksRes.rows,
      });
    } catch (err: any) {
      console.error('[GET ACTIVE BOSS ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve active boss.' });
    }
  }

  static async attackBoss(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { damage } = req.body;

      const bossRes = await db.query(
        'SELECT * FROM bosses WHERE is_active = TRUE ORDER BY id ASC LIMIT 1'
      );

      if (bossRes.rows.length === 0) {
        res.status(400).json({ success: false, error: 'No active boss to attack.' });
        return;
      }

      const boss = bossRes.rows[0];
      const strikeDamage = Math.max(1, Math.min(100, parseInt(damage || '15', 10)));
      const newHp = Math.max(0, boss.current_hp - strikeDamage);
      const isDefeated = newHp === 0;

      await db.withTransaction(async (client) => {
        await client.query(
          'UPDATE bosses SET current_hp = $1, is_active = $2 WHERE id = $3',
          [newHp, !isDefeated, boss.id]
        );

        await client.query(
          'INSERT INTO boss_attacks (user_id, boss_id, damage) VALUES ($1, $2, $3)',
          [userId, boss.id, strikeDamage]
        );

        if (isDefeated) {
          await client.query(
            'UPDATE characters SET gold = gold + $1, current_xp = current_xp + $2 WHERE user_id = $3',
            [boss.gold_bounty, boss.xp_bounty, userId]
          );
        }
      });

      res.json({
        success: true,
        damage: strikeDamage,
        bossRemainingHp: newHp,
        bossDefeated: isDefeated,
      });
    } catch (err: any) {
      console.error('[ATTACK BOSS ERROR]', err);
      res.status(500).json({ success: false, error: 'Boss attack failed.' });
    }
  }
}
