import accounting from 'accounting';

export function formatMoney(amount: number|string): string {
	return accounting.formatMoney(amount);
}