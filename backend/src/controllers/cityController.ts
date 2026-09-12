import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { db } from '../db/index.js';

export interface CityBuildingDef {
  key: string;
  name: string;
  district: string;
  cost: number;
  minLevel: number;
  icon: string;
  description: string;
}

export const CITY_BUILDINGS_CATALOG: CityBuildingDef[] = [
  // Technology
  { key: 'tech_radio_tower', name: 'AV Club Radio Tower', district: 'technology', cost: 100, minLevel: 1, icon: 'radio', description: 'Enhances communication and tech quest efficiency.' },
  { key: 'tech_lab', name: 'Hawkins Energy Lab', district: 'technology', cost: 250, minLevel: 3, icon: 'cpu', description: 'Advanced computational research facility.' },
  { key: 'tech_mainframe', name: 'Department Cyber Core', district: 'technology', cost: 500, minLevel: 5, icon: 'server', description: 'A massive neural mainframe for complex projects.' },

  // Knowledge
  { key: 'study_library', name: 'Hawkins Public Archives', district: 'knowledge', cost: 100, minLevel: 1, icon: 'book', description: 'Repository of arcane lore and scholarly research.' },
  { key: 'study_academy', name: 'Governor Academy of Science', district: 'knowledge', cost: 300, minLevel: 4, icon: 'graduation-cap', description: 'Higher institution for master level knowledge.' },

  // Strength & Defense
  { key: 'strength_gym', name: 'Iron Crucible Gym', district: 'strength', cost: 100, minLevel: 1, icon: 'dumbbell', description: 'Trains physical resilience and conditioning.' },
  { key: 'strength_colosseum', name: 'Heroic Arena', district: 'strength', cost: 400, minLevel: 5, icon: 'swords', description: 'Colosseum where warriors prepare for epic trials.' },

  // Wellness
  { key: 'wellness_sanctuary', name: 'Botanical Sanctuary', district: 'wellness', cost: 150, minLevel: 2, icon: 'heart', description: 'Restful gardens that restore cognitive stamina.' },
  { key: 'wellness_monastery', name: 'Silent Peak Monastery', district: 'wellness', cost: 350, minLevel: 4, icon: 'sun', description: 'Temple of inner peace and mindfulness.' },

  // Economy
  { key: 'economy_bank', name: 'Founders Vault & Exchange', district: 'economy', cost: 200, minLevel: 2, icon: 'coins', description: 'Boosts gold generation and treasury commerce.' },

  // Culture
  { key: 'culture_theater', name: 'The Palace Arcade & Cinema', district: 'culture', cost: 200, minLevel: 3, icon: 'film', description: 'Cultural hub generating artistic inspiration.' },

  // Community
  { key: 'community_plaza', name: 'Central Dominion Plaza', district: 'community', cost: 300, minLevel: 4, icon: 'landmark', description: 'The beating heart of citizen unity.' },
];

export function calculatePopulation(level: number, streak: number, gold: number, buildingCount: number): number {
  const base = 100;
  const levelPop = (level - 1) * 75;
  const buildingPop = buildingCount * 50;
  const streakPop = streak * 15;
  const goldBonus = Math.floor(gold / 100) * 10;
  return base + levelPop + buildingPop + streakPop + goldBonus;
}

