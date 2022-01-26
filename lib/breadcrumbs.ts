import {ICategoryFlatItem} from 'boundless-api-client';
import {TQuery} from '../@types/common';
import {IBreadCrumbItem} from '../@types/components';
import {getCategoryUrl} from './urls';

export const makeBreadCrumbsFromCats = (categories: ICategoryFlatItem[], activeParams?: TQuery): IBreadCrumbItem[] => {
	if (!categories || !categories.length) return [];

	return [...categories].reverse().map((parent, i) => {
		const title = (parent.title || parent.joined_title) as string;
		const isLast = categories.length === i + 1;
		const url = isLast ? getCategoryUrl(parent, activeParams) : getCategoryUrl(parent);

		return ({
			title,
			url,
			isActive: isLast && !activeParams
		});
	});
};