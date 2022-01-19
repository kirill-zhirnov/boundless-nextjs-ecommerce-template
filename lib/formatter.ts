import currency from 'currency.js';

export function formatMoney(amount: number|string|null): string {
	if (!amount) return '';

	return new currency(amount).format();
}