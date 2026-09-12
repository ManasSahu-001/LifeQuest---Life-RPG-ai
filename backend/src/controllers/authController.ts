import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { AuthService } from '../services/authService.js';
import { RpgEngine } from '../services/rpgEngine.js';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, characterName, theme } = req.body;

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ success: false, error: 'A valid email address is required.' });
        return;
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check existing user
      const existing = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existing.rows.length > 0) {
        res.status(409).json({ success: false, error: 'An account with this email already exists.' });
        return;
      }

      const passwordHash = await AuthService.hashPassword(password);
      const selectedTheme = theme && ['theme-a', 'theme-b', 'theme-c'].includes(theme) ? theme : 'theme-a';
      const heroName = (characterName && typeof characterName === 'string') ? characterName.trim().slice(0, 50) : 'Hero';

      // Atomic creation of user, character, and initial starter quests
      const result = await db.withTransaction(async (client) => {
        const userRes = await client.query(
          `INSERT INTO users (email, password_hash, theme)
           VALUES ($1, $2, $3)
           RETURNING id, email, theme, created_at`,
          [normalizedEmail, passwordHash, selectedTheme]
        );
        const newUser = userRes.rows[0];

        const charRes = await client.query(
          `INSERT INTO characters (user_id, name, title, level, current_xp, gold, streak_count, intellect, strength, creativity, discipline)
           VALUES ($1, $2, 'Novice Adventurer', 1, 0, 50, 0, 10, 10, 10, 10)
           RETURNING *`,
          [newUser.id, heroName]
        );
        const newChar = charRes.rows[0];

        // Starter quests
        const starterQuests = [
          [newUser.id, 'First Steps in the Code Realm', 'Write a clean function, refactor a module, or solve a coding puzzle.', 'coding', 'easy', 'high', 50, 25],
          [newUser.id, 'Kinetic Calisthenics', 'Perform 20 pushups, a 15-minute walk, or a gym workout.', 'fitness', 'easy', 'medium', 50, 25],
          [newUser.id, 'Strategic Planning', 'Review and organize daily priorities for the upcoming week.', 'habit', 'easy', 'medium', 50, 25],
        ];

        for (const q of starterQuests) {
          await client.query(
            `INSERT INTO quests (user_id, title, description, category, difficulty, priority, xp_reward, gold_reward)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            q
          );
        }

        return { user: newUser, character: newChar };
      });

      const token = AuthService.generateToken({
        userId: result.user.id,
        email: result.user.email,
      });

      const reqXP = RpgEngine.getRequiredXP(result.character.level);
      const charWithProgress = {
        ...result.character,
        requiredXP: reqXP,
        progressPercentage: Math.round((result.character.current_xp / reqXP) * 100),
      };

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: result.user,
        character: charWithProgress,
      });
    } catch (err: any) {
      console.error('[AUTH SIGNUP ERROR]', err);
      res.status(500).json({ success: false, error: 'Registration failed due to server error.' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const userRes = await db.query(
        'SELECT id, email, password_hash, theme, created_at FROM users WHERE email = $1',
        [normalizedEmail]
      );

      if (userRes.rows.length === 0) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      const user = userRes.rows[0];
      const valid = await AuthService.comparePassword(password, user.password_hash);
      if (!valid) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      const token = AuthService.generateToken({
        userId: user.id,
        email: user.email,
      });

      const charRes = await db.query('SELECT * FROM characters WHERE user_id = $1', [user.id]);
      const character = charRes.rows[0];

      const reqXP = RpgEngine.getRequiredXP(character.level);
      const charWithProgress = {
        ...character,
        requiredXP: reqXP,
        progressPercentage: Math.round((character.current_xp / reqXP) * 100),
      };

      // Strip password hash from response
      const safeUser = {
        id: user.id,
        email: user.email,
        theme: user.theme,
        created_at: user.created_at,
      };

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: safeUser,
        character: charWithProgress,
      });
    } catch (err: any) {
      console.error('[AUTH LOGIN ERROR]', err);
      res.status(500).json({ success: false, error: 'Login failed due to server error.' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Logged out successfully.' });
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRes = await db.query(
        'SELECT id, email, theme, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (userRes.rows.length === 0) {
        res.status(404).json({ success: false, error: 'User not found.' });
        return;
      }

      const charRes = await db.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
      const character = charRes.rows[0];

      const reqXP = RpgEngine.getRequiredXP(character.level);
      const charWithProgress = {
        ...character,
        requiredXP: reqXP,
        progressPercentage: Math.round((character.current_xp / reqXP) * 100),
      };

      res.json({
        success: true,
        user: userRes.rows[0],
        character: charWithProgress,
      });
    } catch (err: any) {
      console.error('[AUTH ME ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
    }
  }
}
