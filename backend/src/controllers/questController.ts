import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { RpgEngine } from '../services/rpgEngine.js';

export class QuestController {
  static async createQuest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { title, description, category, difficulty, priority, recurrence, due_date } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({ success: false, error: 'Quest title is required.' });
        return;
      }

      const validCategories = ['coding', 'study', 'fitness', 'creative', 'habit'];
      const questCategory = validCategories.includes(category) ? category : 'coding';

      const validDifficulties = ['easy', 'medium', 'hard', 'epic'];
      const questDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'medium';

      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      const questPriority = validPriorities.includes(priority) ? priority : 'medium';

      // Base reward calculations
      const rewardScale: Record<string, { xp: number; gold: number }> = {
        easy: { xp: 50, gold: 25 },
        medium: { xp: 100, gold: 50 },
        hard: { xp: 200, gold: 100 },
        epic: { xp: 400, gold: 200 },
      };

      const baseReward = rewardScale[questDifficulty] || { xp: 100, gold: 50 };

      const insertRes = await db.query(
        `INSERT INTO quests (user_id, title, description, category, difficulty, priority, xp_reward, gold_reward, recurrence, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          userId,
          title.trim(),
          (description || '').trim(),
          questCategory,
          questDifficulty,
          questPriority,
          baseReward.xp,
          baseReward.gold,
          recurrence || 'none',
          due_date ? new Date(due_date) : null,
        ]
      );

      res.status(201).json({
        success: true,
        quest: insertRes.rows[0],
      });
    } catch (err: any) {
      console.error('[CREATE QUEST ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to create quest.' });
    }
  }

  static async getQuests(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { category, status } = req.query;

      let sql = 'SELECT * FROM quests WHERE user_id = $1';
      const params: any[] = [userId];

      if (category && typeof category === 'string') {
        params.push(category);
        sql += ` AND category = $${params.length}`;
      }

      if (status === 'completed') {
        sql += ' AND is_completed = TRUE';
      } else if (status === 'active') {
        sql += ' AND is_completed = FALSE';
      }

      sql += ' ORDER BY is_completed ASC, created_at DESC';

      const result = await db.query(sql, params);
      res.json({
        success: true,
        count: result.rows.length,
        quests: result.rows,
      });
    } catch (err: any) {
      console.error('[GET QUESTS ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve quests.' });
    }
  }

  static async getQuestById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const questId = parseInt(String(req.params.id), 10);

      if (isNaN(questId)) {
        res.status(400).json({ success: false, error: 'Invalid quest ID format.' });
        return;
      }

      const result = await db.query(
        'SELECT * FROM quests WHERE id = $1 AND user_id = $2',
        [questId, userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Quest not found.' });
        return;
      }

      res.json({
        success: true,
        quest: result.rows[0],
      });
    } catch (err: any) {
      console.error('[GET QUEST BY ID ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve quest.' });
    }
  }

  static async updateQuest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const questId = parseInt(String(req.params.id), 10);

      if (isNaN(questId)) {
        res.status(400).json({ success: false, error: 'Invalid quest ID format.' });
        return;
      }

      // Check ownership
      const existing = await db.query(
        'SELECT * FROM quests WHERE id = $1 AND user_id = $2',
        [questId, userId]
      );

      if (existing.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Quest not found or unauthorized.' });
        return;
      }

      const quest = existing.rows[0];
      if (quest.is_completed) {
        res.status(400).json({ success: false, error: 'Completed quests cannot be modified.' });
        return;
      }

      const { title, description, category, difficulty, priority, due_date } = req.body;

      const newTitle = title !== undefined ? String(title).trim() : quest.title;
      const newDesc = description !== undefined ? String(description).trim() : quest.description;
      const newCat = category || quest.category;
      const newDiff = difficulty || quest.difficulty;
      const newPrio = priority || quest.priority;
      const newDueDate = due_date !== undefined ? (due_date ? new Date(due_date) : null) : quest.due_date;

      // Recalculate base reward if difficulty changed
      const rewardScale: Record<string, { xp: number; gold: number }> = {
        easy: { xp: 50, gold: 25 },
        medium: { xp: 100, gold: 50 },
        hard: { xp: 200, gold: 100 },
        epic: { xp: 400, gold: 200 },
      };
      const baseReward = rewardScale[newDiff] || { xp: quest.xp_reward, gold: quest.gold_reward };

      const updateRes = await db.query(
        `UPDATE quests
         SET title = $1,
             description = $2,
             category = $3,
             difficulty = $4,
             priority = $5,
             xp_reward = $6,
             gold_reward = $7,
             due_date = $8,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9 AND user_id = $10
         RETURNING *`,
        [newTitle, newDesc, newCat, newDiff, newPrio, baseReward.xp, baseReward.gold, newDueDate, questId, userId]
      );

      res.json({
        success: true,
        quest: updateRes.rows[0],
      });
    } catch (err: any) {
      console.error('[UPDATE QUEST ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to update quest.' });
    }
  }

  static async deleteQuest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const questId = parseInt(String(req.params.id), 10);

      if (isNaN(questId)) {
        res.status(400).json({ success: false, error: 'Invalid quest ID format.' });
        return;
      }

      const delRes = await db.query(
        'DELETE FROM quests WHERE id = $1 AND user_id = $2 RETURNING id',
        [questId, userId]
      );

      if (delRes.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Quest not found or unauthorized.' });
        return;
      }

      res.json({
        success: true,
        message: 'Quest deleted successfully.',
        questId,
      });
    } catch (err: any) {
      console.error('[DELETE QUEST ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to delete quest.' });
    }
  }

  static async completeQuest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const questId = parseInt(String(req.params.id), 10);

      if (isNaN(questId)) {
        res.status(400).json({ success: false, error: 'Invalid quest ID format.' });
        return;
      }

      // Execute server-authoritative quest completion in atomic transaction
      const result = await db.withTransaction(async (txClient) => {
        return await RpgEngine.completeQuest(txClient, userId, questId);
      });

      // Stable contract specified in Section 10
      res.json({
        success: true,
        quest: result.quest,
        rewards: result.rewards,
        character: result.character,
        levelUp: result.levelUp,
        levelsGained: result.levelsGained,
        unlockedAchievements: result.unlockedAchievements,
        bossDamage: result.bossDamage,
      });
    } catch (err: any) {
      console.error('[COMPLETE QUEST ERROR]', err.message || err);
      if (err.message.includes('not found') || err.message.includes('unauthorized')) {
        res.status(404).json({ success: false, error: err.message });
      } else if (err.message.includes('already completed')) {
        res.status(409).json({ success: false, error: err.message });
      } else {
        res.status(500).json({ success: false, error: 'Quest completion failed.' });
      }
    }
  }
}
