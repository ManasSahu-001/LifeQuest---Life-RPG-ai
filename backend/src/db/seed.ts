import { db } from './index.js';

export async function seedDatabase(): Promise<void> {
  await db.init();

  // 1. Seed Achievements
  const achievementsCount = await db.query('SELECT COUNT(*) as count FROM achievements');
  if (parseInt(achievementsCount.rows[0].count, 10) === 0) {
    console.log('[SEED] Seeding starter achievements...');
    const achievements = [
      ['FIRST_QUEST', 'First Steps', 'Complete your very first quest.', 'progression', 'award', 'quests_completed', 1, 50, 25],
      ['STREAK_3', 'Consistent Hero', 'Maintain a 3-day quest completion streak.', 'streak', 'flame', 'streak_count', 3, 150, 75],
      ['STREAK_7', 'Unstoppable Force', 'Maintain a 7-day quest completion streak.', 'streak', 'zap', 'streak_count', 7, 300, 150],
      ['LEVEL_5', 'Rising Legend', 'Reach Character Level 5.', 'level', 'shield', 'level_reached', 5, 250, 100],
      ['LEVEL_10', 'Grand Champion', 'Reach Character Level 10.', 'level', 'crown', 'level_reached', 10, 500, 250],
      ['CODING_5', 'Silicon Sage', 'Complete 5 coding quests.', 'category', 'code', 'category_count', 5, 150, 80],
      ['FITNESS_5', 'Iron Body', 'Complete 5 fitness quests.', 'category', 'activity', 'category_count', 5, 150, 80],
      ['STUDY_5', 'Tome Keeper', 'Complete 5 study quests.', 'category', 'book-open', 'category_count', 5, 150, 80],
      ['HABIT_5', 'Disciplined Soul', 'Complete 5 habit quests.', 'category', 'check-circle', 'category_count', 5, 150, 80],
    ];

    for (const a of achievements) {
      await db.query(
        `INSERT INTO achievements (code, title, description, category, badge_icon, criteria_type, criteria_threshold, xp_reward, gold_reward)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (code) DO NOTHING`,
        a
      );
    }
  }

  // 2. Seed Rewards
  const rewardsCount = await db.query('SELECT COUNT(*) as count FROM rewards');
  if (parseInt(rewardsCount.rows[0].count, 10) === 0) {
    console.log('[SEED] Seeding starter reward store items...');
    const rewards = [
      ['Elixir of Deep Focus', 'One artisanal latte or specialty beverage of choice.', 50, 'coffee', 'consumable'],
      ['Guilt-Free Gaming Pass', 'Two uninterrupted hours playing your favorite video game.', 120, 'gamepad-2', 'entertainment'],
      ['Feast of the Champions', 'Order your favorite gourmet cheat-meal dinner.', 200, 'utensils', 'lifestyle'],
      ['Tome of Wisdom', 'Purchase any book or educational course you desire.', 250, 'book-open', 'education'],
      ['Weekend Sanctuary Trip', 'A relaxing day excursion, hiking, or spa visit.', 500, 'compass', 'travel'],
    ];

    for (const r of rewards) {
      await db.query(
        `INSERT INTO rewards (title, description, cost_gold, icon, category)
         VALUES ($1, $2, $3, $4, $5)`,
        r
      );
    }
  }

  // 3. Seed World Bosses (for all 6 themes)
  const bossesList = [
    {
      theme: 'theme-a',
      name: 'The Procrastination Behemoth',
      title: 'Devourer of Deadlines (Cyber-Matrix)',
      description: 'A shadowy colossus formed from unwritten code, missed alarms, and pending tasks.',
      max_hp: 1000,
      current_hp: 1000,
      level: 5,
      weakness_category: 'coding',
      gold_bounty: 500,
      xp_bounty: 1000,
    },
    {
      theme: 'theme-b',
      name: 'Dread Dragon Fafnir',
      title: 'Scourge of the High Realm',
      description: 'An ancient wyrm nesting on unearned treasures. Defeat it with deep study and scholastic knowledge!',
      max_hp: 1400,
      current_hp: 1400,
      level: 6,
      weakness_category: 'study',
      gold_bounty: 650,
      xp_bounty: 1200,
    },
    {
      theme: 'theme-c',
      name: 'The Smog Colossus',
      title: 'Choker of the Solar Canopy',
      description: 'Toxic industrial haze threatening the biophilic metropolis. Slay it with rigorous daily discipline habits!',
      max_hp: 1100,
      current_hp: 1100,
      level: 5,
      weakness_category: 'habit',
      gold_bounty: 550,
      xp_bounty: 1050,
    },
    {
      theme: 'theme-d',
      name: 'Malakor, The Blight Treant',
      title: 'Corruptor of the Ancient Sapling',
      description: 'Thorns and blackened sap threaten to choke the life of the holy druidic grove. Defeat it through active fitness and vitality!',
      max_hp: 1200,
      current_hp: 1200,
      level: 6,
      weakness_category: 'fitness',
      gold_bounty: 600,
      xp_bounty: 1100,
    },
    {
      theme: 'theme-e',
      name: 'Kurokage, The Shadow Shogun',
      title: 'Lord of the Burning Torii',
      description: 'A fallen warlord seeking to extinguish the last ember of samurai discipline. Strike down his darkness with creative mastery!',
      max_hp: 1500,
      current_hp: 1500,
      level: 7,
      weakness_category: 'creative',
      gold_bounty: 750,
      xp_bounty: 1350,
    },
    {
      theme: 'theme-f',
      name: 'Titan OVERLOAD-9',
      title: 'Industrial Grid Glitch',
      description: 'A rogue AI mainframe causing rolling blackouts and infrastructure structural collapse. Neutralize it with high-performance code!',
      max_hp: 1800,
      current_hp: 1800,
      level: 8,
      weakness_category: 'coding',
      gold_bounty: 900,
      xp_bounty: 1500,
    },
    {
      theme: 'theme-g',
      name: 'Lord Malathrax, The Cursed Lich',
      title: 'Monarch of the Spectral Necropolis',
      description: 'An ancient dread sorcerer wielding soul-binding procrastination curses. Shatter his phylactery with unwavering study and discipline!',
      max_hp: 2100,
      current_hp: 2100,
      level: 9,
      weakness_category: 'study',
      gold_bounty: 1050,
      xp_bounty: 1800,
    },
    {
      theme: 'theme-h',
      name: 'The Mind Flayer',
      title: 'Shadow Sovereign of the Upside Down',
      description: 'A colossal psionic titan looming across dimensions over Hawkins 1984. Sever its hivemind connection through intense coding focus!',
      max_hp: 2500,
      current_hp: 2500,
      level: 10,
      weakness_category: 'coding',
      gold_bounty: 1250,
      xp_bounty: 2200,
    },
  ];

  for (const b of bossesList) {
    const existing = await db.query('SELECT id FROM bosses WHERE name = $1', [b.name]);
    if (existing.rows.length === 0) {
      await db.query(
        `INSERT INTO bosses (theme, name, title, description, max_hp, current_hp, level, weakness_category, gold_bounty, xp_bounty, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)`,
        [b.theme, b.name, b.title, b.description, b.max_hp, b.current_hp, b.level, b.weakness_category, b.gold_bounty, b.xp_bounty]
      );
    }
  }

  // 4. Seed Skills
  const skillsCount = await db.query('SELECT COUNT(*) as count FROM skills');
  if (parseInt(skillsCount.rows[0].count, 10) === 0) {
    console.log('[SEED] Seeding skill tree nodes...');
    const skills = [
      ['CODE_1', 'Clean Code Architecture', 'Improves software thinking and logic structuring.', 'intellect', 1, 1, null, 'intellect', 5, 'cpu'],
      ['DISCIPLINE_1', 'Dawn Discipline', 'Rise early and conquer daily habits effortlessly.', 'discipline', 1, 1, null, 'discipline', 5, 'sun'],
      ['STRENGTH_1', 'Kinetic Drive', 'Physical conditioning increases real-world energy reserve.', 'strength', 1, 1, null, 'strength', 5, 'dumbbell'],
      ['CREATIVE_1', 'Synaptic Spark', 'Unlock lateral problem solving and novel insights.', 'creativity', 1, 1, null, 'creativity', 5, 'sparkles'],
      ['CODE_2', 'System Architect', 'Master full-stack systems and high-throughput pipelines.', 'intellect', 2, 2, 'CODE_1', 'intellect', 10, 'layers'],
      ['DISCIPLINE_2', 'Indomitable Will', 'Resist fatigue and procrastination under pressure.', 'discipline', 2, 2, 'DISCIPLINE_1', 'discipline', 10, 'shield'],
    ];

    for (const s of skills) {
      await db.query(
        `INSERT INTO skills (code, name, description, category, tier, cost_points, required_skill_code, stat_bonus_type, stat_bonus_value, icon)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (code) DO NOTHING`,
        s
      );
    }
  }

  console.log('[SEED] Database seeding check completed.');
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('[SEED] Seeding finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[SEED] Seeding error:', err);
      process.exit(1);
    });
}
