import {apiClient} from './api';

export function getProductsListImg(localPath: string, maxSize: number): string {
	return apiClient.makeThumb(localPath, maxSize).getSrc();
}

export function getCategoryImg(localPath: string, maxSize: number = 21): string {
	return apiClient.makeThumb(localPath, maxSize).getSrc();
}

export function getCartImg(localPath: string, maxSize: number = 60): string {
	return apiClient.makeThumb(localPath, maxSize).getSrc();
}