export async function getCity(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    const userRes = await db.query(
      `SELECT email, theme, governor_title, city_name FROM users WHERE id = $1`,
      [userId]
    );
    const charRes = await db.query(
      `SELECT * FROM characters WHERE user_id = $1`,
      [userId]
    );
    const buildingsRes = await db.query(
      `SELECT * FROM user_buildings WHERE user_id = $1 ORDER BY unlocked_at ASC`,
      [userId]
    );

    const user = userRes.rows[0];
    const character = charRes.rows[0];
    const unlockedBuildings = buildingsRes.rows;

    const population = calculatePopulation(
      character?.level || 1,
      character?.streak_count || 0,
      character?.gold || 0,
      unlockedBuildings.length
    );

    const unlockedKeys = new Set(unlockedBuildings.map((b) => b.building_key));

    const districts: Record<string, any[]> = {
      technology: [],
      knowledge: [],
      strength: [],
      wellness: [],
      economy: [],
      culture: [],
      community: [],
    };

    unlockedBuildings.forEach((b) => {
      if (districts[b.district]) {
        districts[b.district].push(b);
      }
    });

    const catalog = CITY_BUILDINGS_CATALOG.map((b) => ({
      ...b,
      isUnlocked: unlockedKeys.has(b.key),
      canAfford: (character?.gold || 0) >= b.cost,
      meetsLevel: (character?.level || 1) >= b.minLevel,
    }));

    res.json({
      success: true,
      cityName: user?.city_name || 'Neo Haven',
      governorTitle: user?.governor_title || 'Novice Founder',
      activeTheme: user?.theme || 'theme-a',
      level: character?.level || 1,
      gold: character?.gold || 0,
      streak: character?.streak_count || 0,
      population,
      districts,
      buildings: unlockedBuildings,
      catalog,
    });
  } catch (error) {
    console.error('[City] Error getting city data:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve city data.' });
  }
}

export async function constructBuilding(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { buildingKey } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const buildingDef = CITY_BUILDINGS_CATALOG.find((b) => b.key === buildingKey);
  if (!buildingDef) {
    res.status(404).json({ success: false, message: 'Building specification not found in catalog.' });
    return;
  }

  try {
    const result = await db.withTransaction(async (client) => {
      // 1. Check Character
      const charRes = await client.query(
        `SELECT id, level, gold, streak_count FROM characters WHERE user_id = $1 FOR UPDATE`,
        [userId]
      );
      const character = charRes.rows[0];
      if (!character) throw new Error('Character not found');

      if (character.level < buildingDef.minLevel) {
        throw new Error(`Requires Governor Level ${buildingDef.minLevel}. Current level: ${character.level}`);
      }

      if (character.gold < buildingDef.cost) {
        throw new Error(`Insufficient gold. Required: ${buildingDef.cost} G, Available: ${character.gold} G`);
      }

      // 2. Check if already built
      const existRes = await client.query(
        `SELECT id FROM user_buildings WHERE user_id = $1 AND building_key = $2`,
        [userId, buildingKey]
      );
      if (existRes.rows.length > 0) {
        throw new Error(`Building "${buildingDef.name}" has already been constructed.`);
      }

      // 3. Deduct Gold & Update Character
      const newGold = character.gold - buildingDef.cost;
      await client.query(
        `UPDATE characters SET gold = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [newGold, character.id]
      );

      // 4. Record Transaction
      await client.query(
        `INSERT INTO xp_transactions (user_id, character_id, amount, currency_type, source_type, balance_after)
         VALUES ($1, $2, $3, 'GOLD', 'building_construction', $4)`,
        [userId, character.id, -buildingDef.cost, newGold]
      );

      // 5. Insert Building
      const bRes = await client.query(
        `INSERT INTO user_buildings (user_id, district, building_key, name, tier)
         VALUES ($1, $2, $3, $4, 1)
         RETURNING *`,
        [userId, buildingDef.district, buildingDef.key, buildingDef.name]
      );

      // 6. Recalculate Population
      const countRes = await client.query(
        `SELECT COUNT(*) as count FROM user_buildings WHERE user_id = $1`,
        [userId]
      );
      const newCount = parseInt(countRes.rows[0].count, 10);
      const newPopulation = calculatePopulation(character.level, character.streak_count, newGold, newCount);

      await client.query(
        `UPDATE characters SET population = $1 WHERE id = $2`,
        [newPopulation, character.id]
      );

      return {
        building: bRes.rows[0],
        newGold,
        newPopulation,
      };
    });

    res.status(201).json({
      success: true,
      message: `Successfully erected "${buildingDef.name}"!`,
      ...result,
    });
  } catch (error: any) {
    console.error('[City] Error constructing building:', error);
    res.status(400).json({ success: false, message: error.message || 'Construction failed.' });
  }
}
