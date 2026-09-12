# Life RPG — Gamified Productivity & City-Building RPG

> **Unified Production Release**: Fully integrated single application combining Tech Member 1 (Core Backend, Server-Authoritative PostgreSQL Engine, Progression, Themes A-C) and Tech Member 2 (Themes D-F, Sound Engine, Particle Canvas, Interactive Character Rigs, Realm Milestones).

Turn your real-life goals and daily tasks into an RPG. Complete quests, earn XP, build your virtual city, maintain streaks, and level up to unlock new realms!

---

## 1. Product Architecture

The application is structured as a unified monorepo with strict separation of concerns and server-authoritative trust:

```text
React 19 + TypeScript + Tailwind CSS Frontend (Vite)
      ↓
Theme Engine (6 Immersive Level-Locked Realms)
      ↓
Audio Synthesizer Engine (Web Audio API Procedural BGM + Combat SFX)
      ↓
Interactive Character Stage (6 Visual Avatar Rigs & Theme Particle Canvas)
      ↓
Shared API Service (Axios Client with JWT Interceptors)
      ↓
ONE Backend (Node.js + Express + TypeScript)
      ↓
PostgreSQL Dual-Driver Persistence (pg + @electric-sql/pglite)
```

---

## 2. Six Level-Locked Visual Themes

Every theme is a complete, immersive realm with unique typography, CSS variables, soundscapes, particle systems, interactive avatar rigs, boss encounters, and virtual city progression.

**Themes are strictly level-locked** both on the client UI and server-authoritatively in the backend:

| Theme | Realm Name | Required Level | Avatar Class | World Boss | Ambient Particle FX |
|---|---|---|---|---|---|
| **Theme A** | Cyberpunk Synthwave | **Level 1** | Cyber Netrunner | The Procrastination Protocol | Neon Cyan/Pink Data Sparks |
| **Theme B** | High Fantasy Realm | **Level 2** | Paladin Knight | The Dread Dragon of Sloth | Golden Stardust Motes |
| **Theme C** | Solarpunk Metropolis | **Level 3** | Solar Botanist | The Smog Leviathan | Sunlit Chlorophyll Motes |
| **Theme D** | Enchanted Forest | **Level 4** | Forest Druid | Corrupted Ancient Treant | Bioluminescent Spores |
| **Theme E** | Last Samurai Standing | **Level 5** | Samurai Ronin | Shogun of Indolence | Falling Sakura Petals |
| **Theme F** | Build Your City | **Level 6** | Cyber Architect | Decay Colossus | Architectural Blueprint Sparks |

### Level Lock Enforcement
- **Server-Authoritative Validation**: Attempting to switch to a locked theme (e.g. `PATCH /api/user/theme` with `theme-d` while at Level 2) returns **HTTP 403 Forbidden** with an informative error message.
- **Client Matrix UI**: The Theme Matrix modal (`ThemeSelector.tsx`) displays lock icons, level progress bars, and prevents premature activation with audio-tactile feedback.

---

## 3. Server-Authoritative RPG Progression Engine

The client **never** computes or trusts XP, Gold, Level, Attributes, Streaks, or Boss damage. All state transitions occur within atomic ACID database transactions on the server:

1. **Deterministic Nonlinear Leveling Formula**:
   $$\text{requiredXP}(\text{level}) = \lfloor \text{baseXP} \times \text{growthFactor}^{(\text{level} - 1)} \rfloor$$
   With $\text{baseXP} = 100$ and $\text{growthFactor} = 1.25$. Surplus XP overflows deterministically across multiple levels.

2. **Data-Driven 4-Attribute System**:
   * **Intellect**: Coding & study tasks.
   * **Strength**: Fitness & physical exercise.
   * **Creativity**: Art, writing, and design tasks.
   * **Discipline**: Habit tracking, morning routines, and streak preservation.

