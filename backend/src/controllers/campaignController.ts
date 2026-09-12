import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { generateAIQuestCampaign } from '../services/aiService.js';

export async function listCampaigns(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    const campaigns = await db.query(
      `SELECT c.*, 
              cb.id as boss_id, cb.title as boss_title, cb.boss_type, cb.max_hp as boss_max_hp, 
              cb.current_hp as boss_current_hp, cb.is_defeated as boss_is_defeated
       FROM campaigns c
       LEFT JOIN campaign_bosses cb ON cb.campaign_id = c.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      campaigns: campaigns.rows,
    });
  } catch (error) {
    console.error('[Campaigns] Error listing campaigns:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve campaigns.' });
  }
}

export async function generateCampaign(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { goal } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
    res.status(400).json({ success: false, message: 'Real-life goal is required.' });
    return;
  }

  try {
    const forged = await generateAIQuestCampaign(goal);

    const result = await db.withTransaction(async (client) => {
      // 1. Insert Campaign
      const campRes = await client.query(
        `INSERT INTO campaigns (user_id, title, description, real_life_goal, status, total_quests, completed_quests)
         VALUES ($1, $2, $3, $4, 'active', $5, 0)
         RETURNING *`,
        [userId, forged.campaign.title, forged.campaign.description, forged.campaign.real_life_goal, forged.quests.length]
      );
      const campaign = campRes.rows[0];

      // 2. Insert Campaign Boss
      const bossRes = await client.query(
        `INSERT INTO campaign_bosses (campaign_id, user_id, title, boss_type, description, max_hp, current_hp)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          campaign.id,
          userId,
          forged.boss.title,
          forged.boss.boss_type,
          forged.boss.description,
          forged.boss.max_hp,
          forged.boss.max_hp,
        ]
      );
      const boss = bossRes.rows[0];

      // 3. Insert Quests
      const createdQuests = [];
      for (const q of forged.quests) {
        const questRes = await client.query(
          `INSERT INTO quests (
             user_id, campaign_id, title, description, category, difficulty, 
             attribute_type, attribute_gain, boss_damage, xp_reward, gold_reward
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING *`,
          [
            userId,
            campaign.id,
            q.title,
            q.description,
            q.category,
            q.difficulty,
            q.attribute_type,
            q.attribute_gain,
            q.boss_damage,
            q.xp_reward,
            q.gold_reward,
          ]
        );
        createdQuests.push(questRes.rows[0]);
      }

      return { campaign, boss, quests: createdQuests };
    });

    res.status(201).json({
      success: true,
      message: 'AI Quest Master successfully forged campaign!',
      ...result,
    });
  } catch (error) {
    console.error('[Campaigns] Error generating campaign:', error);
    res.status(500).json({ success: false, message: 'Failed to forge AI campaign.' });
  }
}

export async function getActiveCampaignBoss(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    const bossRes = await db.query(
      `SELECT cb.*, c.title as campaign_title, c.real_life_goal
       FROM campaign_bosses cb
       JOIN campaigns c ON c.id = cb.campaign_id
       WHERE cb.user_id = $1 AND cb.is_defeated = FALSE
       ORDER BY cb.created_at DESC
       LIMIT 1`,
      [userId]
    );

    res.json({
      success: true,
      boss: bossRes.rows[0] || null,
    });
  } catch (error) {
    console.error('[Campaigns] Error fetching active boss:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve active campaign boss.' });
  }
}
