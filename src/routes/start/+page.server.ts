import type { PageServerLoad, Actions } from './$types';
import { createChallenge } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		
		const participants: string[] = [];
		let i = 0;
		while (formData.has(`participant_${i}`)) {
			const val = formData.get(`participant_${i}`) as string;
			if (val.trim()) {
				participants.push(val.trim());
			}
			i++;
		}

		const prize = formData.get('prize') as string;
		const kmGoal = parseFloat(formData.get('km_goal') as string);
		const runsGoal = parseInt(formData.get('runs_goal') as string);

		if (participants.length < 1 || !prize || isNaN(kmGoal) || isNaN(runsGoal)) {
			return { error: 'Please fill in all fields' };
		}

		const uuid = await createChallenge(participants, prize, kmGoal, runsGoal);
		throw redirect(303, `/challenge/${uuid}`);
	}
};