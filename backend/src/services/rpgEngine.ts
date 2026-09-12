import { config } from '../config/index.js';
import { DbClient } from '../db/index.js';

export const ATTRIBUTE_MAP: Record<string, string> = {
  coding: 'intellect',
  study: 'intellect',
  fitness: 'strength',
  creative: 'creativity',
  habit: 'discipline',
};

export interface LevelProgression {
  level: number;
  currentXP: number;
  requiredXP: number;
  progressPercentage: number;
  levelUp: boolean;
  levelsGained: number;
}

export interface CharacterState {
  id: number;
  userId: number;
  name: string;
  title: string;
  level: number;
  currentXP: number;
  gold: number;
  streakCount: number;
  lastCompletedDate: string | null;
  intellect: number;
  strength: number;
  creativity: number;
  discipline: number;
}

export interface QuestData {
  id: number;
  userId: number;
  title: string;
  category: string;
  difficulty: string;
  xpReward: number;
  goldReward: number;
  streakBonus?: number;
}

export interface CompletionResult {
  quest: any;
  rewards: {
    xp: number;
    gold: number;
    baseXP: number;
    baseGold: number;
    streakBonusXP: number;
    streakBonusGold: number;
  };
  character: any;
  levelUp: boolean;
  levelsGained: number;
  unlockedAchievements: any[];
  bossDamage?: {
    damage: number;
    bossName: string;
    bossRemainingHp: number;
    bossDefeated: boolean;
  } | null;
  campaignBossDamage?: {
    bossId: number;
    title: string;
    damageDealt: number;
    remainingHp: number;
    maxHp: number;
    isDefeated: boolean;
  } | null;
}

export class RpgEngine {
  /**
   * Deterministic nonlinear required XP formula:
   * requiredXP(level) = Math.floor(baseXP * growthFactor^(level - 1))
   */
  static getRequiredXP(level: number): number {
    if (level < 1) level = 1;
    return Math.floor(
      config.rpg.baseXP * Math.pow(config.rpg.growthFactor, level - 1)
    );
  }

  /**
   * Calculate level progression with correct overflow handling across multiple levels
   */
  static calculateLevelProgression(
    startingLevel: number,
    startingXP: number,
    earnedXP: number
  ): LevelProgression {
    let level = startingLevel;
    let currentXP = startingXP + earnedXP;
    let levelsGained = 0;

    let reqXP = this.getRequiredXP(level);
    while (currentXP >= reqXP) {
      currentXP -= reqXP;
      level += 1;
      levelsGained += 1;
      reqXP = this.getRequiredXP(level);
    }

    const progressPercentage = Math.min(
      100,
      Math.max(0, Math.round((currentXP / reqXP) * 100))
    );

    return {
      level,
      currentXP,
      requiredXP: reqXP,
      progressPercentage,
      levelUp: levelsGained > 0,
      levelsGained,
    };
  }

  /**
   * Calculate streak progression based on last completion date (UTC)
   */
  static calculateStreak(
    currentStreak: number,
    lastCompletedDate: string | Date | null,
    now: Date = new Date()
  ): { newStreak: number; isConsecutive: boolean; isSameDay: boolean } {
    if (!lastCompletedDate) {
      return { newStreak: 1, isConsecutive: false, isSameDay: false };
    }

    const lastDate = new Date(lastCompletedDate);
    
    // Normalize to UTC date strings YYYY-MM-DD
    const lastDayStr = lastDate.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    if (lastDayStr === todayStr) {
      // Completed another quest on the same day: maintain streak
      return { newStreak: currentStreak, isConsecutive: true, isSameDay: true };
    }

    // Yesterday string
    const yesterday = new Date(now);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDayStr === yesterdayStr) {
      // Consecutive day: increment streak
      return { newStreak: currentStreak + 1, isConsecutive: true, isSameDay: false };
    }

