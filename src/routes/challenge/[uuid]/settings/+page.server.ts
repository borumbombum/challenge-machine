import type { PageServerLoad, Actions } from './$types';
import { getChallengeByUuid, updateChallenge, client } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const challenge = await getChallengeByUuid(params.uuid);
	
	if (!challenge) {
		throw error(404, 'Challenge not found');
	}

	return { challenge };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const action = formData.get('action') as string;
		
		if (action === 'reset') {
			const challenge = await getChallengeByUuid(params.uuid);
			if (challenge) {
				await client.execute('DELETE FROM activities WHERE challenge_id = ?', [challenge.id]);
				await client.execute('DELETE FROM challenges WHERE uuid = ?', [params.uuid]);
			}
			throw redirect(303, '/?deleted=true');
		}
		
		const challenge = await getChallengeByUuid(params.uuid);
		if (!challenge) {
			throw error(404, 'Challenge not found');
		}

		const prize = formData.get('prize') as string;
		const kmGoal = parseFloat(formData.get('km_goal') as string);
		const runsGoal = parseInt(formData.get('runs_goal') as string);

		if (prize && !isNaN(kmGoal) && !isNaN(runsGoal)) {
			await updateChallenge(params.uuid, prize, kmGoal, runsGoal);
		}

		throw redirect(303, `/challenge/${params.uuid}?saved=true`);
	}
};