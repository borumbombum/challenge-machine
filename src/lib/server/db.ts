import { createClient } from '@libsql/client';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { randomUUID } from 'crypto';

const client = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});

export async function initDb() {
	await client.execute(`
		CREATE TABLE IF NOT EXISTS challenges (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			uuid TEXT UNIQUE NOT NULL,
			participants TEXT NOT NULL,
			prize TEXT NOT NULL,
			km_goal REAL NOT NULL,
			runs_goal INTEGER NOT NULL,
			start_date TEXT NOT NULL,
			end_date TEXT NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP
		)
	`);

	await client.execute(`
		CREATE TABLE IF NOT EXISTS activities (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			challenge_id INTEGER NOT NULL,
			participant TEXT NOT NULL,
			distance_km REAL NOT NULL,
			date TEXT NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (challenge_id) REFERENCES challenges(id)
		)
	`);

	await client.execute(`
		CREATE TABLE IF NOT EXISTS challenge_history (
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
			won INTEGER NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP
		)
	`);
}

export async function createChallenge(
	participants: string[],
	prize: string,
	kmGoal: number,
	runsGoal: number
): Promise<string> {
	const uuid = randomUUID();
	const now = new Date();
	const startDate = now.toISOString().split('T')[0];
	const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
		.toISOString()
		.split('T')[0];

	await client.execute(
		`INSERT INTO challenges (uuid, participants, prize, km_goal, runs_goal, start_date, end_date)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[uuid, JSON.stringify(participants), prize, kmGoal, runsGoal, startDate, endDate]
	);

	return uuid;
}

export async function getChallengeByUuid(uuid: string) {
	const { rows } = await client.execute(
		'SELECT * FROM challenges WHERE uuid = ?',
		[uuid]
	);
	if (rows.length === 0) return null;
	const row = rows[0] as any;
	return {
		id: row.id,
		uuid: row.uuid,
		participants: JSON.parse(row.participants),
		prize: row.prize,
		km_goal: row.km_goal,
		runs_goal: row.runs_goal,
		start_date: row.start_date,
		end_date: row.end_date,
		created_at: row.created_at
	};
}

export async function updateChallenge(
	uuid: string,
	prize: string,
	kmGoal: number,
	runsGoal: number
) {
	await client.execute(
		'UPDATE challenges SET prize = ?, km_goal = ?, runs_goal = ? WHERE uuid = ?',
		[prize, kmGoal, runsGoal, uuid]
	);
}

export async function deleteChallenge(uuid: string) {
	const challenge = await getChallengeByUuid(uuid);
	if (challenge) {
		await client.execute('DELETE FROM activities WHERE challenge_id = ?', [challenge.id]);
		await client.execute('DELETE FROM challenges WHERE uuid = ?', [uuid]);
	}
}

export async function getChallengeActivities(challengeId: number) {
	const { rows } = await client.execute(
		'SELECT * FROM activities WHERE challenge_id = ? ORDER BY date DESC, created_at DESC',
		[challengeId]
	);
	return rows as {
		id: number;
		challenge_id: number;
		participant: string;
		distance_km: number;
		date: string;
		created_at: string;
	}[];
}

export async function addActivity(
	challengeId: number,
	participant: string,
	distanceKm: number,
	date: string
) {
	await client.execute(
		'INSERT INTO activities (challenge_id, participant, distance_km, date) VALUES (?, ?, ?, ?)',
		[challengeId, participant, distanceKm, date]
	);
}

export async function getChallengeStats(challengeId: number, participants: string[]) {
	const participantChecks = participants.map(p => 
		`SUM(CASE WHEN participant = '${p}' THEN 1 ELSE 0 END) as runs_${p.replace(/\s/g, '_')}`
	).join(', ');
	
	const kmChecks = participants.map(p => 
		`COALESCE(SUM(CASE WHEN participant = '${p}' THEN distance_km ELSE 0 END), 0) as km_${p.replace(/\s/g, '_')}`
	).join(', ');

	const { rows } = await client.execute(`
		SELECT 
			COUNT(*) as total_runs,
			COALESCE(SUM(distance_km), 0) as total_km,
			${participantChecks},
			${kmChecks}
		FROM activities 
		WHERE challenge_id = ?
	`, [challengeId]);

	const row = rows[0] as any;
	const stats: any = {
		total_runs: row.total_runs,
		total_km: row.total_km
	};
	
	participants.forEach(p => {
		const key = `runs_${p.replace(/\s/g, '_')}`;
		stats[`runs_${p.replace(/\s/g, '_')}`] = row[key] || 0;
		const kmKey = `km_${p.replace(/\s/g, '_')}`;
		stats[`km_${p.replace(/\s/g, '_')}`] = row[kmKey] || 0;
	});
	
	return stats;
}

export async function deleteActivity(activityId: number) {
	await client.execute('DELETE FROM activities WHERE id = ?', [activityId]);
}

export async function archiveChallenge(
	challengeUuid: string,
	participants: string[],
	prize: string,
	kmGoal: number,
	runsGoal: number,
	startDate: string,
	endDate: string,
	totalRuns: number,
	totalKm: number,
	won: boolean
) {
	await client.execute(
		`INSERT INTO challenge_history (challenge_uuid, participants, prize, km_goal, runs_goal, start_date, end_date, total_runs, total_km, won)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[challengeUuid, JSON.stringify(participants), prize, kmGoal, runsGoal, startDate, endDate, totalRuns, totalKm, won ? 1 : 0]
	);
}

export async function getChallengeHistory() {
	const { rows } = await client.execute(
		'SELECT * FROM challenge_history ORDER BY start_date DESC'
	);
	return rows.map((row: any) => ({
		...row,
		participants: JSON.parse(row.participants)
	}));
}

export async function getActiveChallenges() {
	const now = new Date().toISOString().split('T')[0];
	const { rows } = await client.execute(
		'SELECT * FROM challenges WHERE end_date >= ? ORDER BY start_date DESC',
		[now]
	);
	
	const challenges = rows.map((row: any) => ({
		...row,
		participants: JSON.parse(row.participants)
	}));
	
	for (const challenge of challenges) {
		const stats = await getChallengeStats(challenge.id, challenge.participants);
		challenge.total_runs = stats.total_runs;
		challenge.total_km = stats.total_km;
		challenge.hasWon = stats.total_runs >= challenge.runs_goal && stats.total_km >= challenge.km_goal;
	}
	
	return challenges;
}

export async function getChallengeById(historyId: number) {
	const { rows } = await client.execute(
		'SELECT * FROM challenge_history WHERE id = ?',
		[historyId]
	);
	if (rows.length === 0) return null;
	const row = rows[0] as any;
	return {
		...row,
		participants: JSON.parse(row.participants)
	};
}

export { client };