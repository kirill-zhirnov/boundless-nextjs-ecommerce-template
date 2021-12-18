import {TThumbMode, TThumbQuality, TThumbRatio} from '../../@types/image';

const defaultOptions = {
	mode: TThumbMode.scale,
	'max-size': 200
};

export function getImageUrl(localUrl: string, options: IThumbQuery = defaultOptions): string {
	const baseUrl = process.env.BOUNDLESS_MEDIA_PREFIX || '';
	const params = Object.entries(Object.assign(defaultOptions, options)).map(
		([key, value]) => `${key}=${value}`
	).join('&');

	return `${baseUrl}/${localUrl}?${params}`;
}

interface IThumbQuery {
	mode?: TThumbMode;
	'max-size'?: number;
	q?: TThumbQuality;
	grayscale?: number;
	pad?: number;
	blur?: number;
	ratio?: TThumbRatio;
	bg?: string;
}
