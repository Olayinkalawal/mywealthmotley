// ── Learning Paths & Education Content ──────────────────────────────

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "article" | "video";
  isLocked: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "basics",
    title: "Money Basics",
    description: "Start here if you're new to managing money",
    icon: "book-open",
    color: "#5C3D2E",
    lessons: [
      {
        id: "budgeting-101",
        title: "Budgeting 101: Give Every Naira a Job",
        duration: "5 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "savings-emergency",
        title: "Why You Need an Emergency Fund",
        duration: "4 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "debt-management",
        title: "Managing Debt Without Losing Sleep",
        duration: "6 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "50-30-20",
        title: "The 50/30/20 Rule (Nigerian Edition)",
        duration: "5 min",
        type: "article",
        isLocked: false,
      },
    ],
  },
  {
    id: "investing",
    title: "Investing for Beginners",
    description: "Learn how money grows",
    icon: "trending-up",
    color: "#E8614D",
    lessons: [
      {
        id: "what-is-etf",
        title: "What is an ETF? (The Jollof Rice Explanation)",
        duration: "5 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "compound-interest",
        title: "Compound Interest: Your Money's Best Friend",
        duration: "4 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "dollar-cost-averaging",
        title: "Dollar Cost Averaging: The Patient Person's Strategy",
        duration: "6 min",
        type: "article",
        isLocked: true,
      },
      {
        id: "risk-tolerance",
        title: "Understanding Risk (Without Losing Sleep)",
        duration: "5 min",
        type: "article",
        isLocked: true,
      },
    ],
  },
  {
    id: "diaspora",
    title: "Diaspora Money Moves",
    description: "Managing finances across borders",
    icon: "globe",
    color: "#D4A843",
    lessons: [
      {
        id: "remittance-101",
        title: "Sending Money Home: A Smart Guide",
        duration: "6 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "multi-currency",
        title: "Managing Money in Multiple Currencies",
        duration: "5 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "uk-isa",
        title: "ISAs Explained (For Nigerians in the UK)",
        duration: "7 min",
        type: "article",
        isLocked: true,
      },
      {
        id: "us-401k",
        title: "401k and Pensions (For Nigerians in the US)",
        duration: "7 min",
        type: "article",
        isLocked: true,
      },
    ],
  },
  {
    id: "japa",
    title: "Japa Finance",
    description: "Financial planning for relocation",
    icon: "plane",
    color: "#5B9A6D",
    lessons: [
      {
        id: "japa-cost-breakdown",
        title: "The Real Cost of Japa (Country by Country)",
        duration: "8 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "proof-of-funds",
        title: "Proof of Funds: What You Actually Need",
        duration: "5 min",
        type: "article",
        isLocked: false,
      },
      {
        id: "first-3-months",
        title: "Surviving Your First 3 Months Abroad",
        duration: "6 min",
        type: "article",
        isLocked: true,
      },
      {
        id: "reverse-japa",
        title: "Planning to Move Back? Here's the Math",
        duration: "5 min",
        type: "article",
        isLocked: true,
      },
    ],
  },
];

export const DAILY_TIP = {
  title: "Today's Money Tip",
  content:
    "The 24-hour rule: Before any purchase over \u20A610,000, wait 24 hours. If you still want it tomorrow, buy it. You'll be surprised how many 'must-haves' become 'meh' overnight.",
  author: "Sholz",
};
