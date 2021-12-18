import {apiClient} from './api';

export function getProductsListImg(localPath: string, maxSize: number): string {
	return apiClient.makeThumb(localPath, maxSize).getSrc();
}