import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { db } from '../db/index.js';

export interface AuthenticatedUser {
  id: number;
  email: string;
  theme: string;
}

export type AuthRequest = Request;

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateToken = requireAuth;

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Missing or invalid Authorization header.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = AuthService.verifyToken(token);
    } catch (err) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired authentication token.',
      });
      return;
    }

    const userRes = await db.query(
      'SELECT id, email, theme FROM users WHERE id = $1',
      [payload.userId]
    );

    if (userRes.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'User account no longer exists.',
      });
      return;
    }

    req.user = userRes.rows[0];
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Authentication error occurred.',
    });
  }
}
