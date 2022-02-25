import {ICategoryItem, IProductItem} from 'boundless-api-client';
import {getMetaImgUrl} from './imgs';
import {getCanonicalCategoryUrl, getCanonicalProductUrl} from './urls';

export const getProductMetaData = (product: IProductItem) => {
	return {
		canonicalUrl: getCanonicalProductUrl(product),
		imgUrl: product.images?.length ? getMetaImgUrl(product.images[0].image) : null,
		description: product.seo.metaDesc
	};
};

export const getCategoryMetaData = (category: ICategoryItem) => {
	if (!category) return {};

	return {
		canonicalUrl: getCanonicalCategoryUrl(category),
		imgUrl: category.image ? getMetaImgUrl(category.image) : null,
		description: category.seo.metaDesc
	};
};