import {IProductItem} from 'boundless-api-client';
import {getMetaImgUrl} from './imgs';
import {getCanonicalProductUrl} from './urls';

export const getProductMetaData = (product: IProductItem) => {
	if (!product) return {};

	return {
		canonicalUrl: getCanonicalProductUrl(product),
		imgUrl: product.images?.length ? getMetaImgUrl(product.images[0].image) : null,
		description: product.text?.meta_description || null,
	};
};