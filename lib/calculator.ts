import currency from 'currency.js';

export const calcTotal = (items: ICalcTotalItem[]) => {
	let totalQty = 0;
	let totalPrice = currency(0);

	for (const {qty, price} of items) {
		totalQty += qty;
		totalPrice = currency(totalPrice).add(price);
	}
	return {
		qty: totalQty,
		price: totalPrice.toString()
	};
};

export const calcTotalPrice = (finalPrice: number|string, qty: number): string => {
	return currency(finalPrice).multiply(qty * 1).toString();
};

interface ICalcTotalItem {
	qty: number;
	price: string|number;
}