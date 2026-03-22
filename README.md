# myWealthMotley

**The first AI-powered financial education companion built for Africans.**

myWealthMotley helps Africans at home and in the diaspora (UK, US, Canada, Germany, UAE, Ghana, Kenya, South Africa) see ALL their money in one place, track budgets with culturally relevant categories, and learn to invest — guided by **Mo**, an AI coach trained on real financial coaching sessions.

## Design System

| Token | Value |
|-------|-------|
| **Primary** | Amber `#ffb347` |
| **Secondary** | Dark Orange `#e67e22` |
| **Background** | Near-black `#0d0b0a` |
| **Muted** | `#968a84` |
| **Theme** | Dark glassmorphism with ambient glow effects |
| **Heading Font** | DynaPuff (cursive, playful) |
| **Mono Font** | JetBrains Mono (data, labels, numbers) |
| **Body Font** | Inter / Plus Jakarta Sans |
| **Icons** | Phosphor Icons (duotone weight) |
| **Flags** | react-circle-flags (SVG circle flags) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo |
| **Frontend** | Next.js 14 (App Router) |
| **UI** | shadcn/ui + Tailwind CSS |
| **Auth** | Clerk (custom sign-in/sign-up pages) |
| **Database** | Convex (real-time) |
| **AI** | OpenAI GPT-4o (Mo chatbot + screenshot analysis) |
| **Banking** | Mono API (Nigerian bank connections) |
| **Deployment** | Vercel |
| **Language** | TypeScript (strict) |

## Key Features

- **All My Money** — Unified dashboard across bank accounts, investments, pensions, property, crypto, and cash across multiple countries and currencies
- **AI Screenshot Import** — Upload screenshots from Trading 212, Cowrywise, Bamboo, etc. and GPT-4o extracts your holdings automatically
- **Mo (AI Coach)** — AI chatbot personality extracted from real 1-on-1 coaching sessions with warm, firm, culturally aware financial guidance
- **Budget Tracker** — Monthly budgets with lifestyle-relevant categories and animated progress tracking
- **Multi-Currency** — 9 supported currencies (NGN, GBP, USD, CAD, EUR, AED, GHS, KES, ZAR) with real-time conversion
- **Future You** — Compound interest projection tool showing wealth growth over time
- **Money Story** — Annual financial wrapped/recap with shareable cards

## Project Structure

```
wealthmotley/
  apps/
    web/                    # Next.js 14 app
      convex/               # Convex backend (schema, mutations, queries, actions)
      src/
        app/                # App Router pages
          (marketing)/      # Landing page, waitlist
          (auth)/           # Sign-in, sign-up (custom Clerk)
          (onboarding)/     # 3-step onboarding flow
          (dashboard)/      # All authenticated pages
          (admin)/          # Admin portal
        components/
          ui/               # shadcn/ui primitives
          wm/               # myWealthMotley custom components
        hooks/              # Custom React hooks
        lib/                # Constants, currencies, AI prompts, personality engine
  packages/
    shared/                 # Shared types
    typescript-config/      # Shared tsconfig
    eslint-config/          # Shared ESLint
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Fill in: Clerk, Convex, OpenAI, Mono API keys

# Deploy Convex backend
cd apps/web && npx convex dev

# Start development server
cd ../.. && npm run dev
```

## Environment Variables

| Variable | Service |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk |
| `CLERK_SECRET_KEY` | Clerk |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk (for Convex auth) |
| `NEXT_PUBLIC_CONVEX_URL` | Convex |
| `OPENAI_API_KEY` | OpenAI (Mo + screenshot analysis) |
| `MONO_SECRET_KEY` | Mono (Nigerian bank connections) |
| `NEXT_PUBLIC_MONO_PUBLIC_KEY` | Mono (Connect widget) |

## License

Private. All rights reserved.
