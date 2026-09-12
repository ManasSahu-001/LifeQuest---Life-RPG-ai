# Life RPG — Master Gamified Productivity & City-Building RPG

> **Unified Production Release**: Complete full-stack monorepo integrating Core Backend, Server-Authoritative Progression Engine, 8 Level-Locked Visual Realms, AI Quest Master with Nemesis Boss Battles, 7-District City Builder, Treasury Shop, Animated Character Rigs & Sprites, and Zero-Asset Procedural Web Audio Engine.

Turn your real-life goals and daily tasks into an epic RPG. Complete quests, earn XP, build your virtual metropolis, maintain streaks, and level up to unlock new interdimensional realms!

---

## 1. Product Architecture

The application is structured as a unified, high-performance monorepo with strict separation of concerns and server-authoritative trust:

```text
React 19 + TypeScript + Tailwind CSS Frontend (Vite)
      ↓
Theme Engine (8 Immersive Level-Locked Realms: Themes A through H)
      ↓
Audio Synthesizer Engine (Web Audio API Procedural BGM + Combat SFX)
      ↓
Interactive Character Stage (8 Visual Avatar Rigs & WalkingHeroSprite)
      ↓
AI Quest Master (Real-world ambition synthesis + Nemesis Boss generation)
      ↓
Metropolitan City Canvas (7 Interactive Urban Districts & Building Construction)
      ↓
Shared API Service (Axios Client with JWT Interceptors)
      ↓
ONE Unified Backend (Node.js + Express + TypeScript)
      ↓
PostgreSQL Dual-Driver Persistence (Embedded PGlite + Remote pg)
```

---

## 2. Eight Level-Locked Visual Realms

Every theme is an immersive realm featuring unique typography, color palettes, custom particle systems, soundscapes, character rigs, and boss encounters:

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
- The Theme Matrix modal (`ThemeSelector.tsx`) visually displays locks, level requirements, and provides audio-tactile feedback.

---

## 3. Server-Authoritative RPG Progression Engine

The client **never** computes or trusts XP, Gold, Level, Attributes, Streaks, or Boss damage. All state transitions occur within atomic ACID database transactions on the server:

1. **Nonlinear Leveling Formula**:
   $$\text{requiredXP}(\text{level}) = \lfloor \text{baseXP} \times \text{growthFactor}^{(\text{level} - 1)} \rfloor$$
   With $\text{baseXP} = 100$ and $\text{growthFactor} = 1.25$. Surplus XP overflows deterministically across multiple levels.

2. **Core RPG & Department Attributes**:
   - `intellect` / `tech_xp`: Boosted by Coding & Technical quests
   - `strength` / `strength_xp`: Boosted by Fitness & Physical quests
   - `creativity` / `culture_xp`: Boosted by Creative & Design quests
   - `discipline` / `knowledge_xp`: Boosted by Study, Finance, and Habit quests

3. **Streak Multiplier System**:
   - 1-2 Days: Base Rewards
   - 3-6 Days: **+20% Bonus XP & Gold**
   - 7-13 Days: **+50% Bonus XP & Gold**
   - 14+ Days: **+100% Double Rewards**

---

## 4. AI Quest Master & Nemesis Boss Battles

Input any real-world goal (e.g., *"Prepare for my DBMS semester exam in 2 weeks"*):
- The **AI Quest Master** synthesizes a structured, phased quest chain.
- Spawns a towering **Nemesis Boss** (e.g. *The Mind Flayer*, *Demogorgon*, *Eldritch Lich*).
- Completing campaign quests inflicts calculated damage directly to the Nemesis Boss's HP, complete with shake animations, floating damage numbers, and victory spoils!
- Includes intelligent **Procedural RPG Forge** that runs offline with zero API key configuration needed.

---

## 5. Metropolitan City Builder

- **7 Interactive Districts**: Technology, Knowledge, Strength & Defense, Sanctuary of Wellness, Treasury & Commerce, Cultural Arts, and Community Plaza.
- **Constructible Buildings**: Construct structures (AV Club Radio Tower, Hawkins Energy Lab, Public Archives, Iron Crucible Gym, etc.) using earned gold.
- **Population Simulation**: Your city population expands dynamically as you level up, maintain streaks, and erect new district structures.

---

## 6. City Treasury & Economy

- **Treasury Exchange**: Spend earned Gold on Realm Licenses, Guild Badges (Hellfire Club Master Pin, Grand Necromancer Sigil), and Relics (Chrono Focus Crystal, Cyber Netrunner Deck).
- **Equipable Inventory**: Equip items to customize your character profile and active avatar rig.

---

## 7. Interactive Character Stage & Walking Hero Sprite

- **8 Hand-Crafted Visual Avatar Rigs**: `CyberNetrunner`, `PaladinKnight`, `SolarBotanist`, `ForestDruid`, `SamuraiRonin`, `CyberArchitect`, `EldritchSorcerer`, and `ShadowWalker`.
- **Framer-Motion Animated Walking Hero Sprite**: Pixel-art walking sprite on the **Journey Roadmap** navigating across all 8 progressive waypoints.
- **5 Action States**: Idle, Attack, Celebrate (with Confetti), Hit (with screen shake and damage vignette), and Meditate.

---

## 8. Web Audio Procedural Synthesizer

- Zero external MP3/WAV files required: 100% procedurally synthesized in the browser via Web Audio API.
- Dynamic mastering limiter & dynamics compressor for loud, punchy audio on any speakers.
- Complete sound effects: Click, Attack strike, Boss hit, Quest Complete chime, Level-Up fanfare, and Item Purchase.
- Volume slider and master mute toggle built into the navigation bar.

---

## 9. Quickstart Guide

### Prerequisites
- Node.js 18+ installed on your machine.

### Installation & Execution
From the project root:

```bash
# Run both Backend and Frontend in development mode:
npm run dev:all

# Or run separately:
npm run dev:backend   # Starts backend on http://localhost:5000
npm run dev:frontend  # Starts frontend on http://localhost:5173
```

### Building for Production
```bash
# Builds both backend and frontend with zero errors:
npm run build
```

### Running Tests
```bash
# Runs backend tests verifying DB, auth, quests, progression, and level locks:
npm run test
```

### Dual Database Options
1. **Embedded Zero-Config (Default)**: Uses `@electric-sql/pglite` running locally in WebAssembly with persistent file storage in `backend/data/rpg-pglite`. No PostgreSQL installation required!
2. **Remote PostgreSQL**: Set `DATABASE_URL=postgresql://user:pass@localhost:5432/liferpg` in `backend/.env` to connect to any standard PostgreSQL server.

---

**Built with pride for high performance, zero procrastination, and epic gamified productivity.**
