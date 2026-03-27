# Running Challenge App - Project Specification

## Goal
Build a fun, motivating SvelteKit + Tailwind + daisyUI web app for tracking a weekly running/walking challenge between participants. Shareable via UUID links.

## Tech Stack
- SvelteKit (Svelte 5) + TypeScript
- Tailwind CSS + daisyUI v5 (with 31 themes)
- Turso (libSQL) for SQLite on Vercel
- Deployed on Vercel (free tier)

## Theme System

### daisyUI Themes
- 31 built-in themes available (light, dark, forest, dracula, cyberpunk, etc.)
- Default theme: **forest**
- Theme persisted in localStorage via `theme` key
- Inline script in `app.html` prevents flash on page load
- Theme switcher in navbar + settings page

### Theme Components
| Component | Description |
|-----------|-------------|
| `ThemeSwitcher.svelte` | Dropdown (desktop) + modal (mobile) for theme selection |
| `/settings` | App settings page with theme categories |

### Theme Persistence
- Inline blocking script in `app.html` runs before content renders
- Root layout `onMount` applies saved theme
- Both ThemeSwitcher and settings page use same localStorage key

## Architecture

### URL-Based State
- Each challenge gets a unique UUID in the URL (e.g., `/challenge/abc-123`)
- Shareable links - anyone with the link can view/log the challenge
- Settings are per-challenge, not global

### Global Components
| Component | File | Description |
|-----------|------|-------------|
| `Header` | `src/lib/components/Header.svelte` | Reusable header with title, back button, optional right slot |
| `ThemeSwitcher` | `src/lib/components/ThemeSwitcher.svelte` | Theme dropdown/modal |
| `LoadingOverlay` | `src/lib/components/LoadingOverlay.svelte` | Full-screen loader (theme-aware) |
| `Toast` | `src/lib/components/Toast.svelte` | Toast notifications (theme-aware) |
| `Modal` | `src/lib/components/Modal.svelte` | Confirmation dialogs (theme-aware) |

### Global State (`src/lib/state.svelte.ts`)
- `submitting` - Controls global loading overlay
- `navigating` - Shows loader during page navigation
- `toast` - Shows toast notifications
- `modal` - Shows confirmation modals

## Data Model (Turso/SQLite)

