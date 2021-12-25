import {IFilterField, IFilterFieldRequest, TFilterFieldType, TFilterType} from 'boundless-api-client';
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

export const filterProductsQuery = (query: {[key: string]: any}, withPagination: boolean = true): IGetProductsParams => {
	const pagitationKeys = withPagination ? ['page', 'per-page'] : [];
	const allowedKeys = ['in_stock', 'price_min', 'price_max', 'brand', 'sort', ...pagitationKeys];
	const outQuery: IGetProductsParams = {};

	for (const [key, value] of Object.entries(query)) {
		if (!allowedKeys.includes(key)) continue;
		Object.assign(outQuery, {[key]: value});
	}

	return outQuery;
};

export const getFilterFieldsQuery = (fields: IFilterField[]) => {
	const requestFields: IFilterFieldRequest[] = [];

	for (const field of fields) {
		if (!(field.type in filterTypes)) continue;
		const out: IFilterFieldRequest = {
			type: filterTypes[field.type as keyof typeof filterTypes]
		};

		if (field.type === TFilterFieldType.characteristic && field.characteristic_id) {
			out.characteristic_id = field.characteristic_id;
		}
		requestFields.push(out);
	}

	return requestFields;
};

const filterTypes = {
	[TFilterFieldType.price]: TFilterType.price_range,
	[TFilterFieldType.brand]: TFilterType.manufacturer,
	[TFilterFieldType.characteristic]: TFilterType.characteristic
};