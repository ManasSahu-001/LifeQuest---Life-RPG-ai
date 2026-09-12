import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { db } from '../db/index.js';

export interface ShopItemDef {
  key: string;
  name: string;
  type: 'theme' | 'badge' | 'artifact' | 'building';
  cost: number;
  description: string;
  icon?: string;
  themeId?: string;
}

export const SHOP_CATALOG: ShopItemDef[] = [
  // Themes
  { key: 'theme_upside_down', name: 'The Upside Down (Hawkins 1984)', type: 'theme', cost: 150, description: 'Neon CRT scanlines, red thunderstorms, and floating ash spores.', themeId: 'theme-h', icon: 'zap' },
  { key: 'theme_haunted_world', name: 'Cursed Necropolis (Haunted World)', type: 'theme', cost: 150, description: 'Dark Victorian gothic mist, spectral green flames, and gargoyle borders.', themeId: 'theme-g', icon: 'skull' },

  // Badges
  { key: 'badge_hellfire', name: 'Hellfire Club Master Pin', type: 'badge', cost: 100, description: 'Exclusive pin worn by the most fearless dungeon crawlers.', icon: 'flame' },
  { key: 'badge_necromancer', name: 'Grand Necromancer Sigil', type: 'badge', cost: 120, description: 'Emblem of mastery over dark deadlines and procrastination curses.', icon: 'skull' },
  { key: 'badge_flayer_slayer', name: 'Mind Flayer Slayer Medallion', type: 'badge', cost: 200, description: 'Bestowed upon heroes who struck down interdimensional bosses.', icon: 'shield' },
  { key: 'badge_architect', name: 'Master City Architect', type: 'badge', cost: 180, description: 'Symbolizing expansive urban planning and rapid construction.', icon: 'crown' },

  // Relics & Artifacts
  { key: 'artifact_chrono_crystal', name: 'Chrono Focus Crystal', type: 'artifact', cost: 250, description: 'Ancient relic pulsing with temporal energy, sharpens concentration.', icon: 'gem' },
  { key: 'artifact_cyber_deck', name: 'Cyber Netrunner Deck', type: 'artifact', cost: 300, description: 'Military-grade neural interface for deep hacking sprints.', icon: 'terminal' },
];

export async function getShop(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    const charRes = await db.query(`SELECT gold FROM characters WHERE user_id = $1`, [userId]);
    const invRes = await db.query(`SELECT * FROM inventory_items WHERE user_id = $1`, [userId]);

    const ownedKeys = new Set(invRes.rows.map((item) => item.item_key));

    const catalog = SHOP_CATALOG.map((item) => ({
      ...item,
      isOwned: ownedKeys.has(item.key),
      isEquipped: invRes.rows.some((r) => r.item_key === item.key && r.is_equipped),
    }));

    res.json({
      success: true,
      gold: charRes.rows[0]?.gold || 0,
      shop: catalog,
      inventory: invRes.rows,
    });
  } catch (error) {
    console.error('[Economy] Error retrieving shop catalog:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve shop catalog.' });
  }
}

export async function purchaseItem(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { itemKey } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const itemDef = SHOP_CATALOG.find((i) => i.key === itemKey);
  if (!itemDef) {
    res.status(404).json({ success: false, message: 'Item not found in treasury catalog.' });
    return;
  }

  try {
    const result = await db.withTransaction(async (client) => {
      // 1. Check Gold
      const charRes = await client.query(
        `SELECT id, gold FROM characters WHERE user_id = $1 FOR UPDATE`,
        [userId]
      );
      const character = charRes.rows[0];
      if (!character) throw new Error('Character record not found.');

      if (character.gold < itemDef.cost) {
        throw new Error(`Insufficient gold. Required: ${itemDef.cost} G, Available: ${character.gold} G`);
      }

      // 2. Check if already owned
      const existRes = await client.query(
        `SELECT id FROM inventory_items WHERE user_id = $1 AND item_key = $2`,
        [userId, itemKey]
      );
      if (existRes.rows.length > 0) {
        throw new Error(`You already possess "${itemDef.name}".`);
      }

      // 3. Deduct Gold
      const newGold = character.gold - itemDef.cost;
      await client.query(
        `UPDATE characters SET gold = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [newGold, character.id]
      );

      // 4. Record Transaction
      await client.query(
        `INSERT INTO xp_transactions (user_id, character_id, amount, currency_type, source_type, balance_after)
         VALUES ($1, $2, $3, 'GOLD', 'reward_purchase', $4)`,
        [userId, character.id, -itemDef.cost, newGold]
      );

      // 5. Add to Inventory
      const invRes = await client.query(
        `INSERT INTO inventory_items (user_id, item_key, item_name, item_type, is_equipped)
         VALUES ($1, $2, $3, $4, FALSE)
         RETURNING *`,
        [userId, itemDef.key, itemDef.name, itemDef.type]
      );

      return {
        item: invRes.rows[0],
        newGold,
      };
    });

    res.status(201).json({
      success: true,
      message: `Purchased "${itemDef.name}"!`,
      ...result,
    });
  } catch (error: any) {
    console.error('[Economy] Error purchasing item:', error);
    res.status(400).json({ success: false, message: error.message || 'Purchase failed.' });
  }
}

export async function toggleEquipItem(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { itemKey } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    const invRes = await db.query(
      `SELECT * FROM inventory_items WHERE user_id = $1 AND item_key = $2`,
      [userId, itemKey]
    );

    if (invRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Item not in inventory.' });
      return;
    }

    const item = invRes.rows[0];
    const newEquipped = !item.is_equipped;

    await db.query(
      `UPDATE inventory_items SET is_equipped = $1 WHERE id = $2`,
      [newEquipped, item.id]
    );

    res.json({
      success: true,
      message: newEquipped ? `Equipped ${item.item_name}` : `Unequipped ${item.item_name}`,
      isEquipped: newEquipped,
    });
  } catch (error) {
    console.error('[Economy] Error toggling item equip state:', error);
    res.status(500).json({ success: false, message: 'Failed to update equipment state.' });
  }
}
