import type { PageServerLoad, Actions } from './$types';
import { getChallengeHistory, getActiveChallenges, client } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const history = await getChallengeHistory();
	const active = await getActiveChallenges();
	return { history, active };
};

export const actions: Actions = {
	deleteActive: async ({ request }) => {
		const formData = await request.formData();
		const uuid = formData.get('uuid') as string;
		const challenge = await client.execute('SELECT id FROM challenges WHERE uuid = ?', [uuid]);
		if (challenge.rows.length > 0) {
			await client.execute('DELETE FROM activities WHERE challenge_id = ?', [challenge.rows[0].id]);
			await client.execute('DELETE FROM challenges WHERE uuid = ?', [uuid]);
		}
		return { success: true };
	}
};
