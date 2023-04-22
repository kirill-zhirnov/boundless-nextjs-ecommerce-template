import {TThumbRatio} from 'boundless-api-client';
import {apiClient} from './api';

//fixed aspect ratio for product images
export const productImgRatio = process.env.BOUNDLESS_PRODUCTS_IMAGE_PROPORTION as TThumbRatio || null;

export function getProductsListImg(image: IImagePartial, maxSize: number): IImageData {
	const {width, height, path: imgLocalPath} = image;

	const thumb = apiClient.makeThumb({imgLocalPath, maxSize});
	if (productImgRatio) {
		thumb
			.setRatio(productImgRatio)
			.setPad(true)
		;
	}

	if (!width || !height) {
		return {src: thumb.getSrc()};
	}

	thumb.setOriginalSize(width, height);

	const imgAttrs = thumb.getAttrs();

	thumb
		.setGrayscale(true)
		.setBlur(2)
	;

	return {
		...imgAttrs,
		blurSrc: thumb.getSrc()
	};
}

export function getProductImg(image: IImagePartial, maxSize: number, preserveRatio: boolean = false): IImageData {
	const {width, height, path: imgLocalPath} = image;
	if (height && width) {
		const thumb = apiClient.makeThumb({
			imgLocalPath,
			maxSize,
			originalWidth: width,
			originalHeight: height
		});

		if (productImgRatio && preserveRatio) thumb.setRatio(productImgRatio);

		const attrs = thumb.getAttrs();
		thumb.setGrayscale(true);
		thumb.setBlur(2);

		return {
			...attrs,
			blurSrc: thumb.getSrc()
		};
	}

	return {
		src: apiClient.makeThumb({
			imgLocalPath,
			maxSize
		}).getSrc()
	};
}

export function getMetaImgUrl(image: IImagePartial): string {
	const thumb = apiClient.makeThumb({
		imgLocalPath: image.path,
		maxSize: 400
	});
	thumb.setRatio(TThumbRatio['1-1']);
	thumb.setPad(true);

	return thumb.getSrc();
}

export function getCategoryImg(image: IImagePartial, maxSize: number = 21): IImageData {
	const {width, height, path: imgLocalPath} = image;

	const thumb = apiClient.makeThumb({
		imgLocalPath,
		maxSize
	});

	if (width && height) {
		thumb.setOriginalSize(width, height);

		return thumb.getAttrs();
	}

	return {src: thumb.getSrc()};
}

export function getManufacturerImg(image: IImagePartial, maxSize: number = 200): IImageData {
	const {width, height, path: imgLocalPath} = image;

	const thumb = apiClient.makeThumb({
		imgLocalPath,
		maxSize
	});

	if (width && height) {
		thumb.setOriginalSize(width, height);

		return thumb.getAttrs();
	}

	return {src: thumb.getSrc()};
}


export function getCartImg(imgLocalPath: string, maxSize: number = 60): string {
	return apiClient.makeThumb({
		imgLocalPath,
		maxSize
	}).getSrc();
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
