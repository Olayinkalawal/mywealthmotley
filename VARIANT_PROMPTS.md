# WealthMotley — Variant Design Prompts

> These prompts describe WHAT the product is and WHAT each section does — no colors, no fonts, no code. Let Variant surprise you with the visual direction.

---

## LANDING PAGE

```
A landing page for "WealthMotley" — the first AI-powered financial education companion built specifically for Africans at home and in the diaspora (UK, US, Canada, Germany, UAE, etc).

The product lets users see ALL their money in one place — bank accounts, investments, pensions, property, crypto — across multiple countries and currencies. It also tracks budgets with culturally specific categories (like family support obligations, social event spending, and religious tithes), provides educational investing tools, and has an AI chatbot coach.

The target audience is African professionals aged 20-35, both on the continent and abroad, who are building wealth for the first time with no safety net.

Sections from top to bottom:

HEADER / NAVBAR:
- Logo text "WealthMotley" on the left
- Navigation links: Features, How It Works, Pricing
- Two buttons: "Sign In" and "Join the Waitlist" (the primary action)

HERO SECTION:
- A bold, attention-grabbing headline about finally seeing all your money in one place across countries
- A supporting line about bank accounts, investments, pensions and crypto all connected and converted to your preferred currency
- Two call-to-action buttons: "Join the Waitlist" (primary) and "See How It Works" (secondary)
- Trust indicators below the buttons: bank-level encryption, read-only access, a community of 167,000+ members
- A product mockup or dashboard preview showing a financial overview with a large net worth number, a donut chart of asset types, and individual account cards

FEATURES SECTION:
Four feature cards in a grid:
1. "All My Money Dashboard" — see everything you own across every platform, every country, one view. This is the flagship feature and should stand out visually.
2. "Smart Budget Tracker" — budget categories designed for how Africans actually spend: food, transport, data/airtime, family support, social events, religious giving
3. "Japa Ready Score" — a readiness calculator for Africans planning to emigrate abroad, showing how close they are financially to relocating
4. "AI Financial Coach" — an AI chatbot trained on a real financial educator's personality that analyzes your actual bank data and gives you straight-talking money education

WHO IT'S FOR SECTION:
Three persona cards describing the target users:
1. "The Diaspora Professional" — someone living abroad managing money across two countries, sending money home while building wealth where they live
2. "The First-Gen Builder" — someone with no inherited wealth, supporting extended family while trying to save and invest for the first time
3. "The Japa Planner" — someone saving to emigrate abroad who needs to know exactly when they'll be financially ready

HOW IT WORKS SECTION:
Three numbered steps:
1. Connect your bank — takes 60 seconds, read-only access through a secure banking API
2. Add your investments — take a screenshot of any investment app and AI extracts your holdings automatically
3. See your complete financial picture — everything in one dashboard, all currencies converted

SOCIAL PROOF SECTION:
- A large number showing how many people are in the community (167,000+)
- Three testimonial cards from users in different cities (Lagos, London, Toronto) talking about how the product changed their relationship with money

WAITLIST CTA SECTION:
- A prominent section with a different background encouraging visitors to join the waitlist
- Messaging about early members getting lifetime premium pricing
- An email input field, a country selector dropdown, and a join button
- A live counter showing how many people have already joined (around 2,800)
- After joining: show their queue position and a referral link to share

FOOTER:
- Four columns: Brand (logo + tagline + social media icons), Product (features, pricing, how it works), Company (about, careers, press, contact), Legal (terms of service, privacy policy, cookie policy)
- A bottom bar with a financial disclaimer: "WealthMotley provides financial education tools only. Nothing on this platform constitutes financial advice."
- Copyright line

The overall feeling should be warm, premium, and distinctly African — not a cold corporate Western fintech template. Think bold, confident, aspirational. The kind of page that makes someone screenshot it and send to their group chat.
```

---

## CUSTOMER PORTAL — DASHBOARD SHELL (Sidebar + Header)