```sql
-- Active challenges
CREATE TABLE challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT UNIQUE NOT NULL,
  participants TEXT NOT NULL,           -- JSON array: '["N","L"]'
  prize TEXT NOT NULL,
  km_goal REAL NOT NULL,
  runs_goal INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Activities logged during challenges
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id INTEGER NOT NULL,
  participant TEXT NOT NULL,            -- e.g., 'N', 'L', 'John'
  distance_km REAL NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- Archived completed challenges
CREATE TABLE challenge_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_uuid TEXT NOT NULL,
  participants TEXT NOT NULL,
  prize TEXT NOT NULL,
  km_goal REAL NOT NULL,
  runs_goal INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  total_runs INTEGER NOT NULL,
  total_km REAL NOT NULL,
  won INTEGER NOT NULL,                -- 1 if goals met, 0 otherwise
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Database Operations (`src/lib/server/db.ts`)

| Function | Description |
|----------|-------------|
| `initDb()` | Creates fresh tables on server startup (drops existing) |
| `createChallenge(participants, prize, kmGoal, runsGoal)` | Creates new challenge, returns UUID |
| `getChallengeByUuid(uuid)` | Gets challenge by UUID |
| `updateChallenge(uuid, prize, kmGoal, runsGoal)` | Updates challenge settings |
| `deleteChallenge(uuid)` | Deletes challenge and its activities |
| `addActivity(challengeId, participant, distanceKm, date)` | Logs a run |
| `getChallengeStats(challengeId, participants)` | Aggregates stats (total runs, km, per-participant) |
| `getChallengeActivities(challengeId)` | Gets all activities for a challenge |
| `deleteActivity(activityId)` | Deletes a logged activity |
| `archiveChallenge(...)` | Moves completed challenge to history |
| `getChallengeHistory()` | Gets all archived challenges |
| `getActiveChallenges()` | Gets active challenges with progress stats and hasWon flag |

## UI Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with navbar, theme switcher, hero, stats, how-it-works |
| `/start` | Create new challenge (random participant names, set prize & goals) |
| `/challenge/[uuid]` | Main dashboard with progress, celebration, log run |
| `/challenge/[uuid]/settings` | Edit prize/goals, delete challenge |
| `/settings` | App settings (theme selector, extensible for more settings) |
| `/history` | Challenge history with Active/Completed/Past sections |
| `/history/[id]` | Past challenge details |

## Homepage Features (`/`)
- Sticky navbar with theme switcher, History link, Settings link
- Hero section with "RUN TOGETHER. WIN TOGETHER." messaging
- Stats bar (7 Days, Any Participants, Custom Prize)
- "How It Works" 3-step card layout
- Theme switcher (dropdown on desktop, modal on mobile)
- Fully theme-aware with all 31 daisyUI themes

## Challenge Dashboard Features (`/challenge/[uuid]`)
- Reusable Header component with back button and settings gear
- Hero section with prize display
- Progress bars for runs and km goals
- Days remaining countdown
- "CHALLENGE COMPLETE!" banner when goals are met
- Floating circular "Log Run" button (FAB) - hidden when complete
- Modal form to log runs (resets to defaults on open)
- Details toggle to see per-participant stats
- Confetti celebration on run logging and challenge completion

## Settings Pages

### App Settings (`/settings`)
- Reusable Header component
- Theme selector with collapsible categories (Light, Dark, Creative)
- "More settings coming soon" placeholder for future expansion
- Uses same localStorage theme key as ThemeSwitcher

### Challenge Settings (`/challenge/[uuid]/settings`)
- Reusable Header component
- Edit prize, km goal, runs goal
- Delete challenge button (red outlined in header)

## History Pages

### History List (`/history`)
- Reusable Header component
- Three sections: Active, Completed, Past
- Progress bars for active challenges
- "Completed" label when goal is met
- Delete button for each challenge

### Past Challenge Details (`/history/[id]`)
- Reusable Header component with delete button
- Challenge result banner (won/lost)
- Prize display
- Participant badges
- Progress bars for runs and distance

## Reusable Components

### Header Component (`src/lib/components/Header.svelte`)
```svelte
<Header title="Page Title" backLink="/">
  {#snippet rightSlot()}
    <!-- optional buttons on the right -->
  {/snippet}
</Header>
```

Features:
- Sticky navbar with backdrop blur
- Back button (left) and title
- Optional right slot for action buttons (settings, delete, etc.)
- Used across: homepage, settings, history, challenge pages

### ThemeSwitcher Component (`src/lib/components/ThemeSwitcher.svelte`)
- Desktop: dropdown with all 31 themes
- Mobile: button that opens fullscreen modal with theme grid
- Uses `data-theme` attribute on `<html>` element
- Persists selection to localStorage

## Challenge Lifecycle
1. **Create**: User visits `/start`, gets random participant names, sets prize/goals
2. **Active**: 7-day challenge period, can log runs
3. **Complete**: Banner shows when goals met, can still log runs
4. **End**: After 7 days, auto-archives to history
5. **Delete**: Can delete from history or settings via modal confirmation

## UI/UX Features
- Mobile-first responsive design
- Global loading overlay during form submissions and navigation (theme-aware)
- Toast notifications for actions (theme-aware)
- Confirmation modals for destructive actions (theme-aware)
- Confetti celebrations on run logging and challenge completion
- Theme system with 31 daisyUI themes
- Theme switcher in navbar and settings page
- Theme persists across page reloads (no flash)
- Forest theme as default for first-time visitors

## Setup

1. Copy `.env.example` to `.env`
2. Add Turso credentials:
   - `TURSO_DATABASE_URL`: libsql://your-database.turso.io
   - `TURSO_AUTH_TOKEN`: your auth token
3. Run `npm run dev` for local development
4. Deploy to Vercel with `npm run build`

## Important Files

| File | Purpose |
|------|---------|
| `src/app.html` | HTML template with theme defaults and inline script |
| `src/app.css` | Tailwind + daisyUI config with `themes: all` |
| `src/routes/+layout.svelte` | Root layout with theme loading onMount |
| `src/lib/server/db.ts` | Database schema and all CRUD operations |
| `src/lib/state.svelte.ts` | Global app state (loading, toast, modal) |
| `src/lib/components/Header.svelte` | Reusable header component |
| `src/lib/components/ThemeSwitcher.svelte` | Theme dropdown/modal |
| `src/lib/components/LoadingOverlay.svelte` | Global loading spinner (theme-aware) |
| `src/lib/components/Toast.svelte` | Toast notifications (theme-aware) |
| `src/lib/components/Modal.svelte` | Reusable confirmation modal (theme-aware) |
| `src/hooks.server.ts` | Server initialization (calls `initDb()`) |
| `src/routes/+page.svelte` | Homepage with navbar and hero |
| `src/routes/start/+page.svelte` | Challenge creation form |
| `src/routes/settings/+page.svelte` | App settings page |
| `src/routes/challenge/[uuid]/+page.svelte` | Main dashboard |
| `src/routes/challenge/[uuid]/+page.server.ts` | Dashboard data loading and actions |
| `src/routes/challenge/[uuid]/settings/+page.svelte` | Challenge settings page |
| `src/routes/history/+page.svelte` | Challenge history (Active/Completed/Past) |
| `src/routes/history/[id]/+page.svelte` | Past challenge details |

## Acceptance Criteria

- [x] Can click "Start New Challenge" to begin 7-day period
- [x] Dashboard shows accurate progress toward configurable goals
- [x] Prize prominently displayed on dashboard
- [x] Can log activities with participant and distance
- [x] Can update prize and goals in settings
- [x] Shows days remaining in challenge
- [x] Details toggle shows individual participant stats
- [x] Big floating "Log Run" button on mobile
- [x] Global loading overlay during submissions (theme-aware)
- [x] Toast notifications for feedback (theme-aware)
- [x] Confirmation modals for delete actions (theme-aware)
- [x] Confetti celebrations
- [x] History page shows Active/Completed/Past sections
- [x] Progress bars in history for active challenges
- [x] Deployable to Vercel with Turso
- [x] Theme system with 31 daisyUI themes
- [x] Theme switcher in navbar and settings page
- [x] Theme persists across page reloads
- [x] Forest theme as default
- [x] No theme flash on page load
- [x] Reusable Header component across all pages
- [x] App settings page for theme selection

## Roadmap

See `roadmap/index.md` for future features including Bitcoin/Sats prize support.