3. **Consecutive Daily Streak Multipliers**:
   * Same calendar day: Preserves current streak.
   * Consecutive day: Increments streak by $+1$, granting $+10\%$ bonus XP and $+5\%$ bonus Gold per day (up to $2.0\times$ multiplier).
   * Missed day: Resets streak to 1 to preserve authentic stakes.

4. **Community & Theme World Boss Battles**:
   * Completing quests in the real world strikes the active realm boss with damage equal to $\text{XP} / 2$.
   * Exploiting boss category weaknesses delivers a **1.5x Critical Strike**.

---

## 4. Key Systems & Modules

### Audio Synthesizer Engine (`audioEngine.ts`)
* Built directly on the standard **Web Audio API** — zero external audio assets required.
* Procedural BGM tailored to each theme (Pentatonic fantasy arpeggios, Cyberpunk bass drones, Nature flutes, Shamisen scales, Lo-fi city beats).
* Procedural sound effects: `playQuestComplete()`, `playLevelUp()`, `playAttack()`, `playHit()`, `playMeditate()`.
* Master mute toggle and volume normalization controls.

### Interactive Character Stage (`CharacterStage.tsx`)
* Dedicated interactive combat ring featuring 6 theme-reactive SVG avatars (`CyberNetrunner`, `PaladinKnight`, `SolarBotanist`, `ForestDruid`, `SamuraiRonin`, `CyberArchitect`).
* Action controls (`Strike`, `Ability`, `Focus`, `Clash`, `Victory`) with dynamic animations, floating damage numbers, and sound integration.

### Virtual City Grid & Realm Milestones (`CityPage.tsx`)
* Interactive isometric district grid (Residential, Commercial, Industrial, Tech Hub, Parks, Monuments).
* 5 progressive Realm Milestones per theme (e.g., *Outpost → Village → Citadel → Metropolis → Imperial Sanctum*).

### Production SEO & Accessibility
* Exact required H1 tag: `Turn Your Real Life Into a City-Building RPG`.
* Schema.org `SoftwareApplication` JSON-LD structured data.
* Open Graph tags, Twitter card meta, canonical links, `robots.txt`, and `sitemap.xml`.
* Responsive across mobile (375px), tablet (768px), and desktop (1024px+).

---

## 5. Technology Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Router v7, Canvas Confetti.
* **Backend**: Node.js, Express, TypeScript, bcryptjs, jsonwebtoken, cors.
* **Database**: PostgreSQL with dual-driver support:
  * `pg` for standard PostgreSQL (AWS RDS, Supabase, Neon, local Docker).
  * `@electric-sql/pglite` for zero-configuration, in-process persistent embedded PostgreSQL.
* **Audio**: Procedural Web Audio API sound synthesis.

---

## 6. Getting Started & Verification

### Prerequisites
* Node.js v18+ (tested on Node v24.13.0)
* npm v9+

### Running the Automated Test Suite
```bash
# Run backend test suite (covering leveling, streaks, attributes, isolation, transactions, and theme level locks)
npm --prefix backend test
```

### Starting the Application

1. **Start the Backend API (Port 5000)**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Client (Port 5173)**:
   ```bash
   cd frontend
   npm run dev
   ```

### Production Build
```bash
# Build backend
npm --prefix backend run build

# Build frontend
npm --prefix frontend run build
```

---

## 7. Verification Checklist

- [x] All 6 themes integrated with unique visual styles, terminologies, and audio tracks.
- [x] Level locks enforced on both client UI and server API (Theme A: Lvl 1, B: Lvl 2, C: Lvl 3, D: Lvl 4, E: Lvl 5, F: Lvl 6).
- [x] Server-authoritative PostgreSQL progression (no mock engine in production).
- [x] 8 automated backend unit & integration tests passing (100% pass rate).
- [x] TypeScript builds passing for both frontend and backend with 0 errors.
- [x] Full responsive design verified across mobile, tablet, and desktop viewports.
- [x] Production SEO complete (exact H1, JSON-LD, meta tags, robots.txt, sitemap.xml).
