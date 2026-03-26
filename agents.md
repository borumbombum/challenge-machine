# Running Challenge App - Project Specification

## Goal
Build a fun, motivating SvelteKit + Tailwind + daisyUI web app for tracking a weekly running/walking challenge between participants. Shareable via UUID links.

## Weekly Goals (Configurable)
- **Activity Count**: At least X runs/walks per week (default: 6)
- **Distance**: At least Y km per week (default: 30km)
- Team effort - no need to split equally

## Challenge Period
- Manual "Start Challenge" button triggers a 7-day period
- Progress tracked for exactly 7 days from start
- After 7 days, challenge auto-archives to history and user can start a new one
- Challenges stay active until end date even after goals are met

## Tech Stack
- SvelteKit (Svelte 5) + TypeScript
- Tailwind CSS + daisyUI
- Turso (libSQL) for SQLite on Vercel
- Deployed on Vercel (free tier)

## Architecture

### URL-Based State
- Each challenge gets a unique UUID in the URL (e.g., `/challenge/abc-123`)
- Shareable links - anyone with the link can view/log the challenge
- Settings are per-challenge, not global

### Dynamic Participants
- Participants are stored as JSON array in database
- Add/remove participants when creating a challenge
- Random funny names suggested on each new challenge creation
- Stats aggregated for all participants combined

### Global State (`src/lib/state.svelte.ts`)
- `submitting` - Controls global loading overlay
- `navigating` - Shows loader during page navigation
- `toast` - Shows toast notifications
- `modal` - Shows confirmation modals

### Global Components
- `LoadingOverlay.svelte` - Full-screen loader during form submissions and navigation
- `Toast.svelte` - Toast notifications (auto-dismiss after 3s)
- `Modal.svelte` - Reusable confirmation dialogs

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
| `/` | Landing page with "Start New Challenge" button |
| `/start` | Create new challenge (random participant names, set prize & goals) |
| `/challenge/[uuid]` | Main dashboard with progress, celebration, log run |
| `/challenge/[uuid]/settings` | Edit prize/goals, delete challenge |
| `/history` | Challenge history with Active/Completed/Past sections |
| `/history/[id]` | Past challenge details |

## Dashboard Features (`/challenge/[uuid]`)
- Hero section with prize display
- Progress bars for runs and km goals
- Days remaining countdown
- "CHALLENGE COMPLETE!" banner when goals are met
- Floating circular "Log Run" button (FAB)
- Modal form to log runs (resets to defaults on open)
- Details toggle to see per-participant stats
- Mobile bottom navigation bar
- Confetti celebration on run log and challenge completion
- Log Run button hidden when challenge is complete

## History Page Features
Three sections:
1. **Active Challenges** - Ongoing challenges with progress bars, shows "Completed" when goal met
2. **Completed** - Challenges where goals are met (still accessible until end date)
3. **Past Challenges** - Archived challenges (by end date)

## Challenge Lifecycle
1. **Create**: User visits `/start`, gets random participant names, sets prize/goals
2. **Active**: 7-day challenge period, can log runs
3. **Complete**: Banner shows when goals met, can still log runs
4. **End**: After 7 days, auto-archives to history
5. **Delete**: Can delete from history or settings via modal confirmation

## UI/UX Features
- Mobile-first responsive design
- Global loading overlay during form submissions and navigation
- Toast notifications for actions (e.g., "Challenge deleted")
- Confirmation modals for destructive actions
- Confetti celebrations on run logging and challenge completion
- Progress bars in history list for active challenges
- "Completed" label appears on the right side of progress when goal is met

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
| `src/lib/server/db.ts` | Database schema and all CRUD operations |
| `src/lib/state.svelte.ts` | Global app state (loading, toast, modal) |
| `src/lib/components/LoadingOverlay.svelte` | Global loading spinner |
| `src/lib/components/Toast.svelte` | Toast notifications |
| `src/lib/components/Modal.svelte` | Reusable confirmation modal |
| `src/hooks.server.ts` | Server initialization (calls `initDb()`) |
| `src/routes/+page.svelte` | Landing page |
| `src/routes/start/+page.svelte` | Challenge creation form |
| `src/routes/challenge/[uuid]/+page.svelte` | Main dashboard |
| `src/routes/challenge/[uuid]/+page.server.ts` | Dashboard data loading and actions |
| `src/routes/challenge/[uuid]/settings/+page.svelte` | Settings page |
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
- [x] Mobile-friendly design with bottom navigation
- [x] Global loading overlay during submissions
- [x] Toast notifications for feedback
- [x] Confirmation modals for delete actions
- [x] Confetti celebrations
- [x] History page shows Active/Completed/Past sections
- [x] Progress bars in history for active challenges
- [x] Deployable to Vercel with Turso
