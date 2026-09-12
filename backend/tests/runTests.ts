import assert from 'node:assert';
import { db } from '../src/db/index.js';
import { seedDatabase } from '../src/db/seed.js';
import { AuthService } from '../src/services/authService.js';
import { RpgEngine } from '../src/services/rpgEngine.js';
import { ThemeController } from '../src/controllers/themeController.js';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    process.stdout.write(`  [TEST] ${name}... `);
    await fn();
    console.log('✅ PASS');
    passed++;
  } catch (err: any) {
    console.log('❌ FAIL');
    console.error('    Error:', err.message || err);
    failed++;
  }
}

async function runAllTests() {
  console.log('\n========================================');
  console.log('  RUNNING LIFE RPG CORE BACKEND TESTS   ');
  console.log('========================================\n');

  await db.init();
  await seedDatabase();

  // Test 1: Nonlinear leveling formula
  await test('Deterministic nonlinear required XP formula', async () => {
    const lvl1XP = RpgEngine.getRequiredXP(1);
    const lvl2XP = RpgEngine.getRequiredXP(2);
    const lvl3XP = RpgEngine.getRequiredXP(3);

    assert.strictEqual(lvl1XP, 100, 'Level 1 required XP should be 100');
    assert.strictEqual(lvl2XP, 125, 'Level 2 required XP should be 125');
    assert.strictEqual(lvl3XP, 156, 'Level 3 required XP should be 156');

    // Test multi-level overflow
    const prog = RpgEngine.calculateLevelProgression(1, 0, 300);
    // 300 XP starting at lvl 1:
    // lvl 1 (100 xp) -> 200 left -> lvl 2 (125 xp) -> 75 left -> lvl 3 (needs 156 xp).
    assert.strictEqual(prog.level, 3, 'Level should reach 3 after 300 XP');
    assert.strictEqual(prog.currentXP, 75, 'Current XP should be 75 overflow');
    assert.strictEqual(prog.requiredXP, 156, 'Required XP at lvl 3 should be 156');
    assert.strictEqual(prog.levelUp, true, 'levelUp should be true');
    assert.strictEqual(prog.levelsGained, 2, 'Should have gained 2 levels');
  });

  // Test 2: Streak calculation
  await test('Streak calculation logic', async () => {
    const now = new Date('2026-09-12T12:00:00Z');

    // Case 1: First time completion (lastCompletedDate is null)
    const s1 = RpgEngine.calculateStreak(0, null, now);
    assert.strictEqual(s1.newStreak, 1, 'First quest should set streak to 1');

    // Case 2: Same day completion
    const s2 = RpgEngine.calculateStreak(1, '2026-09-12T08:00:00Z', now);
    assert.strictEqual(s2.newStreak, 1, 'Same day should preserve current streak');
    assert.strictEqual(s2.isSameDay, true);

    // Case 3: Yesterday completion (consecutive)
    const s3 = RpgEngine.calculateStreak(2, '2026-09-11T20:00:00Z', now);
    assert.strictEqual(s3.newStreak, 3, 'Consecutive day should increment streak');
    assert.strictEqual(s3.isConsecutive, true);

    // Case 4: Broken streak (missed days)
    const s4 = RpgEngine.calculateStreak(5, '2026-09-08T10:00:00Z', now);
    assert.strictEqual(s4.newStreak, 1, 'Broken streak should reset to 1');
  });

  // Test 3: Attribute mapping
  await test('Data-driven attribute category mapping', async () => {
    assert.strictEqual(RpgEngine.getAttributeGain('coding', 'medium').attribute, 'intellect');
    assert.strictEqual(RpgEngine.getAttributeGain('study', 'medium').attribute, 'intellect');
    assert.strictEqual(RpgEngine.getAttributeGain('fitness', 'medium').attribute, 'strength');
    assert.strictEqual(RpgEngine.getAttributeGain('creative', 'medium').attribute, 'creativity');
    assert.strictEqual(RpgEngine.getAttributeGain('habit', 'medium').attribute, 'discipline');
    // Epic difficulty should yield 3 stat points
    assert.strictEqual(RpgEngine.getAttributeGain('fitness', 'epic').gain, 3);
  });

  // Test 4: Password Hashing & Verification
  await test('AuthService password hashing and verification', async () => {
    const rawPass = 'SecretQuest123!';
    const hash = await AuthService.hashPassword(rawPass);
    assert.notStrictEqual(rawPass, hash, 'Hash must not match raw password');
    assert.strictEqual(await AuthService.comparePassword(rawPass, hash), true);
    assert.strictEqual(await AuthService.comparePassword('WrongPassword', hash), false);
  });

  // Test 5: End-to-end Database & User Isolation
  let userAId = 0;
  let userBId = 0;
  let userAQuestId = 0;

  await test('User creation and starter character initialization', async () => {
    const emailA = `hero_a_${Date.now()}@liferpg.io`;
    const passHashA = await AuthService.hashPassword('pass1234');
    const uA = await db.query(
      'INSERT INTO users (email, password_hash, theme) VALUES ($1, $2, $3) RETURNING id',
      [emailA, passHashA, 'theme-a']
    );
    userAId = uA.rows[0].id;

    await db.query(
      `INSERT INTO characters (user_id, name, title, level, current_xp, gold, streak_count, intellect, strength, creativity, discipline)
       VALUES ($1, 'CyberRonin', 'Novice Adventurer', 1, 0, 50, 0, 10, 10, 10, 10)`,
      [userAId]
    );

    const emailB = `hero_b_${Date.now()}@liferpg.io`;
    const passHashB = await AuthService.hashPassword('pass5678');
    const uB = await db.query(
      'INSERT INTO users (email, password_hash, theme) VALUES ($1, $2, $3) RETURNING id',
      [emailB, passHashB, 'theme-b']
    );
    userBId = uB.rows[0].id;

    await db.query(
      `INSERT INTO characters (user_id, name, title, level, current_xp, gold, streak_count, intellect, strength, creativity, discipline)
       VALUES ($1, 'PaladinArthur', 'Novice Adventurer', 1, 0, 50, 0, 10, 10, 10, 10)`,
      [userBId]
    );

    assert.ok(userAId > 0 && userBId > 0, 'Users successfully created in DB');
  });

  await test('Quest creation and strict user isolation', async () => {
    // Create quest for User A
    const qRes = await db.query(
      `INSERT INTO quests (user_id, title, category, difficulty, xp_reward, gold_reward)
       VALUES ($1, 'Write High Performance Query', 'coding', 'hard', 200, 100)
       RETURNING id`,
      [userAId]
    );
    userAQuestId = qRes.rows[0].id;

    // User A can see their own quest
    const userAQuests = await db.query('SELECT * FROM quests WHERE user_id = $1', [userAId]);
    assert.strictEqual(userAQuests.rows.length, 1);

    // User B CANNOT see User A's quest
    const userBQuests = await db.query('SELECT * FROM quests WHERE user_id = $1', [userBId]);
    assert.strictEqual(userBQuests.rows.length, 0, 'User B must have 0 quests');

    // User B attempting to complete User A's quest must be rejected
    await assert.rejects(
      async () => {
        await db.withTransaction(async (txClient) => {
          await RpgEngine.completeQuest(txClient, userBId, userAQuestId);
        });
      },
      /unauthorized|not found/i,
      'User B completing User A quest must throw unauthorized error'
    );
  });

  await test('Atomic quest completion, rewards, and progression', async () => {
    const completionResult = await db.withTransaction(async (txClient) => {
      return await RpgEngine.completeQuest(txClient, userAId, userAQuestId);
    });

    assert.strictEqual(completionResult.quest.is_completed, true);
    assert.ok(completionResult.rewards.xp >= 200, 'Should earn at least 200 XP');
    assert.ok(completionResult.rewards.gold >= 100, 'Should earn at least 100 Gold');
    assert.strictEqual(completionResult.character.intellect, 12, 'Intellect should gain +2 for hard coding quest');
    assert.strictEqual(completionResult.character.streak_count, 1, 'Streak should be 1');

    // Verify double completion prevention
    await assert.rejects(
      async () => {
        await db.withTransaction(async (txClient) => {
          await RpgEngine.completeQuest(txClient, userAId, userAQuestId);
        });
      },
      /already completed/i,
      'Completing already completed quest must throw duplicate error'
    );

    // Verify XP transactions logged
    const txLog = await db.query('SELECT * FROM xp_transactions WHERE user_id = $1', [userAId]);
    assert.ok(txLog.rows.length >= 2, 'Both XP and Gold transactions must be logged in database');
  });

  await test('Theme persistence and level lock validation', async () => {
    // User A earned XP in previous test and reached level 2
    const char = await db.query('SELECT level FROM characters WHERE user_id = $1', [userAId]);
    assert.strictEqual(char.rows[0].level, 2, 'User A should be level 2 after quest completion');

    // Helper to simulate Express request/response
    const mockReqRes = (userId: number, theme: string) => {
      let code = 200;
      let body: any = null;
      const req: any = { user: { id: userId }, body: { theme } };
      const res: any = {
        status(c: number) {
          code = c;
          return this;
        },
        json(b: any) {
          body = b;
          return this;
        },
      };
      return { req, res, getStatus: () => code, getBody: () => body };
    };

    // 1. Setting Theme B (Level 2) should SUCCEED for Level 2 character
    const callB = mockReqRes(userAId, 'theme-b');
    await ThemeController.updateTheme(callB.req, callB.res);
    assert.strictEqual(callB.getStatus(), 200, 'Theme B should succeed at Level 2');
    assert.strictEqual(callB.getBody().success, true);
    assert.strictEqual(callB.getBody().theme, 'theme-b');

    // 2. Setting Theme C (Level 3) should FAIL with 403 Forbidden for Level 2 character
    const callC = mockReqRes(userAId, 'theme-c');
    await ThemeController.updateTheme(callC.req, callC.res);
    assert.strictEqual(callC.getStatus(), 403, 'Theme C must return 403 when user is Level 2');
    assert.strictEqual(callC.getBody().success, false);
    assert.ok(callC.getBody().error.includes('Theme locked!'), 'Error should state Theme locked');

    // 3. Setting Theme F (Level 6) should also FAIL with 403 Forbidden
    const callF = mockReqRes(userAId, 'theme-f');
    await ThemeController.updateTheme(callF.req, callF.res);
    assert.strictEqual(callF.getStatus(), 403, 'Theme F must return 403 when user is Level 2');
    assert.strictEqual(callF.getBody().success, false);

    // 4. Level up character to Level 6 and verify Theme F now SUCCEEDS
    await db.query('UPDATE characters SET level = 6 WHERE user_id = $1', [userAId]);
    const callFUnlocked = mockReqRes(userAId, 'theme-f');
    await ThemeController.updateTheme(callFUnlocked.req, callFUnlocked.res);
    assert.strictEqual(callFUnlocked.getStatus(), 200, 'Theme F must succeed once character reaches Level 6');
    assert.strictEqual(callFUnlocked.getBody().theme, 'theme-f');

    // Restore character level to 2
    await db.query('UPDATE characters SET level = 2 WHERE user_id = $1', [userAId]);
  });

  console.log('\n========================================');
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