    // Streak broken: reset to 1
    return { newStreak: 1, isConsecutive: false, isSameDay: false };
  }

  /**
   * Calculate total rewards including streak multiplier
   */
  static calculateRewards(
    baseXP: number,
    baseGold: number,
    streak: number
  ): {
    totalXP: number;
    totalGold: number;
    streakBonusXP: number;
    streakBonusGold: number;
  } {
    const streakBonusFactor = Math.min(
      streak * config.rpg.defaultStreakMultiplier,
      config.rpg.maxStreakMultiplier
    );
    const goldBonusFactor = Math.min(
      streak * config.rpg.goldStreakMultiplier,
      config.rpg.maxStreakMultiplier
    );

    const streakBonusXP = Math.floor(baseXP * streakBonusFactor);
    const streakBonusGold = Math.floor(baseGold * goldBonusFactor);

    return {
      totalXP: baseXP + streakBonusXP,
      totalGold: baseGold + streakBonusGold,
      streakBonusXP,
      streakBonusGold,
    };
  }

  /**
   * Determine attribute delta for quest category
   */
  static getAttributeGain(
    category: string,
    difficulty: string
  ): { attribute: string; gain: number } {
    const attribute = ATTRIBUTE_MAP[category.toLowerCase()] || 'intellect';
    let gain = 1;
    if (difficulty === 'hard') gain = 2;
    if (difficulty === 'epic') gain = 3;
    return { attribute, gain };
  }

  /**
   * Execute atomic quest completion within a database transaction
   */
  static async completeQuest(
    dbClient: DbClient,
    userId: number,
    questId: number
  ): Promise<CompletionResult> {
    // 1. Fetch quest with ownership verification
    const questRes = await dbClient.query(
      'SELECT * FROM quests WHERE id = $1 AND user_id = $2',
      [questId, userId]
    );

    if (questRes.rows.length === 0) {
      throw new Error('Quest not found or unauthorized');
    }

    const quest = questRes.rows[0];

    // 2. Check duplicate completion
    if (quest.is_completed) {
      throw new Error('Quest is already completed');
    }

    // 3. Fetch character
    const charRes = await dbClient.query(
      'SELECT * FROM characters WHERE user_id = $1',
      [userId]
    );

    if (charRes.rows.length === 0) {
      throw new Error('Character not found for user');
    }

    const char = charRes.rows[0];

    // 4. Calculate streak
    const now = new Date();
    const streakInfo = this.calculateStreak(
      char.streak_count,
      char.last_completed_date,
      now
    );
    const newStreak = streakInfo.newStreak;

    // 5. Calculate XP & Gold rewards
    const rewards = this.calculateRewards(
      quest.xp_reward,
      quest.gold_reward,
      newStreak
    );

    // 6. Level progression calculation
    const progression = this.calculateLevelProgression(
      char.level,
      char.current_xp,
      rewards.totalXP
    );

    // 7. Calculate attribute & district XP gain
    const attrInfo = this.getAttributeGain(quest.category, quest.difficulty);
    const newIntellect = char.intellect + (attrInfo.attribute === 'intellect' ? attrInfo.gain : 0);
    const newStrength = char.strength + (attrInfo.attribute === 'strength' ? attrInfo.gain : 0);
    const newCreativity = char.creativity + (attrInfo.attribute === 'creativity' ? attrInfo.gain : 0);
    const newDiscipline = char.discipline + (attrInfo.attribute === 'discipline' ? attrInfo.gain : 0);

    const cat = (quest.category || '').toLowerCase();
    const techGain = cat === 'coding' ? rewards.totalXP : 0;
    const knowGain = cat === 'study' ? rewards.totalXP : 0;
    const strGain = cat === 'fitness' ? rewards.totalXP : 0;
    const wellGain = cat === 'wellness' ? rewards.totalXP : 0;
    const econGain = cat === 'finance' ? rewards.totalXP : 0;
    const cultGain = cat === 'creative' ? rewards.totalXP : 0;
    const commGain = (cat !== 'coding' && cat !== 'study' && cat !== 'fitness' && cat !== 'wellness' && cat !== 'finance' && cat !== 'creative') ? rewards.totalXP : 0;

    const newGold = char.gold + rewards.totalGold;
    const todayIsoDate = now.toISOString().split('T')[0];

    // 8. Update Character
    const updatedCharRes = await dbClient.query(
      `UPDATE characters
       SET level = $1,
           current_xp = $2,
           gold = $3,
           streak_count = $4,
           last_completed_date = $5,
           intellect = $6,
           strength = $7,
           creativity = $8,
           discipline = $9,
           tech_xp = COALESCE(tech_xp, 0) + $10,
           knowledge_xp = COALESCE(knowledge_xp, 0) + $11,
           strength_xp = COALESCE(strength_xp, 0) + $12,
           wellness_xp = COALESCE(wellness_xp, 0) + $13,
           economy_xp = COALESCE(economy_xp, 0) + $14,
           culture_xp = COALESCE(culture_xp, 0) + $15,
           community_xp = COALESCE(community_xp, 0) + $16,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $17
       RETURNING *`,
      [
        progression.level,
        progression.currentXP,
        newGold,
        newStreak,
        todayIsoDate,
        newIntellect,
        newStrength,
        newCreativity,
        newDiscipline,
        techGain,
        knowGain,
        strGain,
        wellGain,
        econGain,
        cultGain,
        commGain,
        char.id,
      ]
    );
    const updatedCharacter = updatedCharRes.rows[0];

    // 9. Mark quest completed
    const updatedQuestRes = await dbClient.query(
      `UPDATE quests
       SET is_completed = TRUE,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [questId]
    );

    // 10. Record Quest Completion
    await dbClient.query(
      `INSERT INTO quest_completions (quest_id, user_id, xp_awarded, gold_awarded, streak_at_completion)
       VALUES ($1, $2, $3, $4, $5)`,
      [questId, userId, rewards.totalXP, rewards.totalGold, newStreak]
    );

    // 11. Record XP Transaction
    await dbClient.query(
      `INSERT INTO xp_transactions (user_id, character_id, amount, currency_type, source_type, source_id, balance_after)
       VALUES ($1, $2, $3, 'XP', 'quest_completion', $4, $5)`,
      [userId, char.id, rewards.totalXP, questId, progression.currentXP]
    );

    // Record Gold Transaction
    await dbClient.query(
      `INSERT INTO xp_transactions (user_id, character_id, amount, currency_type, source_type, source_id, balance_after)
       VALUES ($1, $2, $3, 'GOLD', 'quest_completion', $4, $5)`,
      [userId, char.id, rewards.totalGold, questId, newGold]
    );

    // 12. Check Achievements
    const unlockedAchievements = await this.checkAchievements(
      dbClient,
      userId,
      char.id,
      updatedCharacter,
      quest
    );

    // 13. World Boss interaction (if active)
    let bossDamageResult: any = null;
    const bossRes = await dbClient.query(
      'SELECT * FROM bosses WHERE is_active = TRUE ORDER BY id ASC LIMIT 1'
    );
    if (bossRes.rows.length > 0) {
      const boss = bossRes.rows[0];
      const isWeakness = boss.weakness_category === quest.category;
      const baseDamage = Math.max(10, Math.floor(rewards.totalXP / 2));
      const finalDamage = isWeakness ? Math.floor(baseDamage * 1.5) : baseDamage;
      const remainingHp = Math.max(0, boss.current_hp - finalDamage);
      const isDefeated = remainingHp === 0;

      await dbClient.query(
        'UPDATE bosses SET current_hp = $1, is_active = $2 WHERE id = $3',
        [remainingHp, !isDefeated, boss.id]
      );

      await dbClient.query(
        'INSERT INTO boss_attacks (user_id, boss_id, damage, source_quest_id) VALUES ($1, $2, $3, $4)',
        [userId, boss.id, finalDamage, questId]
      );

      if (isDefeated) {
        // Award boss bounty
        await dbClient.query(
          'UPDATE characters SET gold = gold + $1, current_xp = current_xp + $2 WHERE id = $3',
          [boss.gold_bounty, boss.xp_bounty, char.id]
        );
      }

      bossDamageResult = {
        damage: finalDamage,
        bossName: boss.name,
        bossRemainingHp: remainingHp,
        bossDefeated: isDefeated,
      };
    }

    // 14. Campaign Nemesis Boss interaction (if quest belongs to a campaign)
    let campaignBossResult: any = null;
    if (quest.campaign_id) {
      const campBossRes = await dbClient.query(
        'SELECT * FROM campaign_bosses WHERE campaign_id = $1 AND is_defeated = FALSE LIMIT 1',
        [quest.campaign_id]
      );

      if (campBossRes.rows.length > 0) {
        const cBoss = campBossRes.rows[0];
        const campDmg = quest.boss_damage || 75;
        const newCampHp = Math.max(0, cBoss.current_hp - campDmg);
        const campDefeated = newCampHp === 0;

        await dbClient.query(
          'UPDATE campaign_bosses SET current_hp = $1, is_defeated = $2 WHERE id = $3',
          [newCampHp, campDefeated, cBoss.id]
        );

        await dbClient.query(
          'UPDATE campaigns SET completed_quests = completed_quests + 1 WHERE id = $1',
          [quest.campaign_id]
        );

        if (campDefeated) {
          await dbClient.query(
            "UPDATE campaigns SET status = 'completed' WHERE id = $1",
            [quest.campaign_id]
          );
          await dbClient.query(
            'UPDATE characters SET gold = gold + $1, current_xp = current_xp + $2 WHERE id = $3',
            [cBoss.reward_gold, cBoss.reward_xp, char.id]
          );
        }

        campaignBossResult = {
          bossId: cBoss.id,
          title: cBoss.title,
          damageDealt: campDmg,
          remainingHp: newCampHp,
          maxHp: cBoss.max_hp,
          isDefeated: campDefeated,
        };
      }
    }

    // Attach required dynamic progress data to character response
    const finalCharacterState = {
      ...updatedCharacter,
      requiredXP: progression.requiredXP,
      progressPercentage: progression.progressPercentage,
    };

    return {
      quest: updatedQuestRes.rows[0],
      rewards: {
        xp: rewards.totalXP,
        gold: rewards.totalGold,
        baseXP: rewards.totalXP - rewards.streakBonusXP,
        baseGold: rewards.totalGold - rewards.streakBonusGold,
        streakBonusXP: rewards.streakBonusXP,
        streakBonusGold: rewards.streakBonusGold,
      },
      character: finalCharacterState,
      levelUp: progression.levelUp,
      levelsGained: progression.levelsGained,
      unlockedAchievements,
      bossDamage: bossDamageResult,
      campaignBossDamage: campaignBossResult,
    };
  }

  /**
   * Evaluate unlock conditions for achievements
   */
  private static async checkAchievements(
    dbClient: DbClient,
    userId: number,
    characterId: number,
    character: any,
    recentQuest: any
  ): Promise<any[]> {
    const unlocked: any[] = [];

    // Fetch achievements not yet unlocked by user
    const pendingAchievements = await dbClient.query(
      `SELECT a.* FROM achievements a
       WHERE a.id NOT IN (
         SELECT ua.achievement_id FROM user_achievements ua WHERE ua.user_id = $1
       )`,
      [userId]
    );

    if (pendingAchievements.rows.length === 0) {
      return unlocked;
    }

    // Query stats
    const totalCompletedRes = await dbClient.query(
      'SELECT COUNT(*) as count FROM quest_completions WHERE user_id = $1',
      [userId]
    );
    const totalCompleted = parseInt(totalCompletedRes.rows[0].count, 10);

    const categoryCountsRes = await dbClient.query(
      `SELECT q.category, COUNT(*) as count
       FROM quest_completions qc
       JOIN quests q ON qc.quest_id = q.id
       WHERE qc.user_id = $1
       GROUP BY q.category`,
      [userId]
    );
    const categoryCounts: Record<string, number> = {};
    for (const row of categoryCountsRes.rows) {
      categoryCounts[row.category] = parseInt(row.count, 10);
    }

    for (const ach of pendingAchievements.rows) {
      let meetsCriteria = false;

      switch (ach.criteria_type) {
        case 'quests_completed':
          meetsCriteria = totalCompleted >= ach.criteria_threshold;
          break;
        case 'streak_count':
          meetsCriteria = character.streak_count >= ach.criteria_threshold;
          break;
        case 'level_reached':
          meetsCriteria = character.level >= ach.criteria_threshold;
          break;
        case 'category_count':
          const catCount = categoryCounts[ach.category] || 0;
          meetsCriteria = catCount >= ach.criteria_threshold;
          break;
      }

      if (meetsCriteria) {
        // Unlock achievement
        await dbClient.query(
          `INSERT INTO user_achievements (user_id, achievement_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [userId, ach.id]
        );

        // Award achievement rewards
        if (ach.xp_reward > 0 || ach.gold_reward > 0) {
          await dbClient.query(
            `UPDATE characters
             SET current_xp = current_xp + $1,
                 gold = gold + $2
             WHERE id = $3`,
            [ach.xp_reward, ach.gold_reward, characterId]
          );

          await dbClient.query(
            `INSERT INTO xp_transactions (user_id, character_id, amount, currency_type, source_type, source_id, balance_after)
             VALUES ($1, $2, $3, 'XP', 'achievement_unlock', $4, 0)`,
            [userId, characterId, ach.xp_reward, ach.id]
          );
        }

        unlocked.push(ach);
      }
    }

    return unlocked;
  }
}
