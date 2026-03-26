import type { PageServerLoad, Actions } from './$types';
import { getChallengeById, client } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const challenge = await getChallengeById(parseInt(params.id));
	
	if (!challenge) {
		throw error(404, 'Challenge not found');
	}

	return { challenge };
};

export const actions: Actions = {
	default: async ({ params }) => {
		await client.execute('DELETE FROM challenge_history WHERE id = ?', [parseInt(params.id)]);
	}
};
