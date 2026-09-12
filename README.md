# LifeQuest — Gamified Productivity & Metropolitan City-Building RPG

> **Unified Production Release**: Full-stack productivity RPG platform integrating an intelligent AI Quest Master, Server-Authoritative Progression Engine, 8 Level-Locked Visual Realms, Real-time Boss Arena Battles, 7-District Urban City Builder, Treasury Economy, Custom Character Rigs, and Zero-Asset Procedural Web Audio Engine.

Turn your real-life ambitions and daily tasks into an epic adventure. Conquer procrastination, forge questlines, vanquish Nemesis bosses, develop your personal metropolis, and unlock interdimensional realms as you level up!

---

## 1. Core Metagame Loop

```text
       ┌────────────────────────┐
       │   Real-Life Ambition   │  (e.g., "Ace DBMS semester exams in 2 weeks")
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │     AI Quest Master    │  (Procedural / Gemini LLM quest synthesis)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │  Dynamic Quest Chain   │  (XP, Gold, Attribute Gains & Boss Damage)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │  Execute Daily Quests  │  (Real-life task completions & habit streaks)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │ Server-Authorized Math │  (Atomic transactions: XP, Gold, Streak Multiplier)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │   Level Up & Rewards   │
       └─────┬────────────┬─────┘
             │            │
             ▼            ▼
   ┌─────────────────┐  ┌───────────────────────────┐
   │ Boss Arena Raid │  │ Metropolitan City Builder │
   │ (Strike Bosses) │  │ (Construct Urban Sectors) │
   └─────────────────┘  └───────────────────────────┘
```

---

## 2. Product Architecture

The application is structured as a unified, high-performance monorepo with strict separation of concerns and server-authoritative trust:

```text
React 19 + TypeScript + Tailwind CSS Frontend (Vite)
      ↓
Theme Engine (8 Immersive Level-Locked Visual Realms: Themes A through H)
      ↓
Accessible Toast Notification Engine (XP/Gold chimes, realm warps, level-up celebrations)
      ↓
Audio Synthesizer Engine (Web Audio API Procedural BGM + Combat SFX)
      ↓
AI Quest Master & Boss Arena (Floating combat text, hit flashes, and live combat logs)
      ↓
Metropolitan City Canvas (6 Specialized Urban Districts & Building Construction)
      ↓
Shared API Service (Axios Client with JWT Interceptors & path normalization)
      ↓
ONE Unified Backend (Node.js + Express + TypeScript)
      ↓
Sliding-Window Rate Limiting Engine (Brute force & AI quota protection)
      ↓
PostgreSQL Dual-Driver Persistence (Embedded PGlite + Remote PostgreSQL)
```

---

## 3. Eight Level-Locked Visual Realms

Every realm features custom typography, CSS variable design tokens, canvas particle systems, soundscapes, and character rigs:

| Theme | Realm Name | Required Level | Avatar Class | World Boss | Ambient Visual FX | Soundscape / Procedural BGM |
|---|---|---|---|---|---|---|
| **Theme A** | Cyberpunk Synthwave | **Level 1** | Cyber Netrunner | The Procrastination Protocol | Cyan/Pink Data Sparks | Neon Arpeggiator & Deep Bass |
| **Theme B** | High Fantasy Realm | **Level 2** | Paladin Knight | Dread Dragon Fafnir | Golden Stardust Motes | Lydian Harp & Castle Chords |
| **Theme C** | Solarpunk Metropolis | **Level 3** | Solar Botanist | The Smog Colossus | Sunlit Chlorophyll Motes | Organic Marimba & Flute Drone |
| **Theme D** | Enchanted Forest | **Level 4** | Forest Druid | Malakor, The Blight Treant | Bioluminescent Spores | Wind Chimes & Pentatonic Bells |
| **Theme E** | Last Samurai Standing | **Level 5** | Samurai Ronin | Kurokage, Shadow Shogun | Falling Sakura Petals | Koto Plucks & Taiko Resonances |
| **Theme F** | Build Your City | **Level 6** | Cyber Architect | Titan OVERLOAD-9 | Blueprint Grid Sparks | Industrial Tech Pulse & Bass |
| **Theme G** | Haunted World | **Level 7** | Eldritch Sorcerer | Lord Malathrax, Cursed Lich | Graveyard Mist (`FogCanvas`) | Gothic Pipe Organ Drone |
| **Theme H** | The Upside Down | **Level 8** | Psionic Shadow Walker | The Mind Flayer | Floating Spores (`ParticleSporeCanvas`) | Detuned '80s Analog Synth Pulse |

