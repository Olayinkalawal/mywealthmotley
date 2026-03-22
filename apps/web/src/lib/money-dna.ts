// ── Money DNA Archetypes ────────────────────────────────────────────
// A personality quiz + spending analysis that assigns users a
// Nigerian-flavored financial archetype.

export interface MoneyDnaArchetype {
  id: string;
  name: string;
  iconName: string;
  tagline: string;
  description: string;
  strengths: string[];
  watchOuts: string[];
  tips: string[];
  color: string;
  gradient: string;
  shareText: string;
}

export const MONEY_DNA_ARCHETYPES: MoneyDnaArchetype[] = [
  {
    id: "generous-hustler",
    name: "The Generous Hustler",
    iconName: "Heart",
    tagline: "Your heart is gold, but your wallet needs boundaries.",
    description:
      "You earn well and give generously to family and friends, sometimes at your own expense. " +
      "Your generosity is a superpower, but without guardrails it can quietly drain your future.",
    strengths: [
      "Strong income generation and multiple hustle energy",
      "Deep loyalty to family and community",
      "Natural ability to make money flow",
    ],
    watchOuts: [
      "Giving until your own savings suffer",
      "Difficulty saying no to financial requests",
      "No clear boundary between family money and personal goals",
    ],
    tips: [
      "Set a fixed monthly 'giving budget' and stick to it",
      "Automate savings before anyone can ask for it",
      "Learn to say 'I've budgeted for this month already'",
    ],
    color: "#D4A843",
    gradient: "from-amber-500/80 via-yellow-600/60 to-orange-700/80",
    shareText:
      "I'm The Generous Hustler! My heart is gold, but my wallet needs boundaries. Discover your Money DNA at wealthmotley.com",
  },
  {
    id: "cautious-dreamer",
    name: "The Cautious Dreamer",
    iconName: "CloudMoon",
    tagline: "You're sitting on potential. Let's put that money to work.",
    description:
      "You save diligently but you're afraid to invest. Your bank account is healthy, " +
      "but inflation is quietly eating your purchasing power. The dream is there; the action is next.",
    strengths: [
      "Excellent savings discipline and consistency",
      "Risk-aware and thoughtful with money",
      "Strong financial foundation to build on",
    ],
    watchOuts: [
      "Analysis paralysis keeps you from investing",
      "Inflation silently erodes your savings",
      "Fear of loss outweighs potential for growth",
    ],
    tips: [
      "Start with low-risk investments like money market funds",
      "Invest small amounts monthly to build confidence",
      "Remember: not investing is also a risk (inflation)",
    ],
    color: "#5B9A6D",
    gradient: "from-emerald-500/80 via-green-600/60 to-teal-700/80",
    shareText:
      "I'm The Cautious Dreamer! I'm sitting on potential. Time to put that money to work. Discover your Money DNA at wealthmotley.com",
  },
  {
    id: "social-spender",
    name: "The Social Spender",
    iconName: "Confetti",
    tagline: "Your social life is thriving, but is your savings?",
    description:
      "Owambe king or queen! Social spending is your love language. Aso ebi, small chops, " +
      "weekend trips - you never miss. Your network is rich, but your net worth needs attention.",
    strengths: [
      "Incredible social network and community ties",
      "Generous spirit that attracts opportunities",
      "Life experiences that money can't fully measure",
    ],
    watchOuts: [
      "Social pressure drives spending beyond your means",
      "FOMO makes every event feel like a must-attend",
      "Savings consistently take a back seat to experiences",
    ],
    tips: [
      "Create an 'Owambe Fund' with a monthly cap",
      "Practice the 24-hour rule before social spending",
      "For every event you attend, save the same amount",
    ],
    color: "#EC4899",
    gradient: "from-pink-500/80 via-rose-600/60 to-fuchsia-700/80",
    shareText:
      "I'm The Social Spender! My social life is thriving, but my savings need attention. Discover your Money DNA at wealthmotley.com",
  },
  {
    id: "silent-builder",
    name: "The Silent Builder",
    iconName: "Wrench",
    tagline: "You're making money moves, but are you seeing the full picture?",
    description:
      "Multiple hustle streams, no tracking. You're building something real but flying blind. " +
      "The money comes in from different sources, but without a dashboard you can't optimize.",
    strengths: [
      "Diversified income across multiple streams",
      "Entrepreneurial mindset and execution ability",
      "Self-reliant and resourceful money maker",
    ],
    watchOuts: [
      "No clear picture of total income or net worth",
      "Money leaks go unnoticed across accounts",
      "Tax and compliance blind spots from informal income",
    ],
    tips: [
      "Consolidate all accounts into one dashboard (like WealthMotley!)",
      "Track every income stream, no matter how small",
      "Set aside 20% of side hustle income before spending",
    ],
    color: "#8B6B5A",
    gradient: "from-amber-700/80 via-stone-600/60 to-amber-900/80",
    shareText:
      "I'm The Silent Builder! Multiple hustles, now I need the full picture. Discover your Money DNA at wealthmotley.com",
  },
  {
    id: "first-gen-warrior",
    name: "The First-Gen Warrior",
    iconName: "Shield",
    tagline:
      "You carry the weight of a generation. Let's make sure you don't break.",
    description:
      "Supporting family while building from zero. You're the first in your family to reach this level, " +
      "and everyone is counting on you. The pressure is real, but so is your potential.",
    strengths: [
      "Incredible resilience and determination",
      "Strong sense of purpose and family duty",
      "Ability to build wealth from nothing",
    ],
    watchOuts: [
      "Carrying too much financial responsibility alone",
      "Guilt-driven spending that derails personal goals",
      "Burnout from being everyone's financial lifeline",
    ],
    tips: [
      "Pay yourself first - even warriors need armor",
      "Set boundaries with love: 'I'm building for all of us'",
      "Build an emergency fund before increasing family support",
    ],
    color: "#E8614D",
    gradient: "from-red-500/80 via-orange-600/60 to-red-700/80",
    shareText:
      "I'm The First-Gen Warrior! I carry the weight of a generation. Discover your Money DNA at wealthmotley.com",
  },
  {
    id: "pepper-dem-investor",
    name: "The Pepper Dem Investor",
    iconName: "Rocket",
    tagline: "Ambition is your superpower. Strategy is your next level.",
    description:
      "Competitive, wants high returns, attracted to risk. You've heard about every hot investment " +
      "from crypto to forex to real estate. Your ambition is unmatched - now you need a strategy to match.",
    strengths: [
      "Bold and willing to take calculated risks",
      "Always learning about new investment opportunities",
      "Competitive drive that pushes for growth",
    ],
    watchOuts: [
      "Chasing 'hot tips' without proper research",
      "FOMO investing based on what others are making",
      "Overconfidence can lead to concentrated bets",
    ],
    tips: [
      "Diversify: never put more than 10% in any single bet",
      "If it sounds too good to be true, it probably is",
      "Build a boring core portfolio, then use 10% for high-risk plays",
    ],
    color: "#E5930C",
    gradient: "from-orange-500/80 via-amber-600/60 to-orange-700/80",
    shareText:
      "I'm The Pepper Dem Investor! Ambition is my superpower. Strategy is my next level. Discover your Money DNA at wealthmotley.com",
  },
];

