import {IProductPrice} from 'boundless-api-client/types/catalog/product';

export interface IPriceForTpl {
	price: number|null,
	oldPrice?: number|null,
	isFrom?: boolean
}

export const getPriceForTpl = (price: IProductPrice|null): IPriceForTpl => {
	if (!price) {
		return {price: null};
	}

	return {
		price: price.min ? price.min : price.value,
		oldPrice: price.old_min ? price.old_min : price.old,
		isFrom: (price.min && price.max && price.min != price.max) ? true : false
	};
};