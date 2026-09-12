import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { db } from './db/index.js';
import { seedDatabase } from './db/seed.js';
import { errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import questRoutes from './routes/questRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import bossRoutes from './routes/bossRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import economyRoutes from './routes/economyRoutes.js';

import { apiRateLimiter } from './middleware/rateLimiter.js';

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow frontend origin
  credentials: true,
}));
app.use(express.json());

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint (exempt from rate limits)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rate limiting for general API requests
app.use(apiRateLimiter);

// Direct top-level routes
app.use('/auth', authRoutes);
app.use('/quests', questRoutes);
app.use('/character', characterRoutes);
app.use('/user/theme', themeRoutes);
app.use('/achievements', achievementRoutes);
app.use('/rewards', rewardRoutes);
app.use('/boss', bossRoutes);
app.use('/skills', skillRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/city', cityRoutes);
app.use('/economy', economyRoutes);

// Also mount under /api for standard REST client prefixing
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/quests', questRoutes);
apiRouter.use('/character', characterRoutes);
apiRouter.use('/user/theme', themeRoutes);
apiRouter.use('/achievements', achievementRoutes);
apiRouter.use('/rewards', rewardRoutes);
apiRouter.use('/boss', bossRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/campaigns', campaignRoutes);
apiRouter.use('/city', cityRoutes);
apiRouter.use('/economy', economyRoutes);

app.use('/api', apiRouter);

// Centralized error handling
app.use(errorHandler);

export async function startServer() {
  try {
    console.log('[SERVER] Initializing Life RPG Core Backend...');
    await db.init();
    await seedDatabase();

    const server = app.listen(config.port, () => {
      console.log(`[SERVER] Life RPG backend running on http://localhost:${config.port}`);
    });

    return { app, server };
  } catch (err) {
    console.error('[SERVER ERROR] Failed to start server:', err);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js')) {
  startServer();
}

export default app;
