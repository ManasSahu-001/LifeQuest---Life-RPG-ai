import { Request, Response } from 'express';
import { db } from '../db/index.js';

export class RewardController {
  static async getRewards(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      // Available shop items
      const storeRes = await db.query('SELECT * FROM rewards ORDER BY cost_gold ASC');

      // User's purchased items
      const userRewardsRes = await db.query(
        `SELECT ur.id as user_reward_id, ur.is_claimed, ur.purchased_at, r.*
         FROM user_rewards ur
         JOIN rewards r ON ur.reward_id = r.id
         WHERE ur.user_id = $1
         ORDER BY ur.purchased_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        shopRewards: storeRes.rows,
        inventory: userRewardsRes.rows,
      });
    } catch (err: any) {
      console.error('[GET REWARDS ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve rewards.' });
    }
  }

  static async purchaseReward(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const rewardId = parseInt(String(req.params.id), 10);

      if (isNaN(rewardId)) {
        res.status(400).json({ success: false, error: 'Invalid reward ID format.' });
        return;
      }

      // Execute purchase inside atomic database transaction
      const result = await db.withTransaction(async (client) => {
        // Fetch reward
        const rewardRes = await client.query('SELECT * FROM rewards WHERE id = $1', [rewardId]);
        if (rewardRes.rows.length === 0) {
          throw new Error('Reward not found');
        }
        const reward = rewardRes.rows[0];

        // Fetch character
        const charRes = await client.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
        if (charRes.rows.length === 0) {
          throw new Error('Character not found');
        }
        const character = charRes.rows[0];

        if (character.gold < reward.cost_gold) {
          throw new Error(`Insufficient gold. Required: ${reward.cost_gold}, Available: ${character.gold}`);
        }

        const remainingGold = character.gold - reward.cost_gold;

        // Deduct gold
        await client.query(
          'UPDATE characters SET gold = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [remainingGold, character.id]
        );

        // Add to inventory
        const userRewardRes = await client.query(
          `INSERT INTO user_rewards (user_id, reward_id, is_claimed)
           VALUES ($1, $2, FALSE)
           RETURNING *`,
          [userId, reward.id]
        );

        // Log transaction
        await client.query(
          `INSERT INTO xp_transactions (user_id, character_id, amount, currency_type, source_type, source_id, balance_after)
           VALUES ($1, $2, $3, 'GOLD', 'reward_purchase', $4, $5)`,
          [userId, character.id, -reward.cost_gold, reward.id, remainingGold]
        );

        return {
          purchasedItem: {
            ...userRewardRes.rows[0],
            title: reward.title,
            cost_gold: reward.cost_gold,
            icon: reward.icon,
          },
          remainingGold,
        };
      });

      res.status(201).json({
        success: true,
        message: 'Reward purchased successfully!',
        purchasedItem: result.purchasedItem,
        remainingGold: result.remainingGold,
      });
    } catch (err: any) {
      console.error('[PURCHASE REWARD ERROR]', err.message || err);
      if (err.message.includes('Insufficient gold')) {
        res.status(400).json({ success: false, error: err.message });
      } else if (err.message.includes('Reward not found')) {
        res.status(404).json({ success: false, error: err.message });
      } else {
        res.status(500).json({ success: false, error: 'Purchase failed due to server error.' });
      }
    }
  }

  static async claimReward(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRewardId = parseInt(String(req.params.claimId), 10);

      if (isNaN(userRewardId)) {
        res.status(400).json({ success: false, error: 'Invalid user reward ID format.' });
        return;
      }

      const updateRes = await db.query(
        `UPDATE user_rewards
         SET is_claimed = TRUE
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [userRewardId, userId]
      );

      if (updateRes.rows.length === 0) {
        res.status(404).json({ success: false, error: 'Inventory item not found or unauthorized.' });
        return;
      }

      res.json({
        success: true,
        message: 'Reward claimed successfully!',
        claimedReward: updateRes.rows[0],
      });
    } catch (err: any) {
      console.error('[CLAIM REWARD ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to claim reward.' });
    }
  }
}
