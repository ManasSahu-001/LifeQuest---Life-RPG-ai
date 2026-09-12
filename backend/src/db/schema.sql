-- Life RPG Database Schema (PostgreSQL)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    theme VARCHAR(50) DEFAULT 'theme-a' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Characters Table
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'Hero',
    title VARCHAR(100) NOT NULL DEFAULT 'Novice Adventurer',
    level INTEGER NOT NULL DEFAULT 1,
    current_xp INTEGER NOT NULL DEFAULT 0,
    gold INTEGER NOT NULL DEFAULT 50,
    streak_count INTEGER NOT NULL DEFAULT 0,
    last_completed_date DATE,
    intellect INTEGER NOT NULL DEFAULT 10,
    strength INTEGER NOT NULL DEFAULT 10,
    creativity INTEGER NOT NULL DEFAULT 10,
    discipline INTEGER NOT NULL DEFAULT 10,
    avatar_url VARCHAR(255) DEFAULT 'default_avatar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Quests Table
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT 'coding', -- coding, study, fitness, creative, habit
    difficulty VARCHAR(20) NOT NULL DEFAULT 'medium', -- easy, medium, hard, epic
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
    xp_reward INTEGER NOT NULL DEFAULT 50,
    gold_reward INTEGER NOT NULL DEFAULT 25,
    streak_bonus INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    recurrence VARCHAR(20) NOT NULL DEFAULT 'none', -- none, daily, weekly
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Quest Completions History
CREATE TABLE IF NOT EXISTS quest_completions (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    xp_awarded INTEGER NOT NULL,
    gold_awarded INTEGER NOT NULL,
    streak_at_completion INTEGER NOT NULL
);

-- 5. Achievements Master Table
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

-- 6. User Achievements Junction Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_id)
);

-- 7. Rewards Master Table (Shop Items)
CREATE TABLE IF NOT EXISTS rewards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    cost_gold INTEGER NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'gift',
    category VARCHAR(50) NOT NULL DEFAULT 'consumable'
);

-- 8. User Rewards Table (Purchased Inventory)
CREATE TABLE IF NOT EXISTS user_rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id INTEGER NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_claimed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 9. XP & Gold Transactions Log
CREATE TABLE IF NOT EXISTS xp_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency_type VARCHAR(20) NOT NULL DEFAULT 'XP', -- XP or GOLD
    source_type VARCHAR(50) NOT NULL, -- quest_completion, achievement_unlock, reward_purchase, boss_defeat
    source_id INTEGER,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. World Boss & Battle State
CREATE TABLE IF NOT EXISTS bosses (
    id SERIAL PRIMARY KEY,
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

-- 11. User Boss Attacks
CREATE TABLE IF NOT EXISTS boss_attacks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boss_id INTEGER NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,
    damage INTEGER NOT NULL,
    source_quest_id INTEGER REFERENCES quests(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 12. Skills & User Skills (Skill Tree)
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
CREATE INDEX IF NOT EXISTS idx_quest_completions_user_id ON quest_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_quest_id ON quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
