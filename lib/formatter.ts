import accounting from 'accounting';

export function formatMoney(amount: number|string|null): string {
	if (!amount) return '';
	return accounting.formatMoney(amount);
}