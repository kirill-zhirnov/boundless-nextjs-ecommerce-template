import {ICategory, ICategoryItem} from 'boundless-api-client';
import {IProduct, IProductItem} from 'boundless-api-client/types/catalog/product';
import {createGetStr} from 'boundless-api-client/utils';
import {TQuery} from '../@types/common';

const CATEGORY_PREFIX = '/category';
const PRODUCTS_PREFIX = '/product';
const shopBaseUrl = process.env.BOUNDLESS_BASE_URL || '';

export const getCategoryUrl = (category: ICategoryUrlPartial, params?: TQuery) => {
	const basePath = category.custom_link || `${CATEGORY_PREFIX}/${category.url_key || category.category_id}`;
	const queryStr = params && Object.keys(params).length ? `?${createGetStr(params)}`: '';

	return `${basePath}${queryStr}`;
};

export const getCategoryItemUrl = (category: ICategoryItem, params?: TQuery) => {
	const baseUrl = category.props?.custom_link || `${CATEGORY_PREFIX}/${category.text?.url_key || category.category_id}`;
	const queryStr = params && Object.keys(params).length ? `?${createGetStr(params)}`: '';

	return `${baseUrl}${queryStr}`;
};

export const getProductUrl = (product: IProductUrlProps, params?: TQuery) => {
	const basePath = `${PRODUCTS_PREFIX}/${product.url_key || product.product_id}`;
	const queryStr = params && Object.keys(params).length ? `?${createGetStr(params)}`: '';

	return `${basePath}${queryStr}`;
};

export const getProductItemUrl = (product: IProductItem, params?: TQuery) => {
	const basePath = `${PRODUCTS_PREFIX}/${product.text?.url_key || product.product_id}`;
	const queryStr = params && Object.keys(params).length ? `?${createGetStr(params)}`: '';

	return `${basePath}${queryStr}`;
};

export const getCanonicalProductUrl = (product: IProductItem) => {
	return `${shopBaseUrl}${getProductItemUrl(product)}`;
};

export const getCanonicalCategoryUrl = (category: ICategoryItem) => {
	return `${shopBaseUrl}${getCategoryItemUrl(category)}`;
};

type IProductUrlProps = Pick<IProduct, 'url_key' | 'product_id'>
type ICategoryUrlPartial = Pick<ICategory, 'url_key'|'category_id'|'custom_link'>;
