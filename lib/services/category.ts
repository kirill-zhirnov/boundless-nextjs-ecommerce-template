import {IGetProductsParams} from 'boundless-api-client/endpoints/catalog';
import {TQuery} from '../../@types/common';

export const filterProductsQuery = (query: TQuery): IGetProductsParams => {
	const allowedKeys = ['in_stock', 'price_min', 'price_max', 'brand', 'sort', 'props', 'page', 'per-page'];
	const outQuery: IGetProductsParams = {};

	for (const [key, value] of Object.entries(query)) {
		if (!allowedKeys.includes(key)) continue;
		Object.assign(outQuery, {[key]: value});
	}

	return outQuery;
};