```
A dashboard layout shell for "WealthMotley" — a financial education app for Africans.

LEFT SIDEBAR:
- Logo "WealthMotley" at the top with a branded icon
- 12 navigation items, each with an icon and label:
  1. All My Money (the primary/hero item, should be visually distinguished)
  2. Dashboard
  3. Transactions
  4. Budget
  5. Savings
  6. Black Tax (family obligations tracker)
  7. Japa Score (emigration readiness)
  8. Portfolio (educational investing tools)
  9. Learn (education hub)
  10. Money Story (financial personality + year in review)
  11. AI Coach (AI chatbot — should have a special badge like "AI" to make it stand out)
  12. Settings
- The active page should be clearly highlighted
- The sidebar should be collapsible to icon-only mode on desktop
- On mobile it becomes a slide-out drawer

USER SECTION at the bottom of sidebar:
- User avatar, name, and email
- Dropdown with Settings and Sign Out options

TOP HEADER:
- On mobile: hamburger menu icon, centered app name, user avatar
- On desktop: currency selector dropdown (showing flags and currency codes like NGN, USD, GBP, EUR, CAD), a dark/light mode toggle, a notification bell with an unread count badge, and the user avatar

The main content area should have comfortable padding and a subtle page transition animation.
```

---

## CUSTOMER PORTAL — ALL MY MONEY (The Flagship Page)

```
The main dashboard of a financial app that shows EVERYTHING a user owns in one unified view. This is the most important page in the entire product.

NET WORTH HERO CARD (full width, top of page):
- A large prominent card with a gradient or rich background
- "Total Net Worth" label
- A very large formatted currency number (like twelve million naira)
- A secondary amount showing the equivalent in US dollars with the exchange rate
- A trend indicator showing percentage change from last month (up or down with an arrow)

ASSET BREAKDOWN CHART + CURRENCY ALLOCATION (side by side):
Left card: A donut/pie chart breaking down assets by type — banks, investments, pensions, property, crypto, cash. Each with a different color, a legend below with amounts.
Right card: A horizontal stacked bar showing how money is distributed across currencies (like 60% Naira, 25% US Dollar, 15% British Pound) with a legend showing exact amounts.

ASSET CARDS GRID (2 columns on desktop, 1 on mobile):
Individual cards for each account or asset the user has. Each card shows:
- An icon representing the type (bank, investment, house, bitcoin, etc.)
- The name of the asset (like "GTBank Savings" or "Trading 212 Portfolio")
- The platform it's on and how it's connected (via bank API, manually added, or imported from screenshot)
- The balance in its native currency
- When it was last updated
- An actions menu for editing or removing

ACTION BUTTONS:
- "Add Asset" button to manually add an investment, property, pension, etc.
- "Import from Screenshot" button — users can photograph any investment app and AI extracts the data

NET WORTH TREND (full width):
- An area chart showing how net worth has changed over time (monthly data points)
- Period selector: 3 months, 6 months, 1 year, all time
- A smooth gradient fill under the line
```

---

## CUSTOMER PORTAL — BUDGET DASHBOARD

```
A budget tracking dashboard showing monthly spending analysis with culturally relevant categories for African users.

BUDGET OVERVIEW CARD (full width, gradient background):
- A personalized greeting: "Hey [name], you've spent [amount] of [total budget]"
- A large horizontal progress bar showing the percentage spent
- How much is left and how many days remain in the month

KPI CARDS ROW (4 cards, horizontally scrollable on mobile):
- Income (with up/down trend arrow)
- Amount Spent (with trend)
- Amount Saved
- Savings Rate percentage (with trend)

TWO COLUMN SECTION:
Left: Category Progress List
A list of budget categories, each showing:
- A colored indicator dot and the category name (culturally specific names like "Jollof & Chops" for food, "Data & Airtime" for phone costs, "Owambe & Aso Ebi" for social events, "Tithes & Offerings" for religious giving, "Family Support" for money sent to relatives)
- A progress bar that changes from green to amber to red as spending approaches the limit
- The spent amount vs allocated amount

Right: Spending Trend Chart
- An area chart showing daily spending over the month
- A dashed reference line showing the daily budget rate
- Period tabs to switch between months

RECENT TRANSACTIONS TABLE (full width):
- A search bar, category filter, and tabs for All/Income/Expenses
- Columns: date, description, category with a colored badge, amount (green for money in, red for money out)
- On mobile: transforms from a table into a stack of compact transaction cards
```

---

## CUSTOMER PORTAL — BLACK TAX TRACKER