// ── Quiz Questions ──────────────────────────────────────────────────

export interface QuizOption {
  id: string;
  text: string;
  iconName: string;
  /** Maps to archetype IDs with weights */
  scores: Record<string, number>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const MONEY_DNA_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Payday just hit. What's your first move?",
    options: [
      {
        id: "1a",
        text: "Pay bills immediately",
        iconName: "ClipboardText",
        scores: { "cautious-dreamer": 2, "first-gen-warrior": 1 },
      },
      {
        id: "1b",
        text: "Transfer to savings",
        iconName: "Bank",
        scores: { "cautious-dreamer": 2, "silent-builder": 1 },
      },
      {
        id: "1c",
        text: "Treat yourself first",
        iconName: "Confetti",
        scores: { "social-spender": 2, "pepper-dem-investor": 1 },
      },
      {
        id: "1d",
        text: "Send money to family",
        iconName: "UsersThree",
        scores: { "generous-hustler": 2, "first-gen-warrior": 2 },
      },
    ],
  },
  {
    id: 2,
    question: "A friend asks to borrow \u20A650,000. You...",
    options: [
      {
        id: "2a",
        text: "Send it without thinking twice",
        iconName: "CurrencyCircleDollar",
        scores: { "generous-hustler": 2, "social-spender": 1 },
      },
      {
        id: "2b",
        text: "Check your budget first, then decide",
        iconName: "ChartBar",
        scores: { "cautious-dreamer": 2, "silent-builder": 1 },
      },
      {
        id: "2c",
        text: "Say yes but secretly stress about it",
        iconName: "SmileyNervous",
        scores: { "first-gen-warrior": 2, "generous-hustler": 1 },
      },
      {
        id: "2d",
        text: "Politely decline - your money is working for you",
        iconName: "HandPalm",
        scores: { "pepper-dem-investor": 2, "silent-builder": 1 },
      },
    ],
  },
  {
    id: 3,
    question: "Your investment is down 15%. You...",
    options: [
      {
        id: "3a",
        text: "Panic and sell everything",
        iconName: "Warning",
        scores: { "cautious-dreamer": 2, "social-spender": 1 },
      },
      {
        id: "3b",
        text: "Buy more - it's on discount!",
        iconName: "TrendUp",
        scores: { "pepper-dem-investor": 2, "silent-builder": 1 },
      },
      {
        id: "3c",
        text: "Wait, I have investments?",
        iconName: "Question",
        scores: { "silent-builder": 2, "generous-hustler": 1 },
      },
      {
        id: "3d",
        text: "Hold steady and check back next month",
        iconName: "Hourglass",
        scores: { "first-gen-warrior": 1, "cautious-dreamer": 1 },
      },
    ],
  },
  {
    id: 4,
    question: "Owambe season is here. Your budget...",
    options: [
      {
        id: "4a",
        text: "What budget? I'm buying all the aso ebi!",
        iconName: "ShoppingBag",
        scores: { "social-spender": 2, "generous-hustler": 1 },
      },
      {
        id: "4b",
        text: "Pick 2 events max, skip the rest",
        iconName: "Notepad",
        scores: { "cautious-dreamer": 2, "first-gen-warrior": 1 },
      },
      {
        id: "4c",
        text: "I already set aside an 'Owambe Fund'",
        iconName: "PiggyBank",
        scores: { "silent-builder": 2, "cautious-dreamer": 1 },
      },
      {
        id: "4d",
        text: "I'll go but invest what I would've spent on aso ebi",
        iconName: "ChartLineUp",
        scores: { "pepper-dem-investor": 2, "silent-builder": 1 },
      },
    ],
  },
  {
    id: 5,
    question: "You get an unexpected \u20A6200,000. You...",
    options: [
      {
        id: "5a",
        text: "Send half to mum, save the rest",
        iconName: "Heart",
        scores: { "first-gen-warrior": 2, "generous-hustler": 2 },
      },
      {
        id: "5b",
        text: "Straight to savings - don't even look at it",
        iconName: "Lock",
        scores: { "cautious-dreamer": 2, "silent-builder": 1 },
      },
      {
        id: "5c",
        text: "Throw a small celebration, you deserve it",
        iconName: "Champagne",
        scores: { "social-spender": 2, "generous-hustler": 1 },
      },
      {
        id: "5d",
        text: "Put it all into that investment you've been eyeing",
        iconName: "Rocket",
        scores: { "pepper-dem-investor": 2, "silent-builder": 1 },
      },
    ],
  },
  {
    id: 6,
    question: "How do you feel checking your bank balance?",
    options: [
      {
        id: "6a",
        text: "Confident - I know exactly what's there",
        iconName: "Sunglasses",
        scores: { "silent-builder": 2, "pepper-dem-investor": 1 },
      },
      {
        id: "6b",
        text: "Anxious - I'd rather not look",
        iconName: "EyeSlash",
        scores: { "social-spender": 2, "first-gen-warrior": 1 },
      },
      {
        id: "6c",
        text: "Proud - my savings are growing",
        iconName: "SmileyWink",
        scores: { "cautious-dreamer": 2, "first-gen-warrior": 1 },
      },
      {
        id: "6d",
        text: "It depends on who asked me for money this week",
        iconName: "ChatDots",
        scores: { "generous-hustler": 2, "first-gen-warrior": 1 },
      },
    ],
  },
  {
    id: 7,
    question: "Your side hustle just paid. You...",
    options: [
      {
        id: "7a",
        text: "Reinvest it into the hustle to grow it",
        iconName: "ArrowsClockwise",
        scores: { "silent-builder": 2, "pepper-dem-investor": 1 },
      },
      {
        id: "7b",
        text: "Split between savings and a small treat",
        iconName: "Scales",
        scores: { "cautious-dreamer": 1, "social-spender": 1 },
      },
      {
        id: "7c",
        text: "Use it to help someone who needs it",
        iconName: "HandHeart",
        scores: { "generous-hustler": 2, "first-gen-warrior": 1 },
      },
      {
        id: "7d",
        text: "Throw it into a high-risk, high-reward play",
        iconName: "GameController",
        scores: { "pepper-dem-investor": 2 },
      },
    ],
  },
  {
    id: 8,
    question:
      "Someone tells you about a 'guaranteed' 50% return. You...",
    options: [
      {
        id: "8a",
        text: "I'm in! Where do I sign?",
        iconName: "PenNib",
        scores: { "pepper-dem-investor": 2, "social-spender": 1 },
      },
      {
        id: "8b",
        text: "Research it thoroughly before deciding",
        iconName: "MagnifyingGlass",
        scores: { "cautious-dreamer": 2, "silent-builder": 1 },
      },
      {
        id: "8c",
        text: "Run. Nothing is guaranteed in this life.",
        iconName: "PersonSimpleRun",
        scores: { "first-gen-warrior": 2, "cautious-dreamer": 1 },
      },
      {
        id: "8d",
        text: "Ask how I can help my friends get in too",
        iconName: "Megaphone",
        scores: { "generous-hustler": 2, "social-spender": 1 },
      },
    ],
  },
];

