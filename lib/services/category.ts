import {IGetProductsParams} from 'boundless-api-client/endpoints/catalog';
import {ICategoryFlatItem, ICategoryItem} from 'boundless-api-client/types/catalog/category';

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

export const getProductsQuery4Category = (categoryId: number, query: {[key: string]: any}): IGetProductsParams => {
	const allowedKeys = ['in_stock', 'price_min', 'price_max', 'brand', 'sort', 'page', 'per-page'];
	const outQuery: IGetProductsParams = {};

	for (const [key, value] of Object.entries(query)) {
		if (!allowedKeys.includes(key)) continue;
		Object.assign(outQuery, {[key]: value});
	}

	Object.assign(outQuery, {
		category: [categoryId]
	});

	return outQuery;
};