```
A tracker for "Black Tax" — the African cultural obligation to financially support extended family members. This is a sensitive topic — the design should be warm and non-judgmental, helping users manage obligations without guilt.

SUMMARY HERO CARD (full width, gradient):
- Total amount sent to family this year (large, bold)
- What percentage of their income goes to family support
- Monthly average
- A sustainability indicator: a gauge or badge showing whether they're giving at a sustainable level (green if under 15%, amber if 15-25%, red if over 25%)

TWO COLUMNS:
Left: Breakdown Chart
- A donut/pie chart with a toggle to switch between two views:
  - "By Relationship": mother, father, siblings, extended family — showing percentages
  - "By Category": school fees, medical bills, rent, food, general support

Right: Action Area
- A prominent button to add a new family support entry
- Quick stats: who they support most, biggest category

TIMELINE (full width):
- A chronological list of all family support entries, grouped by month
- Each entry shows: the recipient's name, their relationship, the amount, a category badge, the date, and an optional note
- Edit and delete options on each entry

ADD ENTRY DIALOG:
- Fields: recipient name, relationship selector, amount, currency, category, date, note, and whether it's recurring
```

---

## CUSTOMER PORTAL — JAPA READY SCORE

```
A financial readiness calculator for Africans planning to emigrate ("japa") abroad. Shows how close they are to having enough money to make the move.

DESTINATION SELECTOR (top):
- A dropdown to choose the destination country and visa type: UK Skilled Worker, Canada PR, US Student Visa, Germany Blue Card, UAE, Australia, South Africa

TWO COLUMNS:
Left: The Score Ring (the hero visual)
- A large circular progress ring, roughly 200 pixels in diameter
- The readiness percentage displayed large and bold in the center (like 33%)
- The ring fills proportionally with a gradient
- Below the ring: the destination badge and estimated date when they'll be ready

Right: Key Statistics
- Monthly savings amount
- Total amount needed
- Total saved so far
- Estimated months to go

MILESTONES TIMELINE (full width):
A vertical timeline of financial milestones needed for emigration:
1. Visa application fee — with a checkmark if complete
2. Flight ticket — with a checkmark if complete
3. Proof of funds — with a progress bar showing percentage (like 82%)
4. First 3 months living expenses — locked until previous milestones are done
5. Emergency buffer — locked

Each milestone shows: its name, a progress bar, the saved amount vs required amount, and a status icon (done, in progress, or locked)

SHARE BUTTON:
- A button to share their Japa Score as a social media card
```

---

## CUSTOMER PORTAL — AI COACH CHATBOT

```
A chat interface for an AI financial education companion. The AI is trained on a real financial educator's personality and can reference the user's actual spending data.

HEADER:
- "Chat with [Coach Name]" title
- "Your personal financial education companion" subtitle
- Tone toggle: "Warm" (default) and "Formal" — switches the AI's communication style
- A special "Roast Me" button that triggers the AI to humorously critique the user's spending habits

CHAT AREA:
- AI messages on the left with the coach's avatar
- User messages on the right
- A typing indicator (animated dots) when the AI is thinking
- Messages can reference actual spending data: "You spent more on food delivery than rent this month"

EMPTY STATE (when no messages):
- A centered icon and message: "Ask me anything about your money"
- 5 suggested conversation starters as clickable chips:
  - "How am I doing with my budget?"
  - "Explain ETFs to me simply"
  - "Where can I cut spending?"
  - "Help me plan for japa"
  - "Roast my spending!"

INPUT BAR (sticky at bottom):
- A text input that grows as the user types
- A send button

DISCLAIMER at the very bottom: "Provides financial education only. Not financial advice."

The chat should feel like texting a knowledgeable friend, not interacting with a corporate chatbot.
```

---

## CUSTOMER PORTAL — MONEY STORY (DNA + Wrapped)

```
A page with two tabs: "Money Wrapped" and "Money DNA."

TAB 1: MONEY WRAPPED
A Spotify Wrapped-style experience for finances. A full-screen card carousel where each card has a dark gradient background and one bold statistic:

Slide 1: Title card — "Your 2026 Money Story"
Slide 2: Total earned this year with a large animated number
Slide 3: Top spending category with an icon (like food)
Slide 4: Amount sent to family with a heartfelt message
Slide 5: Total saved with a progress ring animation
Slide 6: Their financial personality type
Slide 7: Budget streak (consecutive days of tracking)
Slide 8: How their personality evolved over time
Slide 9: Share card with download and social sharing buttons

Swipe or tap to navigate between slides. Dot indicators at the bottom.

TAB 2: MONEY DNA
A financial personality quiz that assigns the user one of six archetypes based on their spending behavior:
- The Generous Hustler (gives too much to family)
- The Cautious Dreamer (saves but afraid to invest)
- The Social Spender (social events drain the budget)
- The Silent Builder (multiple income streams, no tracking)
- The First-Gen Warrior (building wealth from nothing while supporting family)
- The Pepper Dem Investor (competitive, loves high-risk investments)

The quiz has 8 questions, each with 4 visual card options the user taps to answer. After completing, a dramatic reveal animation shows their archetype with:
- An icon representing the type
- The archetype name and tagline
- Strengths, watch-outs, and tips
- A beautifully designed share card formatted for Instagram Stories (9:16 ratio)
```

