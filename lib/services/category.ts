import {IGetProductsParams} from 'boundless-api-client/endpoints/catalog';
import {ICategoryFlatItem, ICategoryItem} from 'boundless-api-client/types/catalog/category';
import {TQuery} from '../../@types/common';

export const getMenu4Category = (category: ICategoryItem): ICategoryFlatItem[] => {
	const categoryMenu: ICategoryFlatItem[] = [];
	const {parent_id, siblings, children} = category;

	if (children && children.length > 0) {
		categoryMenu.push(...children);
	} else if (siblings && siblings.length > 0) {
		const filteredSiblings = siblings.filter(elem => elem.parent_id === parent_id);
		categoryMenu.push(...filteredSiblings);
	}

	return categoryMenu;
};

export const filterProductsQuery = (query: TQuery): IGetProductsParams => {
	const allowedKeys = ['in_stock', 'price_min', 'price_max', 'brand', 'sort', 'props', 'page', 'per-page'];
	const outQuery: IGetProductsParams = {};

	for (const [key, value] of Object.entries(query)) {
		if (!allowedKeys.includes(key)) continue;
		Object.assign(outQuery, {[key]: value});
	}

	return outQuery;
};