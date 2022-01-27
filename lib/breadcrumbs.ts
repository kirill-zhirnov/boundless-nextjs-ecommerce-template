import {ICategoryFlatItem} from 'boundless-api-client';
import {TQuery} from '../@types/common';
import {IBreadCrumbItem} from '../@types/components';
import {getCategoryUrl} from './urls';

export const makeBreadCrumbsFromCats = (categories: ICategoryFlatItem[], onItem: TOnCategoryItem): IBreadCrumbItem[] => {
	return [...categories].reverse().map(category => {
		const {isActive, queryParams} = onItem(category);
		const url = getCategoryUrl(category, queryParams || {});

		return ({
			title: category.title,
			url,
			isActive: Boolean(isActive)
		});
	});
};

type TOnCategoryItem = (category: ICategoryFlatItem) => ({queryParams?: TQuery, isActive?: boolean});