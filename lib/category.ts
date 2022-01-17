import {IGetProductsParams} from 'boundless-api-client/endpoints/catalog';
import {TQuery} from '../@types/common';

export const filterKeys = ['brand', 'price_min', 'price_max', 'props', 'in_stock'];

export const filterProductsQuery = (query: TQuery, allowedKeys: string[]|null = null): IGetProductsParams => {
	if (allowedKeys === null) {
		allowedKeys = ['sort', 'page', 'per-page', ...filterKeys];
	}

	const outQuery: IGetProductsParams = {};

	for (const [key, value] of Object.entries(query)) {
		if (!allowedKeys.includes(key)) continue;
		Object.assign(outQuery, {[key]: value});
	}

	return outQuery;
};