-- Life RPG Unified Database Schema (PostgreSQL)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    theme VARCHAR(50) DEFAULT 'theme-a' NOT NULL,
    governor_title VARCHAR(100) DEFAULT 'Novice Founder' NOT NULL,
    city_name VARCHAR(100) DEFAULT 'Neo Haven' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Characters & RPG Progression Table
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'Hero',
    title VARCHAR(100) NOT NULL DEFAULT 'Novice Adventurer',
    level INTEGER NOT NULL DEFAULT 1,
    current_xp INTEGER NOT NULL DEFAULT 0,
    gold INTEGER NOT NULL DEFAULT 150,
    streak_count INTEGER NOT NULL DEFAULT 0,
    last_completed_date DATE,
    intellect INTEGER NOT NULL DEFAULT 10,
    strength INTEGER NOT NULL DEFAULT 10,
    creativity INTEGER NOT NULL DEFAULT 10,
    discipline INTEGER NOT NULL DEFAULT 10,
    population INTEGER NOT NULL DEFAULT 120,
    tech_xp INTEGER NOT NULL DEFAULT 0,
    knowledge_xp INTEGER NOT NULL DEFAULT 0,
    strength_xp INTEGER NOT NULL DEFAULT 0,
    wellness_xp INTEGER NOT NULL DEFAULT 0,
    economy_xp INTEGER NOT NULL DEFAULT 0,
    culture_xp INTEGER NOT NULL DEFAULT 0,
    community_xp INTEGER NOT NULL DEFAULT 0,
    avatar_url VARCHAR(255) DEFAULT 'default_avatar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Campaigns (AI-Forged or Custom Multi-Quest Ambitions)
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    real_life_goal TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'active' NOT NULL, -- active, completed, abandoned
    total_quests INTEGER DEFAULT 0 NOT NULL,
    completed_quests INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Campaign Nemesis Bosses
CREATE TABLE IF NOT EXISTS campaign_bosses (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER UNIQUE NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    boss_type VARCHAR(50) NOT NULL, -- mind_flayer, demogorgon, eldritch_lich, gargoyle_king, shadow_beast
    description TEXT,
    max_hp INTEGER NOT NULL DEFAULT 500,
    current_hp INTEGER NOT NULL DEFAULT 500,
    is_defeated BOOLEAN NOT NULL DEFAULT FALSE,
    reward_gold INTEGER NOT NULL DEFAULT 200,
    reward_xp INTEGER NOT NULL DEFAULT 450,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Quests Table
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT 'coding', -- coding, study, fitness, creative, habit, wellness, finance, social
    difficulty VARCHAR(20) NOT NULL DEFAULT 'medium', -- easy, medium, hard, epic
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
    attribute_type VARCHAR(50) NOT NULL DEFAULT 'intellect',
    attribute_gain INTEGER NOT NULL DEFAULT 5,
    boss_damage INTEGER NOT NULL DEFAULT 50,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    gold_reward INTEGER NOT NULL DEFAULT 25,
    streak_bonus INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    recurrence VARCHAR(20) NOT NULL DEFAULT 'none', -- none, daily, weekly
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Quest Completions History
CREATE TABLE IF NOT EXISTS quest_completions (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    xp_awarded INTEGER NOT NULL,
    gold_awarded INTEGER NOT NULL,
    streak_at_completion INTEGER NOT NULL
);

-- 7. City Districts & Buildings Table
CREATE TABLE IF NOT EXISTS user_buildings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    district VARCHAR(50) NOT NULL, -- technology, knowledge, strength, wellness, economy, culture, community
    building_key VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    tier INTEGER NOT NULL DEFAULT 1,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. Treasury & Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_key VARCHAR(100) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- building, theme, badge, artifact, consumable
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. Achievements Master Table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    badge_icon VARCHAR(50) NOT NULL,
    criteria_type VARCHAR(50) NOT NULL, -- quests_completed, streak_count, level_reached, gold_earned, category_count
    criteria_threshold INTEGER NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 100,
    gold_reward INTEGER NOT NULL DEFAULT 50
);

-- 10. User Achievements Junction Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_id)
);

-- 11. Rewards Master Table (Shop Items)
CREATE TABLE IF NOT EXISTS rewards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    cost_gold INTEGER NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'gift',
    category VARCHAR(50) NOT NULL DEFAULT 'consumable'
);

-- 12. User Rewards Table (Purchased Consumables/Buffs)
CREATE TABLE IF NOT EXISTS user_rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id INTEGER NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_claimed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 13. XP & Gold Transactions Log
CREATE TABLE IF NOT EXISTS xp_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency_type VARCHAR(20) NOT NULL DEFAULT 'XP', -- XP or GOLD
    source_type VARCHAR(50) NOT NULL, -- quest_completion, achievement_unlock, reward_purchase, boss_defeat, building_construction
    source_id INTEGER,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 14. World Boss & Battle State (Realm Bosses)
CREATE TABLE IF NOT EXISTS bosses (
    id SERIAL PRIMARY KEY,
    theme VARCHAR(50) DEFAULT 'theme-a',
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    max_hp INTEGER NOT NULL DEFAULT 1000,
    current_hp INTEGER NOT NULL DEFAULT 1000,
    level INTEGER NOT NULL DEFAULT 5,
    weakness_category VARCHAR(50) DEFAULT 'coding',
    gold_bounty INTEGER NOT NULL DEFAULT 500,
    xp_bounty INTEGER NOT NULL DEFAULT 1000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 15. User Boss Attacks
CREATE TABLE IF NOT EXISTS boss_attacks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boss_id INTEGER NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,
    damage INTEGER NOT NULL,
    source_quest_id INTEGER REFERENCES quests(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 16. Skills & User Skills (Skill Tree)
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    tier INTEGER NOT NULL DEFAULT 1,
    cost_points INTEGER NOT NULL DEFAULT 1,
    required_skill_code VARCHAR(50),
    stat_bonus_type VARCHAR(50),
    stat_bonus_value INTEGER NOT NULL DEFAULT 5,
    icon VARCHAR(50) NOT NULL DEFAULT 'zap'
);

CREATE TABLE IF NOT EXISTS user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_user_skill UNIQUE(user_id, skill_id)
);

-- Indexes for performance & rapid query execution
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_category ON quests(category);
CREATE INDEX IF NOT EXISTS idx_quests_completed ON quests(is_completed);
CREATE INDEX IF NOT EXISTS idx_quests_campaign_id ON quests(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_bosses_user_id ON campaign_bosses(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_bosses_campaign_id ON campaign_bosses(campaign_id);
CREATE INDEX IF NOT EXISTS idx_user_buildings_user_id ON user_buildings(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_user_id ON quest_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_quest_id ON quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
