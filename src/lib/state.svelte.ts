class AppState {
	submitting = $state(false);
	navigating = $state(false);
	toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
	modal = $state<{
		open: boolean;
		title: string;
		message: string;
		confirmText: string;
		cancelText: string;
		onConfirm: (() => void) | null;
		type: 'danger' | 'warning' | 'info';
	} | null>(null);

	showToast(message: string, type: 'success' | 'error' = 'success') {
		this.toast = { message, type };
		setTimeout(() => {
			this.toast = null;
		}, 3000);
	}

	showModal(options: {
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm: () => void;
		type?: 'danger' | 'warning' | 'info';
	}) {
		this.modal = {
			open: true,
			title: options.title,
			message: options.message,
			confirmText: options.confirmText || 'Confirm',
			cancelText: options.cancelText || 'Cancel',
			onConfirm: options.onConfirm,
			type: options.type || 'danger'
		};
	}

	closeModal() {
		this.modal = null;
	}
}

export const appState = new AppState();
