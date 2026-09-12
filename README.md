# Life RPG — Gamified Productivity & City-Building RPG

> **Tech Member 1 Deliverable**: Core Backend, PostgreSQL Database, Authentication, Server-Authoritative RPG Progression Engine, and Theme Engine with Theme A (Cyberpunk), Theme B (High Fantasy), and Theme C (Solarpunk).

Turn your real-life goals and daily tasks into an RPG. Complete quests, earn XP, build your city, maintain streaks, and level up.

---

## 1. Project Architecture

The architecture maintains strict separation of concerns across a unified monorepo:

```text
React Frontend (Vite + Tailwind + Framer Motion)
      ↓
Theme Provider (Theme A: Cyberpunk / Theme B: High Fantasy / Theme C: Solarpunk)
      ↓
Shared Components (QuestCard, CharacterPanel, BossCard, SkillTree, ProgressBar, Navbar)
      ↓
Shared API Service (Axios Client with JWT Interceptors)
      ↓
ONE Backend (Node.js + Express + TypeScript)
      ↓
PostgreSQL Persistence (ACID Transactions, Foreign Key Cascades, Index Optimization)
```

---

## 2. Technology Stack

* **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Router v7, Canvas Confetti.
* **Backend**: Node.js, Express, TypeScript, bcryptjs, jsonwebtoken, cors.
* **Database & Persistence**: PostgreSQL with dual-driver support (`pg` for remote PostgreSQL databases like AWS RDS/Neon/Supabase and `@electric-sql/pglite` for zero-configuration, in-process persistent embedded PostgreSQL).
* **Authentication**: Custom JWT authentication with salted bcrypt password hashing, HTTP Bearer tokens, and strict user isolation.

---

## 3. Server-Authoritative RPG Progression

The frontend **never** calculates XP, Gold, Level, Rewards, Attribute progression, Streak progression, or Boss damage. All state transitions occur within atomic database transactions on the server:

1. **Deterministic Nonlinear Leveling Formula**:
   $$\text{requiredXP}(\text{level}) = \lfloor \text{baseXP} \times \text{growthFactor}^{(\text{level} - 1)} \rfloor$$
   With $\text{baseXP} = 100$ and $\text{growthFactor} = 1.25$.
   Surplus XP overflows across multiple levels in a deterministic loop.

2. **Data-Driven Attribute Mapping**:
   ```typescript
   export const ATTRIBUTE_MAP: Record<string, string> = {
     coding: "intellect",
     study: "intellect",
     fitness: "strength",
     creative: "creativity",
     habit: "discipline"
   };
   ```

3. **Consecutive Streak Multipliers**:
   * Same calendar day: Maintains current streak.
   * Consecutive day: Increments streak by $+1$, granting $+10\%$ bonus XP and $+5\%$ bonus Gold per day (up to $2.0\times$ max multiplier).
   * Missed day: Resets streak to 1 to preserve authentic stakes.

4. **Community World Boss Raids**:
   * Completing real-world quests strikes active World Bosses (e.g. *The Burnout Behemoth*).
   * Deals damage equal to $\text{XP} / 2$, with a $1.5\times$ critical damage multiplier if the quest category matches the boss's listed weakness.

---

## 4. Reusable Theme Engine

All 8 themes act as presentation layers consuming the same application state and shared components. Tech 1 delivers:

* **Theme A — Cyberpunk Synthwave**: Neo-Tokyo aesthetic, obsidian/cyan/pink palettes, monospace HUD borders, scanlines, and high-tech glitch cues.
* **Theme B — High Fantasy Realm**: Royal medieval tavern vibe, antique gold/crimson/parchment palettes, ornate serif headings, and wax seal motifs.
* **Theme C — Solarpunk Metropolis**: Biophilic ecology, radiant emerald/mint/amber tones, organic glassmorphic cards, and solar growth indicators.

### Shared Components
* `QuestCard`: Renders category badges, difficulty stars, XP/Gold reward pills, action controls, and sensory completion feedback.
* `CharacterPanel`: Displays hero title, level badge, live animated XP progress bar, gold pouch, streak counter, and 4-virtue attribute meters.
* `BossCard`: Renders active World Boss HP bar, weakness multipliers, top strike leaders, and raid mechanics.
* `SkillTree`: Multi-tier talent tree with prerequisite node requirements and permanent attribute enhancements.
* `ProgressBar`: Animated Framer Motion progress bar supporting customizable gradients, percentage labels, and themes.
* `Navbar`: Universal responsive navigation, stat monitors, theme dropdown switcher, and auth controls.
* `Modal`: Accessible dialog supporting backdrop blur, keyboard navigation, and escape dismissals.

---

## 5. API Contracts

### Authentication Endpoints
* `POST /auth/signup`: Registers new user, hashes password, creates character and starter quests.
* `POST /auth/login`: Authenticates credentials, returns JWT and character data.
* `POST /auth/logout`: Clears session.
* `GET /auth/me`: Retrieves current authenticated user and character stats.

### Quest Endpoints
* `POST /quests`: Creates a new quest assigned to `req.user.id`.
* `GET /quests`: Fetches quests strictly isolated to the authenticated user (supports `status` and `category` filters).
* `GET /quests/:id`: Returns quest details verifying ownership.
* `PATCH /quests/:id`: Updates quest attributes verifying ownership.
* `DELETE /quests/:id`: Deletes quest verifying ownership.
* `POST /quests/:id/complete`: Atomically completes quest, calculates server-authoritative XP, Gold, attributes, streaks, level-ups, and achievements.

### Character & Systems
* `GET /character`: Retrieves character stats, required XP, and attributes.
* `PATCH /character`: Updates hero name and title.
* `GET /character/transactions`: Retrieves XP and Gold audit log.
* `PATCH /user/theme`: Persists selected theme (`theme-a`, `theme-b`, `theme-c`, etc.).
* `GET /achievements`: Master achievements list with user unlock status.
* `GET /rewards` & `POST /rewards/:id/purchase`: Reward store and inventory redemptions.
* `GET /boss` & `POST /boss/attack`: World Boss state and battle system.
* `GET /skills` & `POST /skills/:id/unlock`: Skill tree progression.

---

## 6. Public SEO Pages

* `/`: Homepage matching exact H1 (*Turn Your Real Life Into a City-Building RPG*) with Schema.org `SoftwareApplication` JSON-LD, Open Graph tags, and interactive live theme switcher.
* `/features`: Technical breakdowns of nonlinear math, city grid expansion, and streak mechanics.
* `/how-it-works`: 4-step walkthrough for new adventurers.
* `/about`: Design philosophy and server-authoritative trust model.
* `/faq`: Search-indexed knowledge base with accessible accordions.
* `/public/robots.txt` & `/public/sitemap.xml`: Configured for maximum search engine crawlability.

---

## 7. Getting Started & Verification

### Prerequisites
* Node.js v18+ (tested on Node v24.13.0)
* npm v9+

### Installation
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Running Automated Test Suite
```bash
# Run backend test suite (covering leveling, streaks, attributes, isolation, transactions)
npm run test:backend
```

### Starting Development Servers
```bash
# Terminal 1: Start backend on http://localhost:5000
npm run dev:backend

# Terminal 2: Start frontend on http://localhost:5173
npm run dev:frontend
```

### Production Build
```bash
# Builds both backend and frontend for production
npm run build
```
