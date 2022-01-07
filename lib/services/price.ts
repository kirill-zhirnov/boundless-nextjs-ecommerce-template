import {IProductVariant} from 'boundless-api-client';
import {calcBenefit} from '../calculator';
import currency from 'currency.js';

export const getLowestPrice = (variants: IProductVariant[]): IPrice => {
	if (!variants || !variants.length) 	return {
		price: 0,
		price_old: null,
		benefit: null
	};

	const [lowest] = variants.sort((el1, el2) => {
		if (parseInt(el1.price) > parseInt(el2.price)) return 1;
		if (parseInt(el1.price) < parseInt(el2.price)) return -1;
		return 0;
	});

	return {
		price: currency(lowest.price).format(),
		price_old: lowest.price_old && currency(lowest.price_old).format() ,
		benefit: calcBenefit(lowest.price, lowest.price_old)
	};
};

export const getProductPrice = (price: number, price_old: number|null): IPrice => {
	return {
		price: currency(price).format(),
		price_old: price_old && currency(price_old).format() ,
		benefit: calcBenefit(price, price_old)
	};
};

export interface IPrice {
	price: string|number;
	price_old: string|number|null;
	benefit: string|number|null;
}