export interface GeneratedQuest {
  title: string;
  description: string;
  category: 'coding' | 'study' | 'fitness' | 'wellness' | 'finance' | 'creative' | 'social';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  attribute_type: 'intellect' | 'strength' | 'creativity' | 'discipline';
  attribute_gain: number;
  xp_reward: number;
  gold_reward: number;
  boss_damage: number;
}

export interface GeneratedBoss {
  title: string;
  boss_type: 'mind_flayer' | 'demogorgon' | 'eldritch_lich' | 'gargoyle_king' | 'shadow_beast';
  description: string;
  max_hp: number;
}

export interface GeneratedCampaign {
  campaign: {
    title: string;
    description: string;
    real_life_goal: string;
  };
  boss: GeneratedBoss;
  quests: GeneratedQuest[];
}

/**
 * Procedural Quest Forge: Generates deterministic, high-flavor RPG campaigns
 * when AI API is unavailable, unconfigured, or times out.
 */
export function generateProceduralCampaign(goal: string): GeneratedCampaign {
  const cleanGoal = goal.trim();
  const lowerGoal = cleanGoal.toLowerCase();

  let category: GeneratedQuest['category'] = 'study';
  let attributeType: GeneratedQuest['attribute_type'] = 'intellect';
  let bossType: GeneratedBoss['boss_type'] = 'mind_flayer';
  let bossTitle = 'The Shadow Procrastinator';
  let campaignTitle = `Operation: ${cleanGoal.slice(0, 40)}`;

  if (
    lowerGoal.includes('code') ||
    lowerGoal.includes('dev') ||
    lowerGoal.includes('program') ||
    lowerGoal.includes('app') ||
    lowerGoal.includes('bug') ||
    lowerGoal.includes('sql') ||
    lowerGoal.includes('dbms') ||
    lowerGoal.includes('react') ||
    lowerGoal.includes('node')
  ) {
    category = 'coding';
    attributeType = 'intellect';
    bossType = 'mind_flayer';
    bossTitle = 'The Null Pointer Leviathan';
    campaignTitle = `Conquer the Code Citadel: ${cleanGoal.slice(0, 35)}`;
  } else if (
    lowerGoal.includes('gym') ||
    lowerGoal.includes('run') ||
    lowerGoal.includes('workout') ||
    lowerGoal.includes('diet') ||
    lowerGoal.includes('health') ||
    lowerGoal.includes('fitness') ||
    lowerGoal.includes('marathon')
  ) {
    category = 'fitness';
    attributeType = 'strength';
    bossType = 'demogorgon';
    bossTitle = 'The Demogorgon of Lethargy';
    campaignTitle = `Trials of the Iron Crucible: ${cleanGoal.slice(0, 35)}`;
  } else if (
    lowerGoal.includes('money') ||
    lowerGoal.includes('finance') ||
    lowerGoal.includes('budget') ||
    lowerGoal.includes('invest') ||
    lowerGoal.includes('save')
  ) {
    category = 'finance';
    attributeType = 'discipline';
    bossType = 'gargoyle_king';
    bossTitle = 'The Usurer Gargoyle';
    campaignTitle = `Reclaiming the Treasury: ${cleanGoal.slice(0, 35)}`;
  } else if (
    lowerGoal.includes('write') ||
    lowerGoal.includes('art') ||
    lowerGoal.includes('design') ||
    lowerGoal.includes('draw') ||
    lowerGoal.includes('music')
  ) {
    category = 'creative';
    attributeType = 'creativity';
    bossType = 'eldritch_lich';
    bossTitle = 'The Creative Block Lich';
    campaignTitle = `Awakening the Muse: ${cleanGoal.slice(0, 35)}`;
  } else if (
    lowerGoal.includes('meditate') ||
    lowerGoal.includes('sleep') ||
    lowerGoal.includes('mental') ||
    lowerGoal.includes('relax') ||
    lowerGoal.includes('stress')
  ) {
    category = 'wellness';
    attributeType = 'discipline';
    bossType = 'shadow_beast';
    bossTitle = 'The Nightmare Specter';
    campaignTitle = `Sanctuary of the Mind: ${cleanGoal.slice(0, 35)}`;
  } else {
    // General / Study
    category = 'study';
    attributeType = 'intellect';
    bossType = 'eldritch_lich';
    bossTitle = 'The Arch-Specter of Inertia';
    campaignTitle = `The Grand Scholarly Quest: ${cleanGoal.slice(0, 35)}`;
  }

  return {
    campaign: {
      title: campaignTitle,
      description: `A disciplined campaign forged to conquer "${cleanGoal}" and expand your city's dominion.`,
      real_life_goal: cleanGoal,
    },
    boss: {
      title: bossTitle,
      boss_type: bossType,
      description: `A formidable manifestation of distraction standing between you and "${cleanGoal}". Each completed quest delivers a crushing strike to its vitality.`,
      max_hp: 450,
    },
    quests: [
      {
        title: `Phase 1: Foundation & Reconnaissance`,
        description: `Dedicate 25 minutes of deep focus to outline resources and establish milestones for: ${cleanGoal}.`,
        category,
        difficulty: 'easy',
        attribute_type: attributeType,
        attribute_gain: 5,
        xp_reward: 50,
        gold_reward: 25,
        boss_damage: 75,
      },
      {
        title: `Phase 2: Deep Work Incursion`,
        description: `Execute a 50-minute focused sprint solving core challenges of: ${cleanGoal}.`,
        category,
        difficulty: 'medium',
        attribute_type: attributeType,
        attribute_gain: 10,
        xp_reward: 100,
        gold_reward: 50,
        boss_damage: 125,
      },
      {
        title: `Phase 3: Tactical Execution & Mastery`,
        description: `Tackle the most demanding component of: ${cleanGoal} with zero distractions.`,
        category,
        difficulty: 'hard',
        attribute_type: attributeType,
        attribute_gain: 15,
        xp_reward: 175,
        gold_reward: 90,
        boss_damage: 175,
      },
      {
        title: `Phase 4: Synthesis & Physical Conditioning`,
        description: `Review your outputs, document key learnings, and complete a 20-minute physical reset.`,
        category: 'fitness',
        difficulty: 'easy',
        attribute_type: 'strength',
        attribute_gain: 5,
        xp_reward: 50,
        gold_reward: 30,
        boss_damage: 75,
      },
    ],
  };
}

