import { Request, Response } from 'express';
import { db } from '../db/index.js';

export class SkillController {
  static async getSkills(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const skillsRes = await db.query(
        `SELECT s.*,
                CASE WHEN us.id IS NOT NULL THEN TRUE ELSE FALSE END as is_unlocked,
                us.unlocked_at
         FROM skills s
         LEFT JOIN user_skills us ON s.id = us.skill_id AND us.user_id = $1
         ORDER BY s.tier ASC, s.id ASC`,
        [userId]
      );

      res.json({
        success: true,
        skills: skillsRes.rows,
      });
    } catch (err: any) {
      console.error('[GET SKILLS ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve skills.' });
    }
  }

  static async unlockSkill(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const skillId = parseInt(String(req.params.id), 10);

      if (isNaN(skillId)) {
        res.status(400).json({ success: false, error: 'Invalid skill ID format.' });
        return;
      }

      // Check skill
      const skillRes = await db.query('SELECT * FROM skills WHERE id = $1', [skillId]);
      if (skillRes.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Skill not found.' });
        return;
      }
      const skill = skillRes.rows[0];

      // Check already unlocked
      const existing = await db.query(
        'SELECT id FROM user_skills WHERE user_id = $1 AND skill_id = $2',
        [userId, skillId]
      );
      if (existing.rows.length > 0) {
        res.status(400).json({ success: false, error: 'Skill is already unlocked.' });
        return;
      }

      // Check prerequisite
      if (skill.required_skill_code) {
        const prereq = await db.query(
          `SELECT us.id FROM user_skills us
           JOIN skills s ON us.skill_id = s.id
           WHERE us.user_id = $1 AND s.code = $2`,
          [userId, skill.required_skill_code]
        );
        if (prereq.rows.length === 0) {
          res.status(400).json({
            success: false,
            error: `Prerequisite skill "${skill.required_skill_code}" must be unlocked first.`,
          });
          return;
        }
      }

      // Atomic unlock and stat bonus application
      await db.withTransaction(async (client) => {
        await client.query(
          'INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2)',
          [userId, skillId]
        );

        if (skill.stat_bonus_type && skill.stat_bonus_value > 0) {
          const col = skill.stat_bonus_type.toLowerCase();
          if (['intellect', 'strength', 'creativity', 'discipline'].includes(col)) {
            await client.query(
              `UPDATE characters
               SET ${col} = ${col} + $1, updated_at = CURRENT_TIMESTAMP
               WHERE user_id = $2`,
              [skill.stat_bonus_value, userId]
            );
          }
        }
      });

      res.status(201).json({
        success: true,
        message: `Unlocked "${skill.name}"!`,
        skill: { ...skill, is_unlocked: true },
      });
    } catch (err: any) {
      console.error('[UNLOCK SKILL ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to unlock skill.' });
    }
  }
}
