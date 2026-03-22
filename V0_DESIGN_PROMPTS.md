# WealthMotley — v0 Design Prompts

> **Brand**: WealthMotley — "The first AI-powered financial education companion built for Africans"
> **Palette**: Primary cocoa/chocolate brown (#5C3D2E), Secondary warm coral (#E8614D), Accent gold/amber (#D4A843), Background warm off-white (#FAF8F5), Dark mode inverts coral as primary
> **Fonts**: Satoshi (headlines), Plus Jakarta Sans (body)
> **Icons**: Phosphor Icons (duotone weight)
> **Stack**: Next.js 14 App Router + shadcn/ui + Tailwind CSS + Recharts
> **Audience**: African professionals at home + diaspora (Nigeria, UK, US, Canada, Germany, UAE, Ghana, Kenya, South Africa)
> **Vibe**: Warm, premium, distinctly African — NOT cold corporate Western fintech

---

## GLOBAL DESIGN RULES (paste before any prompt)

```
Design system context for all prompts:
- Use shadcn/ui components (Card, Button, Input, Select, Dialog, Sheet, Tabs, Progress, Skeleton, Badge, Avatar, Separator, Popover, Table)
- Primary color: cocoa brown (#5C3D2E), Secondary: warm coral (#E8614D), Accent: gold (#D4A843)
- Background: warm off-white (#FAF8F5), Card: white, Dark mode: #1A1A1A bg, #2D2D2D cards, coral becomes primary
- Headlines: font-family 'Satoshi', sans-serif — bold, geometric, personality
- Body: font-family 'Plus Jakarta Sans', sans-serif — clean, high legibility
- Border radius: rounded-xl for cards, rounded-lg for buttons, rounded-full for avatars
- Shadows: warm subtle shadows (not cold blue-grey ones)
- Animations: subtle Framer Motion fade-ins, NOT flashy
- Mobile-first responsive design
- Support light AND dark mode
- Icons: use Phosphor Icons style (duotone for features, bold for nav)
- This is an African fintech app — the design should feel warm, bold, and premium, not generic SaaS
```

---

## 1. LANDING PAGE

```
Create a premium fintech landing page for "WealthMotley" — the first AI-powered financial education companion built for Africans.

Hero section:
- Bold headline: "See ALL your money. In one place. Finally." with the word "ALL" having an animated gradient text effect (cocoa to coral)
- Subheadline: "Bank accounts, investments, pensions, crypto — connected across countries, converted to your currency"
- Two CTAs: "Join the Waitlist" (coral filled button) and "See How It Works" (cocoa outline button)
- Trust badges below: "Bank-level encryption" | "Read-only access" | "167K+ community"
- Right side: a floating dashboard mockup showing a net worth card with N12.4M, a donut chart, and asset cards — with a subtle parallax float animation
- Animated gradient background shifting between warm cocoa and coral tones

Features section (4 cards in a 2x2 grid):
- "All My Money Dashboard" — See everything you own across every platform. Gold "Most Popular" badge.
- "Smart Budget Tracker" — Nigerian categories: Jollof & Chops, Owambe, Black Tax
- "Japa Ready Score" — Know exactly when you can afford to relocate
- "AI Financial Coach" — Your personal finance companion that speaks your language

"Who We're For" section (3 persona cards):
- "The Diaspora Professional" — Managing money across two countries
- "The First-Gen Builder" — Supporting family, building wealth from zero
- "The Japa Planner" — Saving to relocate? Know exactly when you're ready

How It Works (3 numbered steps):
- Connect your bank (via Mono, 60 seconds)
- Add your investments (screenshot any app, AI imports it)
- See your complete financial picture

CTA section with cocoa background:
- "Join the waitlist — early members get lifetime premium pricing"
- Email input + country dropdown + Join button
- Live counter: "2,847 people already waiting"

Footer with links and financial disclaimer.

Color palette: cocoa brown (#5C3D2E) primary, coral (#E8614D) secondary, gold (#D4A843) accent, warm off-white (#FAF8F5) background.
```

---

## 2. SIGN IN / SIGN UP

```
Create a custom authentication page for a fintech app called "WealthMotley."

Layout: centered card on a full-page warm gradient background (cocoa to dark).

The card has a glassmorphism effect (backdrop-blur, slight transparency, subtle border).

Above the card: "WealthMotley" logo text in Satoshi font, bold.
Below the logo: tagline "Your money's personal trainer"

Sign-In card contents:
- "Welcome back" heading
- Google OAuth button (white bg, Google G icon, "Continue with Google" text)
- Divider: "or continue with email"
- Email input field
- Password field with show/hide toggle (eye icon)
- "Forgot your password?" link (opens inline 3-step reset: email → code → new password)
- "Sign in" coral button (full width)
- Bottom: "Don't have an account? Sign up" link

Sign-Up card contents:
- "Create your account" heading
- Google OAuth button
- Divider
- First name + Last name (side by side)
- Email input
- Password with strength indicator (4 colored bars: weak/fair/good/strong)
- Terms checkbox: "I agree to the Terms of Service and Privacy Policy"
- "Create account" coral button
- Bottom: "Already have an account? Sign in" link

Trust signals at very bottom: "Bank-level encryption" | "We never move your money"

Color palette: cocoa brown (#5C3D2E), coral (#E8614D), gold (#D4A843).
Dark mode: dark background (#1A1A1A), coral becomes primary.
```

---

## 3. ONBOARDING FLOW

```
Create a 4-stage onboarding wizard for a fintech app called "WealthMotley" targeting Africans.

Global elements visible on all screens:
- Progress bar at top (branded gradient from cocoa to coral to gold, showing percentage)
- Back arrow button (top left, except on first screen)
- Step indicator: "Step 1 of 4"

Stage A — Welcome (Screen 1):
- Warm illustration placeholder (circular, 200px, showing an African woman with a phone)
- "Welcome to WealthMotley!" in Satoshi font, large
- "Let's set up your financial command center" subtitle
- "Get Started" coral button, full width

Stage A — Country Select (Screen 2):
- "Where are you based?" heading
- 3x3 grid of country cards, each with a circular SVG flag icon + country name:
  Nigeria, United Kingdom, United States, Canada, Germany, UAE, Ghana, Kenya, South Africa
- "Other" card with globe icon
- Cards highlight with cocoa border when selected
- "Continue" button at bottom

Stage B — Goals (Screen 3):
- "What brings you to WealthMotley?" heading
- Multi-select cards (max 3) with icons:
  - "See all my money in one place" (wallet icon)
  - "Track my spending & budget" (chart icon)
  - "Learn about investing" (trending up icon)
  - "Plan my japa" (airplane icon)
  - "Manage family support" (users icon)
- Selected cards have coral bg with white text
- "Skip — I'll explore on my own" link at bottom

Stage C — Bank Connection (Screen 4):
- Illustration of a phone with a shield (trust)
- "Connect your bank to see your money instantly" heading
- Three trust points with icons: "Bank-level encryption", "Read-only access", "We can never move your money"
- "Connect My Bank" coral button (primary)
- "I'll do this later" text link (secondary — important escape hatch)

Stage D — Celebration (Screen 5):
- Confetti animation
- Celebration illustration (African woman celebrating)
- "You're all set!" heading
- 3 quick-start cards: "Explore All My Money", "Set up a budget", "Chat with AI Sholz"
- "Go to Dashboard" button

Mobile-first. Each screen is full viewport height. Transitions slide left/right.
Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843) palette.
```

---

## 4. ALL MY MONEY DASHBOARD (Killer Feature)

```
Create the "All My Money" dashboard — a unified financial command center for an African fintech app.

This is the #1 feature: everything a user owns across all platforms in one view.

Layout:

Row 1 — Net Worth Hero Card (full width):
- Large gradient card (cocoa to dark in light mode, coral to dark in dark mode)
- "Total Net Worth" label
- Big bold number: "N12,450,000" in white
- Secondary: "~$8,058 USD" smaller text with exchange rate
- Trend badge: "↑ 3.2% this month" in green
- Subtle wallet icon watermark (top right, low opacity)

Row 2 — Two cards side by side:
Left: Asset Breakdown Donut Chart
- Recharts donut/pie chart showing: Banks 45%, Investments 25%, Pensions 15%, Property 10%, Crypto 5%
- Center label: total value
- Legend below with colored dots and amounts
- Colors: cocoa, coral, gold, sage green, blue

Right: Currency Allocation Bar
- Horizontal stacked bar: NGN 60% (cocoa) | USD 25% (coral) | GBP 15% (gold)
- Legend with flag icons and amounts

Row 3 — Asset Cards Grid (2 columns desktop, 1 mobile):
Each card shows:
- Icon (bank/chart/house/bitcoin) in a colored circle
- Asset name: "GTBank Savings"
- Platform: "Connected via Mono" badge (green) or "Manually added" (blue)
- Balance: "N2,500,000"
- Last updated: "30m ago"
- Edit/delete dropdown (three dots menu)

Row 4 — Action Buttons:
- "Add Asset" (coral button with plus icon)
- "Import from Screenshot" (outline button with camera icon)

Row 5 — Net Worth Trend Chart (full width):
- Recharts area chart with coral gradient fill
- 12-month trend line
- Period selector tabs: 3M | 6M | 1Y | All
- Tooltip on hover

Color palette: cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843), sage green (#5B9A6D).
Use shadcn Card, Badge, Button, Tabs. Dark mode support.
```

---

## 5. BUDGET DASHBOARD

```
Create a budget tracking dashboard for "WealthMotley" — an African fintech app.

Layout:

Row 1 — Budget Overview Card (full width, gradient bg):
- "Hey Olayinka, you've spent N343,400 of N450,000"
- Large horizontal progress bar (cocoa fill on light bg)
- "N106,600 left this month" in coral text
- "13 days remaining in March" small text

Row 2 — KPI Cards Row (4 cards, horizontal scroll on mobile):
- Income: N450,000 (green up arrow ↑3.2%)
- Spent: N343,400 (trend vs last month)
- Saved: N106,600
- Savings Rate: 23.7% (trend)
Each card: big number, label, trend badge with colored arrow

Row 3 — Two columns:
Left: Category Progress Card
List of budget categories, each with:
- Colored dot + Nigerian category name
- Horizontal progress bar that changes color: green (<75%), amber (75-90%), red (>90%)
- "N48,200 / N72,000" amounts + percentage
Categories: Jollof & Chops, Transport & Bolt, Data & Airtime, Tithes & Offerings, Family Support, Owambe & Aso Ebi, Rent & Housing, Utilities & Bills

Right: Spending Trend Chart
- Recharts area chart with coral gradient
- Daily spending over the month
- Dashed gold line at daily budget rate
- Tabs: This Month | Last Month | 3 Months

Row 4 — Recent Transactions Table (full width):
- Search bar + Category filter dropdown + Type tabs (All/Income/Expenses)
- Table columns: Date, Description, Category (colored badge), Amount (green for credit, coral for debit)
- Sortable, paginated
- Mobile: switch to card layout

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843) palette. shadcn components.
```

---

## 6. BLACK TAX TRACKER

```
Create a "Black Tax" family obligation tracker for an African fintech app.

"Black Tax" is the cultural obligation to financially support extended family — a uniquely African concept. This page helps users track and manage it without guilt.

Layout:

Row 1 — Summary Hero Card (full width, gradient):
- "N180,000 sent to family this year" — big bold white number
- "13.3% of your income" with percentage indicator
- "N60,000/month average"
- Sustainability gauge: green (<15%), amber (15-25%), red (>25%)
- This user is at 13.3% = green = "Sustainable"

Row 2 — Two columns:
Left: Breakdown Donut Chart
- Toggle tabs: "By Relationship" | "By Category"
- Relationship view: Mother 51%, Siblings 22%, Extended Family 16%, Father 11%
- Category view: General Support 40%, School Fees 30%, Medical 20%, Rent 10%
- Colored legend with amounts

Right: Add Entry Button + Quick Stats
- "Add Family Support" coral button with plus icon
- Quick stat cards: "Most supported: Mum", "Biggest category: School Fees"

Row 3 — Timeline (full width):
- Chronological list grouped by month (March 2026, February 2026, etc.)
- Each entry: avatar circle with initials, recipient name, amount, category badge (colored), date, note
- Edit/delete actions on hover
- Empty state: warm illustration + "No entries yet. Add your first family support entry."

Dialog for adding entry:
- Recipient Name, Relationship (dropdown: Mother, Father, Sibling, Extended Family, Other)
- Amount, Currency, Category (School Fees, Medical, Rent, Food, General Support)
- Date, Note, Is Recurring toggle

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Warm, non-judgmental design.
```

---

## 7. JAPA READY SCORE

```
Create a "Japa Ready Score" page — an emigration financial readiness tracker for Africans.

"Japa" means to emigrate in Nigerian slang. This tool calculates how financially ready someone is to relocate abroad.

Layout:

Row 1 — Destination Selector:
- Dropdown with flag icons: UK Skilled Worker, Canada PR, US Student, Germany Blue Card, UAE, Australia, South Africa

Row 2 — Two columns:
Left: Japa Score Ring (hero element)
- Large SVG circular progress ring (200px diameter)
- Score: "33%" in center, big and bold
- Ring track: muted cocoa, fill: coral (animated on load)
- Below ring: "UK Skilled Worker" badge
- "Estimated ready: January 2028"

Right: Key Stats Cards
- Monthly savings: N80,000
- Total needed: N4,830,000
- Total saved: N1,614,000
- Months to go: ~22

Row 3 — Milestones Timeline (full width):
Vertical timeline with 5 milestones:
1. Visa Application Fee — N180,000 / N180,000 — ✅ DONE (green check, strikethrough)
2. Flight Ticket — N450,000 / N450,000 — ✅ DONE
3. Proof of Funds — N984,000 / N1,200,000 — ⏳ 82% (coral progress bar, active)
4. First 3 Months Living — N0 / N2,500,000 — 🔒 LOCKED (grey, lock icon)
5. Emergency Buffer — N0 / N500,000 — 🔒 LOCKED

Each milestone: status icon, name, progress bar, amounts, percentage

Row 4 — Share Button:
- "Share My Japa Score" button that generates a shareable card
- Preview of the 9:16 Instagram card

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Aspirational, motivating design.
```

---

## 8. AI SHOLZ CHATBOT

```
Create an AI chatbot interface for "AI Sholz" — a financial education companion for an African fintech app.

AI Sholz speaks in warm, simple English and can "roast" your spending lovingly.

Layout:

Header:
- "Chat with AI Sholz" title
- "Your personal financial education companion" subtitle
- Tone toggle pills: "Warm" (default, selected) | "Formal"
- "Roast Me 🔥" button (coral, playful)

Chat area (full height minus header and input):
- AI messages: left-aligned, cocoa bg (light mode) / coral bg (dark mode), rounded bubbles
- AI avatar: "AS" initials in a cocoa circle
- User messages: right-aligned, coral bg (light mode) / cocoa bg (dark mode)
- Typing indicator: three bouncing dots when AI is thinking

Empty state (when no messages):
- Centered icon in a large circle
- "Ask me anything about your money"
- 5 suggested prompt chips in a flex-wrap layout:
  - "How am I doing with my budget?"
  - "Explain ETFs to me simply"
  - "Where can I cut spending?"
  - "Help me plan for japa"
  - "Roast my spending!"

Input bar (bottom, sticky):
- Text input with "Ask AI Sholz..." placeholder
- Send button (coral, arrow icon)
- Auto-growing textarea

Disclaimer footer: "AI Sholz provides financial education only. Not financial advice."

Cocoa (#5C3D2E), coral (#E8614D). Warm chat design, NOT clinical/robotic.
```

---

## 9. MONEY DNA + MONEY WRAPPED

```
Create a "Money Story" page with two tabs: "Money Wrapped" and "Money DNA."

Tab 1: Money Wrapped (Spotify Wrapped for finances)
A full-screen card carousel. Each card is dark gradient background with one bold stat:

Slide 1: "Your 2026 Money Story" title with gradient text
Slide 2: "You earned N5,400,000 this year" — big number, Naira icons floating
Slide 3: "Your biggest category: Jollof & Chops — N456,000" — fork/knife icon
Slide 4: "You sent N1,200,000 to family. That's love." — heart + users icons
Slide 5: "You saved N780,000 — that's 14.4%" — animated progress ring
Slide 6: "Your Money DNA: The First-Gen Warrior" — archetype icon in circle
Slide 7: "Budget streak: 47 days" — fire icon, streak counter
Slide 8: "Share Your Money Story" — download/share buttons

Navigation: swipe/tap + dot indicators at bottom.

Tab 2: Money DNA Personality Quiz
If not taken: "Discover Your Money DNA" CTA with 6 archetype preview chips
If in progress: 8-question quiz with visual card options (not radio buttons)
If complete: result card showing archetype icon in styled circle, name, tagline, strengths, watch-outs, tips, and "Share" button

Each quiz question: 4 answer cards with icons, selected card highlights in coral

The 6 archetypes: The Generous Hustler, The Cautious Dreamer, The Social Spender, The Silent Builder, The First-Gen Warrior, The Pepper Dem Investor

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Premium, shareable, Instagram-worthy.
```

---

## 10. PORTFOLIO TOOLS (Educational)

```
Create an educational portfolio tools page for a fintech app. EVERY section must have a disclaimer banner: "This is educational information, not financial advice."

Layout:

Section 1 — What-If Investment Simulator:
- 3 sliders in a card:
  - Monthly Investment: N10,000 — N500,000 (default N50,000)
  - Time Horizon: 1-30 years (default 10)
  - Expected Return: 1-20% (default 10%)
- Live-updating Recharts area chart showing projected growth
- Two areas: "Your Contributions" (straight, muted) vs "Projected Growth" (curved, coral gradient)
- Shaded confidence band (optimistic/pessimistic ±3%)
- Result card: "After 10 years, your N50,000/month could grow to N10,324,000"
- Cultural callout: "That's enough for a house deposit in Lagos"
- Amber disclaimer banner at bottom

Section 2 — Model Portfolios (2x2 grid):
4 cards, each with:
- Name + description + risk badge
- Small donut chart showing allocation
- "Learn More" expandable (NOT "Invest" or "Get Started")
- Disclaimer on each card
Models: Conservative Saver, Balanced Builder, Growth Explorer, Diaspora Portfolio

Section 3 — ETF Comparison:
- 3 dropdown selectors: VOO vs VTI vs QQQ
- Comparison table: Expense Ratio, 1Y/3Y/5Y/10Y Returns, Dividend Yield, Risk Level (visual bars), Top Holdings
- Bar chart comparing returns across periods
- NO "best" or "recommended" language — pure factual comparison

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Educational, trustworthy design.
```

---

## 11. LEARN / EDUCATION HUB

```
Create a financial education hub page for an African fintech app.

Layout:

Row 1 — Daily Tip Card (full width, prominent):
- Lightbulb icon
- "Sholz says..." label
- Tip text: "The 24-hour rule: Before any purchase over N10,000, wait 24 hours."
- Save/bookmark button

Row 2 — Roast Me Card (fun, standalone):
- Fire icon
- "Roast Me, Sholz!" coral button
- Subtitle: "Get brutally honest feedback about your spending"

Row 3 — Learning Paths (2x2 grid):
4 learning path cards, each with:
- Icon in colored circle
- Path name + description
- Lesson count + progress ring
- Click to expand accordion showing lessons

Paths:
1. "Money Basics" (cocoa) — Budgeting 101, Emergency Fund, Debt Management, 50/30/20 Rule
2. "Investing for Beginners" (coral) — What is an ETF?, Compound Interest, Dollar Cost Averaging, Risk Tolerance
3. "Diaspora Money Moves" (gold) — Sending Money Home, Multi-Currency, UK ISAs, US 401k
4. "Japa Finance" (sage green) — Real Cost of Japa, Proof of Funds, First 3 Months, Reverse Japa

Each lesson shows: title, duration, type badge (Article/Video), lock icon if premium, checkmark if completed

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Educational but fun, not boring.
```

---

## 12. SETTINGS PAGE

```
Create a settings page with 6 tabs for a fintech app.

Tab navigation: Profile | Preferences | Notifications | Accounts | Privacy | Billing
(Horizontally scrollable on mobile)

Tab 1 — Profile:
- Avatar circle with initials, edit button
- Name field (editable inline)
- Email (read-only, from Clerk)
- Country selector with flag icons

Tab 2 — Preferences:
- Primary currency selector (9 currencies with flags)
- AI Coach tone: Warm / Formal toggle
- Theme: System / Light / Dark radio buttons
- Language: English (others coming soon, disabled)

Tab 3 — Notifications:
- 5 toggle switches with icons and descriptions:
  - Spending alerts, Budget warnings, Weekly summary, New content, Japa milestones
- WhatsApp notifications: toggle with "Coming soon" badge

Tab 4 — Connected Accounts:
- List of connected banks (GTBank, Access Bank) with status badges, sync buttons
- "Connect New Bank" button
- Manual assets summary with link

Tab 5 — Data & Privacy:
- Consent toggles: Bank data (required), Marketing, Analytics — each with timestamp
- "Download My Data" button
- Red danger zone: "Delete My Account" with confirmation dialog requiring "DELETE" typed

Tab 6 — Subscription:
- Current plan card (Free)
- Plan comparison: Free vs Pro (N4,999/mo) vs Premium (N8,000/mo)
- Feature checklist per plan
- "Upgrade to Pro" coral CTA

Cocoa (#5C3D2E), coral (#E8614D). Clean, organized, professional.
```

---

## 13. ADMIN OVERVIEW DASHBOARD

```
Create an admin dashboard for a fintech SaaS platform.

Layout:

Row 1 — 4 KPI Cards:
- Total Users: 2,847 (↑12.3%)
- Active Users: 1,234 (DAU)
- Premium Subscribers: 89 (↑8.2%)
- MRR: N444,111 (↑15.6%)
Each: big number, label, trend arrow, sparkline chart

Row 2 — Two charts:
Left: Weekly Signups Bar Chart (8 weeks)
Right: Geo Distribution Donut (Nigeria 68%, UK 18%, US 8%, Other 6%)

Row 3 — Conversion Funnel:
Visual funnel: Signups 2,847 → Onboarded 2,100 → Bank Connected 890 → Premium 89
Each step with percentage drop

Row 4 — Recent Activity Feed:
5 entries with avatars: "John from Lagos signed up", "Amara upgraded to Premium", etc.
Each with relative timestamp

Admin sidebar with: Overview, Users, Analytics, Content, Billing
"Admin" badge next to logo

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Professional, data-dense but clean.
```

---

## 14. ADMIN USERS PAGE

```
Create a user management page for a fintech SaaS admin portal.

Header: "Users" with search bar + "Export CSV" button

Filters row: Plan (All/Free/Pro/Premium), Status (All/Active/Inactive/Churned), Country dropdown

Data table with columns:
- Avatar + Name + Email (stacked)
- Country (flag icon)
- Plan (colored badge: Free=grey, Pro=coral, Premium=gold)
- Status (badge: Active=green, Inactive=amber, Churned=red)
- Joined (relative date)
- Last Active (relative date)

Sortable columns, paginated (25 per page), row click opens detail panel

User Detail Panel (Sheet from right):
- Large avatar + name + email
- Subscription card: plan, status, since date
- Connected accounts: count + bank names
- Activity log: last 5 actions with timestamps

15 mock users from Nigeria, UK, US, Ghana, Canada with variety in plans and statuses.

Cocoa (#5C3D2E), coral (#E8614D). Clean data table design.
```

---

## 15. ADMIN ANALYTICS PAGE

```
Create an analytics dashboard for a fintech SaaS admin portal.

Period selector tabs: 7d | 30d | 90d | YTD

Row 1 — Two charts:
Left: MRR Growth Line Chart (6 months, N50K to N444K, coral line)
Right: User Growth Area Chart (cumulative, cocoa fill gradient)

Row 2 — Feature Adoption Horizontal Bar Chart:
- All My Money: 82%
- Budget: 65%
- AI Sholz: 45%
- Money DNA: 52%
- Japa: 38%
- Learn: 30%
Bars colored in cocoa with percentage labels

Row 3 — Two columns:
Left: Retention Cohort Heatmap
4 cohorts (Week 1-4), 4 columns (Week 1-4)
Color-coded cells: dark green (90%+), light green (70-89%), amber (50-69%), red (<50%)

Right: Top Countries Table
Sorted by users: Nigeria (1,936 users, N320K revenue), UK (513), US (228), Ghana (85), Canada (57)

Churn Rate Card: 4.2% monthly (↓0.3% = good, shown in green)

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Data-rich but not overwhelming.
```

---

## 16. DASHBOARD SIDEBAR + HEADER

```
Create a collapsible sidebar navigation and header for a fintech app dashboard.

Sidebar:
- Logo: "WealthMotley" in Satoshi font with a branded "W" icon (cocoa circle)
- Navigation items with Phosphor-style icons (bold weight):
  1. All My Money (wallet icon) — highlighted as the #1 item
  2. Dashboard (grid icon)
  3. Transactions (arrows icon)
  4. Budget (pie chart icon)
  5. Savings (piggy bank icon)
  6. Black Tax (users icon)
  7. Japa Score (airplane icon)
  8. Portfolio (trending up icon)
  9. Learn (book icon)
  10. Money Story (sparkle icon)
  11. AI Sholz (chat icon) — "AI" badge in coral
  12. Settings (gear icon)

Active state: cocoa bg with white text (light), coral bg with white text (dark)
Hover: subtle highlight
Collapsible to icon-only mode on desktop
Sheet/drawer on mobile

User section at bottom: avatar + name + email + dropdown (Settings, Sign Out)

Header:
- Mobile: hamburger menu + centered "WealthMotley" + avatar
- Desktop: currency selector dropdown (flag + NGN/USD/GBP/etc) + dark mode toggle (sun/moon) + notification bell with badge + avatar

Cocoa (#5C3D2E), coral (#E8614D). Premium sidebar, not generic.
```

---

## 17. TRANSACTIONS PAGE

```
Create a transaction list page for a fintech app.

Row 1 — Summary Bar (3 cards):
- Total Income: N450,000 (green)
- Total Expenses: N343,400 (coral)
- Net: +N106,600 (cocoa)

Row 2 — Filters:
- Search input: "Search transactions..."
- Category multi-select dropdown (from Nigerian categories)
- Date range picker
- Type tabs: All | Income | Expenses
- Active filters shown as dismissible chips

Row 3 — Transaction List:
Desktop: Table with columns Date, Description, Category (colored badge), Amount (green/red)
Mobile: Card stack with each transaction as a compact card

Category badges use category-specific colors:
- Jollof & Chops: coral
- Data & Airtime: blue
- Transport & Bolt: green
- Tithes & Offerings: purple
- Family Support: gold
- Owambe & Aso Ebi: pink

Pagination at bottom. Empty state with illustration.

Cocoa (#5C3D2E), coral (#E8614D). Clean, filterable, mobile-first.
```

---

## 18. SAVINGS GOALS PAGE

```
Create a savings goals page for an African fintech app.

Row 1 — Overview Card:
- "Saving toward 5 goals"
- Total: N2,250,000 of N4,650,000
- Overall progress bar: 48%

Row 2 — Goal Cards Grid (2 columns desktop, 1 mobile):

Each goal card:
- SVG circular progress ring (percentage in center)
- Goal name (bold)
- Target amount + current amount + remaining
- Target date with "X days left" badge
- If locked: amber lock badge "Locked until Nov 25"
- If completed (100%): green border + checkmark
- Edit/delete dropdown

5 example goals:
1. Emergency Fund — 64% — N320K/N500K — sage green ring
2. Japa Fund — 40% — N1.2M/N3M — coral ring
3. New Laptop — 56% — N450K/N800K — blue ring
4. Detty December — 100% ✓ — LOCKED — gold ring, green border
5. Wedding Contribution — 53% — N80K/N150K — pink ring

Bottom: "Create New Goal" coral button

Cocoa (#5C3D2E), coral (#E8614D), gold (#D4A843). Motivating, visual progress.
```

---

## 19. NOTIFICATION DROPDOWN

```
Create a notification bell dropdown for a fintech app header.

Trigger: Bell icon button with unread count badge (coral, shows "3")

Dropdown (Popover, 320px wide):
- Header: "Notifications" + "Mark all as read" link
- Scrollable list (max 300px height)

Notification items:
- Type icon (duotone, in circle) + Title (bold if unread) + Message (2 lines max) + Relative time
- Unread items: subtle coral dot indicator + bolder text
- Click: marks as read + navigates to link

3 example notifications:
1. System: "Welcome to WealthMotley!" — "Start by connecting your bank..." — link to /all-my-money
2. System: "Set up your budget" — "Create your first budget..." — link to /budget
3. Tip: "Try AI Sholz" — "Chat with your personal companion..." — link to /sholz

Empty state: muted bell icon + "No notifications yet"

Real-time: new notifications appear instantly without refresh.

Cocoa (#5C3D2E), coral (#E8614D). Clean, not cluttered.
```

---

## HOW TO USE THESE PROMPTS

1. Go to **v0.dev**
2. Paste the **Global Design Rules** block first
3. Then paste the specific page prompt
4. Generate → iterate → export the code
5. Adapt the generated components to fit the existing WealthMotley codebase

Each prompt is designed to produce designs that match WealthMotley's cocoa/coral/gold palette, Satoshi + Plus Jakarta Sans typography, and warm African fintech aesthetic.