/**
 * Main AI Quest Master Generator
 * Queries Gemini API if key is set, otherwise smoothly falls back to procedural forge.
 */
export async function generateAIQuestCampaign(goal: string): Promise<GeneratedCampaign> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.log('[AI Quest Master] No API key detected. Using procedural RPG forge.');
    return generateProceduralCampaign(goal);
  }

  try {
    const prompt = `You are the AI Quest Master for "Life RPG", an epic productivity RPG.
A user has set this real-life goal: "${goal}"

You must design an RPG campaign with 3 to 5 realistic quests and a formidable Nemesis Boss.
Rules:
- Quests must represent realistic, actionable sub-tasks directly helping them achieve the goal.
- Return ONLY a valid JSON object with:
{
  "campaign": { "title": string, "description": string },
  "boss": { "title": string, "boss_type": "mind_flayer" | "demogorgon" | "eldritch_lich" | "gargoyle_king" | "shadow_beast", "description": string, "max_hp": number between 300 and 600 },
  "quests": [
    {
      "title": string,
      "description": string,
      "category": "coding" | "study" | "fitness" | "wellness" | "finance" | "creative" | "social",
      "difficulty": "easy" | "medium" | "hard" | "epic",
      "attribute_type": "intellect" | "strength" | "creativity" | "discipline"
    }
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      console.warn(`[AI Quest Master] Gemini API error: ${response.statusText}. Falling back.`);
      return generateProceduralCampaign(goal);
    }

    const data = (await response.json()) as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return generateProceduralCampaign(goal);
    }

    const parsed = JSON.parse(rawText);
    const difficultyRewards: Record<string, { xp: number; gold: number; bossDamage: number; attrGain: number }> = {
      easy: { xp: 50, gold: 25, bossDamage: 75, attrGain: 5 },
      medium: { xp: 100, gold: 50, bossDamage: 125, attrGain: 10 },
      hard: { xp: 175, gold: 90, bossDamage: 175, attrGain: 15 },
      epic: { xp: 300, gold: 150, bossDamage: 250, attrGain: 25 },
    };

    const quests: GeneratedQuest[] = (parsed.quests || []).map((q: any) => {
      const diff = q.difficulty || 'medium';
      const rewards = difficultyRewards[diff] || difficultyRewards.medium;
      return {
        title: q.title || 'Focus Sprint',
        description: q.description || 'Complete this task.',
        category: q.category || 'study',
        difficulty: diff,
        attribute_type: q.attribute_type || 'intellect',
        attribute_gain: rewards.attrGain,
        xp_reward: rewards.xp,
        gold_reward: rewards.gold,
        boss_damage: rewards.bossDamage,
      };
    });

    return {
      campaign: {
        title: parsed.campaign?.title || `Operation: ${goal.slice(0, 30)}`,
        description: parsed.campaign?.description || `Campaign for ${goal}`,
        real_life_goal: goal,
      },
      boss: {
        title: parsed.boss?.title || 'The Dread Procrastinator',
        boss_type: parsed.boss?.boss_type || 'mind_flayer',
        description: parsed.boss?.description || 'A fearsome foe born from delay.',
        max_hp: parsed.boss?.max_hp || 450,
      },
      quests: quests.length > 0 ? quests : generateProceduralCampaign(goal).quests,
    };
  } catch (err) {
    console.warn('[AI Quest Master] Error querying LLM. Falling back to procedural forge:', err);
    return generateProceduralCampaign(goal);
  }
}