---

## CUSTOMER PORTAL — PORTFOLIO TOOLS

```
An educational investing tools page. This is NOT an investment platform — it's purely educational. Every section must feel like a learning tool, not a trading platform.

SECTION 1: WHAT-IF INVESTMENT SIMULATOR
- Three interactive sliders: monthly investment amount, time horizon in years, expected annual return percentage
- A chart that updates in real time as sliders move, showing projected growth over time
- The chart shows two areas: total contributions (flat growth) vs projected value (exponential growth curve)
- A result card showing the final projected amount with a relatable comparison ("That's enough for a house deposit in Lagos")
- A small disclaimer banner: "This is educational, not financial advice"

SECTION 2: MODEL PORTFOLIOS (educational examples)
Four cards showing example portfolio allocations:
- Conservative Saver (mostly bonds)
- Balanced Builder (mix of bonds and stocks)
- Growth Explorer (mostly stocks and ETFs)
- Diaspora Portfolio (cross-border allocation)
Each card has a small donut chart showing the allocation percentages and a "Learn More" expandable section. NOT "Invest Now" — purely educational.

SECTION 3: ETF COMPARISON
Three dropdown selectors to pick ETFs to compare side by side.
A comparison table showing: expense ratio, historical returns over different periods, dividend yield, risk level indicator, and top holdings.
A bar chart comparing the selected ETFs' returns visually.
No ranking or "best" language — just factual data side by side.
```

---

## CUSTOMER PORTAL — LEARN HUB

```
A financial education hub with learning paths, a daily tip, and a fun "roast me" feature.

DAILY TIP CARD (prominent, full width):
- An icon (like a lightbulb)
- "Sholz says..." label
- A practical financial tip in simple language
- A bookmark/save button

ROAST ME CARD (fun, standalone):
- A fire icon and playful styling
- "Get roasted about your spending" description
- A button that triggers an AI-generated humorous critique of the user's actual spending, delivered as a shareable card

LEARNING PATHS (2x2 grid):
Four cards, each representing a learning track:
1. Money Basics — budgeting, emergency funds, debt management
2. Investing for Beginners — ETFs, compound interest, risk
3. Diaspora Money Moves — sending money home, multi-currency management, foreign tax
4. Japa Finance — cost of emigrating, proof of funds, surviving the first months

Each card shows: an icon, the path name, a short description, how many lessons it contains, and a progress ring showing completion. Clicking expands to show individual lessons with their title, reading time, type (article or video), and whether they're free or premium-locked.
```

---

## CUSTOMER PORTAL — SETTINGS

```
A settings page with 6 sections, navigated by tabs across the top (horizontally scrollable on mobile).

PROFILE TAB:
- Avatar with initials, name field (editable), email (read-only), country selector with flag icons

PREFERENCES TAB:
- Currency selector (9+ currencies with flag icons)
- AI coach tone preference: Warm or Formal
- App theme: System, Light, or Dark
- Language: English (with "coming soon" options for others)

NOTIFICATIONS TAB:
- Toggle switches for: spending alerts, budget warnings, weekly summary, new educational content, japa milestone updates
- A WhatsApp notifications option with a "coming soon" badge

CONNECTED ACCOUNTS TAB:
- List of connected bank accounts showing bank name, account type, connection status, last synced time
- Buttons to sync, disconnect, or add new bank connections
- Summary of manually added assets

DATA & PRIVACY TAB:
- Consent toggles for: bank data processing (required), marketing communications, analytics
- Each showing when consent was granted
- A "Download My Data" button
- A danger zone section with a "Delete My Account" button that requires typing "DELETE" to confirm

SUBSCRIPTION TAB:
- Current plan display
- A plan comparison showing Free vs Pro vs Premium tiers with feature checklists and pricing
- An upgrade call-to-action button
```

