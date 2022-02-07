import {ICategory} from 'boundless-api-client/types/catalog/category';
import {getCategoryUrl} from './urls';
import {IMenuItem} from '../redux/reducers/menus';
import {getCategoryImg} from './imgs';

export const makeMenuByCategoryTree = ({categoryTree, isActiveClb}: {categoryTree: ICategory[], isActiveClb?: (category: ICategory) => boolean}): IMenuItem[] => {
	const menu = categoryTree.map(category => {
		const item: IMenuItem = {
			title: category.title,
			url: getCategoryUrl(category),
		};

		if (isActiveClb) {
			item.isActive = isActiveClb(category);
		}

		if (category.children) {
			item.children = makeMenuByCategoryTree({categoryTree: category.children, isActiveClb});
			if (item.children.some(el => el.isActive)) {
				item.isActive = true;
			}
		}

		if (category.image) {
			item.img = getCategoryImg(category.image, 21);
		}

		return item;
	});


	return menu;
};

export const makeAllMenus = ({categoryTree, activeCategoryId}: {categoryTree: ICategory[], activeCategoryId?: number}): IMenus => {
	const mainMenu = makeMenuByCategoryTree({
		categoryTree,
		isActiveClb: (category) => Boolean(activeCategoryId && activeCategoryId == category.category_id)
	});

	const footerMenu = makeMenuByCategoryTree({categoryTree: categoryTree.filter(({level}) => level === 0)});

	return {
		mainMenu,
		footerMenu
	};
};

interface IMenus {
	mainMenu: IMenuItem[],
	footerMenu: IMenuItem[]
}