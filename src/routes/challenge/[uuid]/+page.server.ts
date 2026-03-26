import type { PageServerLoad, Actions } from './$types';
import { getChallengeByUuid, getChallengeStats, getChallengeActivities, addActivity, deleteActivity, archiveChallenge, deleteChallenge } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const challenge = await getChallengeByUuid(params.uuid);
	
	if (!challenge) {
		throw error(404, 'Challenge not found');
	}

	const stats = await getChallengeStats(challenge.id, challenge.participants);
	const activities = await getChallengeActivities(challenge.id);

	const now = new Date();
	const endDate = new Date(challenge.end_date);
	const daysRemaining = Math.max(
		0,
		Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
	);

	const isComplete =
		stats.total_runs >= challenge.runs_goal &&
		stats.total_km >= challenge.km_goal;

	// Only archive when end date has passed (not when goals are met)
	const challengeEnded = now > endDate;
	if (challengeEnded) {
		const won = stats.total_runs >= challenge.runs_goal && stats.total_km >= challenge.km_goal;
		
		await archiveChallenge(
			challenge.uuid,
			challenge.participants,
			challenge.prize,
			challenge.km_goal,
			challenge.runs_goal,
			challenge.start_date,
			challenge.end_date,
			stats.total_runs,
			stats.total_km,
			won
		);
		
		// Delete the challenge
		await deleteChallenge(challenge.uuid);
		
		return {
			challenge: null,
			challengeEnded: true,
			isComplete: won,
			previousResult: {
				prize: challenge.prize,
				kmGoal: challenge.km_goal,
				runsGoal: challenge.runs_goal,
				totalRuns: stats.total_runs,
				totalKm: stats.total_km,
				won
			}
		};
	}

	return {
		challenge,
		stats,
		activities,
		daysRemaining,
		isComplete
	};
};

export const actions: Actions = {
	logActivity: async ({ request, params }) => {
		const challenge = await getChallengeByUuid(params.uuid);
		if (!challenge) {
			throw error(404, 'Challenge not found');
		}

		const formData = await request.formData();
		const participant = formData.get('participant') as string;
		const distanceKm = parseFloat(formData.get('distance_km') as string);
		const date = formData.get('date') as string;

		if (!participant || isNaN(distanceKm) || distanceKm <= 0) {
			return { error: 'Please fill in all fields correctly' };
		}

		await addActivity(challenge.id, participant, distanceKm, date);
	},
	deleteActivity: async ({ request, params }) => {
		const formData = await request.formData();
		const activityId = parseInt(formData.get('activityId') as string);
		if (activityId) {
			await deleteActivity(activityId);
		}
	},
	resetChallenge: async ({ params }) => {
		const challenge = await getChallengeByUuid(params.uuid);
		if (challenge) {
			await deleteChallenge(params.uuid);
		}
		throw redirect(303, '/');
	}
};