// ── Scoring logic ───────────────────────────────────────────────────

export function calculateMoneyDna(
  answers: Record<number, string>,
): MoneyDnaArchetype {
  const scores: Record<string, number> = {};

  // Initialize all archetype scores
  for (const archetype of MONEY_DNA_ARCHETYPES) {
    scores[archetype.id] = 0;
  }

  // Tally scores from answers
  for (const [questionIdStr, optionId] of Object.entries(answers)) {
    const questionId = parseInt(questionIdStr, 10);
    const question = MONEY_DNA_QUESTIONS.find((q) => q.id === questionId);
    if (!question) continue;

    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;

    for (const [archetypeId, weight] of Object.entries(option.scores)) {
      scores[archetypeId] = (scores[archetypeId] ?? 0) + weight;
    }
  }

  // Find the archetype with the highest score
  let maxScore = 0;
  let resultId = "generous-hustler";
  for (const [archetypeId, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      resultId = archetypeId;
    }
  }

  return (
    MONEY_DNA_ARCHETYPES.find((a) => a.id === resultId) ??
    MONEY_DNA_ARCHETYPES[0]!
  );
}

export function getArchetypeById(
  id: string,
): MoneyDnaArchetype | undefined {
  return MONEY_DNA_ARCHETYPES.find((a) => a.id === id);
}