---

## ADMIN PORTAL — OVERVIEW

```
An admin dashboard for managing a fintech SaaS platform.

TOP ROW: 4 KPI cards showing:
- Total registered users with percentage growth
- Daily active users
- Premium subscribers with growth
- Monthly recurring revenue with growth
Each card has a large number, a label, and a small trend indicator

MIDDLE ROW: Two charts side by side
Left: A bar chart showing new user signups per week for the last 8 weeks
Right: A donut chart showing geographic distribution of users (Nigeria, UK, US, Ghana, Other)

CONVERSION FUNNEL:
A visual funnel showing: Total Signups → Completed Onboarding → Connected Bank → Upgraded to Premium, with the count and drop-off percentage at each stage

RECENT ACTIVITY FEED:
A list of the 5 most recent user actions: signups, upgrades, bank connections — each with an avatar, description, and relative timestamp

The admin sidebar should have: Overview, Users, Analytics, Content, Billing — with an "Admin" badge visible.
```

---

## ADMIN PORTAL — USER MANAGEMENT

```
A user management page for a SaaS admin portal.

A search bar and filter row at the top: filter by subscription plan, user status, and country.

A data table with columns:
- User avatar, name, and email (stacked in one cell)
- Country (with flag icon)
- Subscription plan (shown as a colored badge: Free, Pro, Premium)
- Account status (badge: Active, Inactive, Churned)
- Join date
- Last active date

The table should be sortable by clicking column headers and paginated.

Clicking any row opens a detail panel sliding in from the right side, showing:
- Full user profile with large avatar
- Subscription details and history
- Number of connected bank accounts
- Last 5 user activities with timestamps
- Admin actions: extend trial, apply discount, suspend account
```

---

## ADMIN PORTAL — ANALYTICS

```
An analytics dashboard for a fintech SaaS admin.

A period selector at the top: 7 days, 30 days, 90 days, Year to date

REVENUE SECTION:
- A line chart showing monthly recurring revenue growth over 6 months
- An area chart showing cumulative user growth

ENGAGEMENT SECTION:
- A horizontal bar chart showing feature adoption rates: what percentage of users use each feature (All My Money, Budget, AI Coach, Money DNA, Japa, Learn)

RETENTION SECTION:
- A cohort retention heatmap table: rows are weekly signup cohorts, columns are weeks since signup, cells are color-coded by retention percentage (darker = higher retention)

GEOGRAPHIC SECTION:
- A ranked table of top countries by user count and revenue contribution

A churn rate card showing the monthly churn percentage with a trend arrow
```

---

## ADMIN PORTAL — CONTENT MANAGEMENT

```
A content management page for educational articles, tips, and announcements in a SaaS admin portal.

Summary cards at the top: count of Published items, Drafts, and Archived items

A "Create New" button prominently placed

A data table listing all content with columns:
- Title and short excerpt
- Content type (Article, Tip, Announcement) with different icons for each
- Status (Published in green, Draft in amber, Archived in grey)
- Author name
- Publication date
- Action buttons

Search bar and filters for type and status

Clicking a row opens a preview panel from the right showing the full content with formatting

The interface should make it easy for a non-technical person to manage educational content.
```

---

## ADMIN PORTAL — BILLING

```
A billing and revenue management page for a SaaS admin portal.

TOP ROW: 4 revenue KPI cards:
- Monthly Recurring Revenue
- Annual Recurring Revenue
- Average Revenue Per User
- Churned MRR (revenue lost to cancellations)
Each with trend indicators

MIDDLE ROW: Three small donut charts side by side:
- Revenue split by plan (Pro vs Premium)
- Revenue split by currency (Naira vs Pounds vs Dollars)
- Revenue split by payment provider (local African payment processor vs international processor)

RECENT PAYMENTS TABLE:
Columns: date, user name, amount, currency, payment provider, status (success/failed/pending)
Status badges are color-coded

FAILED PAYMENTS CARD:
A highlighted card showing recent failed payment attempts with a "Retry" action button on each, styled with a warning border to draw attention
```

---

## HOW TO USE WITH VARIANT

1. Go to variant.ai
2. Paste ONE prompt at a time
3. Scroll through the generated designs
4. Save the ones that resonate
5. Use those as visual references when building the actual pages
6. You can iterate: "make it warmer" or "more premium" or "more African"
