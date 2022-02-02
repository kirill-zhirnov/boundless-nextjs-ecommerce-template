import {ICategoryFlatItem} from 'boundless-api-client';
import {TQuery} from '../@types/common';
import {IBreadCrumbItem} from '../@types/components';
import {getCategoryUrl} from './urls';

export const makeBreadCrumbsFromCats = (
	categories: ICategoryFlatItem[],
	onItem?: (category: ICategoryFlatItem) => IOnItemResponse
): IBreadCrumbItem[] => {

	return [...categories].reverse().map(category => {
		const {isActive, queryParams} = onItem ? onItem(category) : {} as IOnItemResponse;
		const url = getCategoryUrl(category, queryParams || {});

		return ({
			title: category.title,
			url,
			isActive: Boolean(isActive)
		});
	});
};

interface IOnItemResponse {
	queryParams?: TQuery, isActive?: boolean
}