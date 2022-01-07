import {ICategory} from 'boundless-api-client';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import {createGetStr} from 'boundless-api-client/utils';
import {TQuery} from '../../@types/common';

const CATEGORY_PREFIX = '/category';
const PRODUCTS_PREFIX = '/product';

export const getCategoryUrl = (category: ICategoryUrlPartial, params?: TQuery) => {
	const baseUrl = category.custom_link || `${CATEGORY_PREFIX}/${category.url_key || category.category_id}`;
	const queryStr = params && Object.keys(params).length ? `?${createGetStr(params)}`: '';

	return `${baseUrl}${queryStr}`;
};

export const getProductUrl = (product: IProductUrlProps, params?: TQuery) => {
	const baseUrl = `${PRODUCTS_PREFIX}/${product.url_key || product.product_id}`;
	const queryStr = params && Object.keys(params).length ? `?${createGetStr(params)}`: '';

	return `${baseUrl}${queryStr}`;
};

type IProductUrlProps = Pick<IProduct, 'url_key' | 'product_id'>
type ICategoryUrlPartial = Pick<ICategory, 'url_key'|'category_id'|'custom_link'>;
