import {IFinalPrice} from 'boundless-api-client';

export interface IPriceForTpl {
	price: string|null,
	oldPrice?: string|null,
	isFrom?: boolean
}

export const getPriceForTpl = (price: IFinalPrice|null): IPriceForTpl => {
	if (!price) {
		return {price: null};
	}

	return {
		price: price.min ? price.min : price.value,
		oldPrice: price.old_min ? price.old_min : price.old,
		isFrom: (price.min && price.max && price.min != price.max) ? true : false
	};
};

export const findSellingPrice = (prices: IFinalPrice[]): IFinalPrice|undefined => {
	return findPriceByAlias(prices, 'selling_price');
};

export const findPriceByAlias = (prices: IFinalPrice[], alias: string): IFinalPrice|undefined => {
	return prices.find(({price_alias}) => price_alias === alias);
};