import {ICategory} from 'boundless-api-client';
import {IProduct} from 'boundless-api-client/types/catalog/product';

const CATEGORY_PREFIX = '/category';
const PRODUCTS_PREFIX = '/products';

export const getCategoryUrl = (category: ICategoryUrlPartial) => {
	return category.custom_link || `${CATEGORY_PREFIX}/${category.url_key || category.category_id}`;
};

export const getProductUrl = (product: IProductUrlProps) => {
	return `${PRODUCTS_PREFIX}/${product.url_key || product.product_id}`;
};

type IProductUrlProps = Pick<IProduct, 'url_key' | 'product_id'>
type ICategoryUrlPartial = Pick<ICategory, 'url_key'|'category_id'|'custom_link'>;
