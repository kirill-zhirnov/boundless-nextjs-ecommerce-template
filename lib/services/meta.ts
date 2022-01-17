import {ICategoryItem, IProductItem} from 'boundless-api-client';
import {getMetaImgUrl} from './imgs';
import {getCanonicalCategoryUrl, getCanonicalProductUrl} from './urls';

export const getProductMetaData = (product: IProductItem) => {
	if (!product) return {};

	return {
		canonicalUrl: getCanonicalProductUrl(product),
		imgUrl: product.images?.length ? getMetaImgUrl(product.images[0].image) : null,
		description: product.text?.meta_description || null,
	};
};

export const getCategoryMetaData = (category: ICategoryItem) => {
	if (!category) return {};

	return {
		canonicalUrl: getCanonicalCategoryUrl(category),
		imgUrl: category.image ? getMetaImgUrl(category.image) : null,
		description: category.text?.meta_description || null,
	};
};