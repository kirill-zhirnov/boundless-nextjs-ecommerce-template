import {IProduct} from 'boundless-api-client/types/catalog/product';
import {ICategoryPartial} from '../../@types/category';

const CATEGORY_PREFIX = '/category';
const PRODUCTS_PREFIX = '/products';

export const getCategoryUrl = (category: ICategoryPartial) => {
	return category.custom_link || `${CATEGORY_PREFIX}/${category.url_key || category.category_id}`;
};

export const getProductUrl = (product: IProductUrlProps) => {
	return `${PRODUCTS_PREFIX}/${product.url_key || product.product_id}`;
};

type IProductUrlProps = Pick<IProduct, 'url_key' | 'product_id'>