// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare module 'canvas-confetti' {
	interface Options {
		particleCount?: number;
		angle?: number;
		spread?: number;
		origin?: { x: number; y: number };
		colors?: string[];
		shapes?: string[];
		scalar?: number;
		drift?: number;
		gravity?: number;
	}
	
	export default function confetti(options?: Options): Promise<void>;
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	
	const __APP_VERSION__: string;
}

export {};