### Server-Authoritative Level Lock Enforcement
- Attempting to activate a locked realm (e.g. `PATCH /user/theme` with `theme-h` while at Level 2) returns **HTTP 403 Forbidden**.
- The Theme Matrix modal and Signup Page visually display lock badges and disable unauthorized realms.

---

## 4. Server-Authoritative Progression Engine

The client **never** computes or trusts XP, Gold, Level, Attributes, Streaks, or Boss strike damage. All state transitions occur within atomic ACID database transactions on the server:

1. **Nonlinear Leveling Formula**:
   $$\text{requiredXP}(\text{level}) = \lfloor \text{baseXP} \times \text{growthFactor}^{(\text{level} - 1)} \rfloor$$
   With $\text{baseXP} = 100$ and $\text{growthFactor} = 1.25$. Surplus XP overflows deterministically across multiple levels.

2. **Core RPG & Department Attributes**:
   - `intellect` / `tech_xp`: Boosted by Coding & Technical quests
   - `strength` / `strength_xp`: Boosted by Fitness & Physical quests
   - `creativity` / `culture_xp`: Boosted by Creative & Design quests
   - `discipline` / `knowledge_xp`: Boosted by Study, Finance, and Habit quests

3. **Streak Multiplier System**:
   - 1–2 Days: Base Rewards
   - 3–6 Days: **+20% Bonus XP & Gold**
   - 7–13 Days: **+50% Bonus XP & Gold**
   - 14+ Days: **+100% Double Rewards**

---

## 5. Security & Reliability Hardening

1. **Sliding-Window Rate Limiting (`rateLimiter.ts`)**:
   - Zero-dependency in-memory sliding window rate limiter.
   - `authRateLimiter`: Max 20 requests per 15 minutes on `/auth/login` and `/auth/signup`.
   - `campaignRateLimiter`: Max 10 requests per 10 minutes on `/campaigns/generate`.
   - `apiRateLimiter`: Global traffic protection across all API routes.
2. **Server-Calculated Strike Damage**:
   - Boss strike damage is computed on the server based on the hero's actual `strength` and `level` attributes.
3. **Information Disclosure Prevention**:
   - Centralized error handler masks stack traces and database paths in production mode.

---

## 6. Quickstart Guide

### Prerequisites
- Node.js 18+ and npm installed.

### Installation & Execution
```bash
# Install dependencies
npm run install:all

# Run both Backend and Frontend in development mode:
npm run dev:all

# Or run separately:
npm run dev:backend   # Starts backend on http://localhost:5000
npm run dev:frontend  # Starts frontend on http://localhost:5173
```

### Production Build & Tests
```bash
# Monorepo build (builds both backend and frontend):
npm run build

# Run automated backend test suite (9 tests covering DB, auth, quests, progression, level locks, and rate limits):
npm run test
```

### Dual Database Options
1. **Embedded Zero-Config (Default)**: Uses `@electric-sql/pglite` running locally in WebAssembly with persistent file storage in `backend/data/rpg-pglite`. No external PostgreSQL setup required!
2. **Remote PostgreSQL**: Set `DATABASE_URL=postgresql://user:pass@localhost:5432/lifequest` in `backend/.env` to connect to Supabase, Railway, Neon, or AWS RDS.

---

## 7. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Set Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://your-backend.up.railway.app`).
5. Deploy! (Routing is preconfigured via `frontend/vercel.json`).

### Backend Deployment (Railway / Render)
1. In Railway or Render, create a new service from the repository.
2. Set **Root Directory** to `backend`.
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Configure Environment Variables according to `backend/.env.example`:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `JWT_SECRET=your_secure_secret_key`
   - `DATABASE_URL=your_postgresql_connection_string` (optional; if omitted, embedded PGlite is used)
   - `GEMINI_API_KEY=your_gemini_key` (optional)

---

**Built with pride for high performance, zero procrastination, and epic gamified productivity.**

