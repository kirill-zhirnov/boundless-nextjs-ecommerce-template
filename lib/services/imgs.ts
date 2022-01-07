import {TThumbRatio} from '../../@types/image';
import {apiClient} from './api';

//fixed aspect ratio for product images
const productImgRatio = process.env.BOUNDLESS_PRODUCTS_IMAGE_PROPORTION as TThumbRatio || null;

export function getProductsListImg(image: IImagePartial, maxSize: number): IImageData {
	const {width, height} = image;
	if (height && width) {
		const thumb = apiClient.makeThumb(image.path, maxSize, width, height);

		if (productImgRatio) thumb.setRatio(productImgRatio);

		const attrs = thumb.getAttrs();
		thumb.setGrayscale(true);
		thumb.setBlur(2);

		return {
			...attrs,
			blurSrc: thumb.getSrc()
		};
	}

	return {
		src: apiClient.makeThumb(image.path, maxSize).getSrc()
	};
}

export function getProductImg(image: IImagePartial, maxSize: number): IImageData {
	const {width, height} = image;
	if (height && width) {
		const thumb = apiClient.makeThumb(image.path, maxSize, width, height);

		if (productImgRatio) thumb.setRatio(productImgRatio);

		const attrs = thumb.getAttrs();
		thumb.setGrayscale(true);
		thumb.setBlur(2);

		return {
			...attrs,
			blurSrc: thumb.getSrc()
		};
	}

	return {
		src: apiClient.makeThumb(image.path, maxSize).getSrc()
	};
}

export function getMetaImgUrl(image: IImagePartial): string {
	const thumb = apiClient.makeThumb(image.path, 400);
	thumb.setRatio(TThumbRatio['1-1']);
	thumb.setPad(true);

	return thumb.getSrc();
}

export function getCategoryImg(localPath: string, maxSize: number = 21): string {
	return apiClient.makeThumb(localPath, maxSize).getSrc();
}

export function getCartImg(localPath: string, maxSize: number = 60): string {
	return apiClient.makeThumb(localPath, maxSize).getSrc();
}

export interface IImagePartial {
	path: string;
	width?: number | null;
	height?: number | null;
}

export interface IImageData {
	src: string;
	width?: number;
	height?: number;
	blurSrc?: string;
}
