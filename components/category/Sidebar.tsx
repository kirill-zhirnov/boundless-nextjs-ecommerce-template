import clsx from 'clsx';
import Link from 'next/link';
import {getCategoryImg} from '../../lib/imgs';
import {getCategoryUrl} from '../../lib/urls';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {ICategoryFlatItem, ICategoryItem} from 'boundless-api-client/types/catalog/category';
import {useMemo} from 'react';

export default function CategorySidebar({category}: {category: ICategoryItem}) {
	const categoryMenu = useMemo<ICategoryFlatItem[]>(() => {
		if (category.children?.length) {
			return Array.from(category.children);
		} else if (category.siblings?.length) {
			return category.siblings.filter(({parent_id}) => category.parent_id === parent_id);
		}

		return [];
	}, [category.category_id]); //eslint-disable-line

	const parentsBreadCrumbs = useMemo<ICategoryFlatItem[]>(() => {
		if (category.parent_id && category.parents) {
			const parents = Array.from(category.parents).reverse();

			if (!category.children?.length) {
				parents.splice(-1, 1);
			}

			return parents;
		}

		return [];
	}, [category.category_id]); //eslint-disable-line

	if (!categoryMenu.length) return null;

	return (
		<nav className={clsx('category-sidebar', {'with-breadcrumbs': parentsBreadCrumbs.length})}>
			{parentsBreadCrumbs.length > 0 &&
			<ul className={'category-sidebar__parents list-unstyled'}>
				{parentsBreadCrumbs.map((item) => (
					<li key={item.category_id}>
						{item.category_id === category.category_id
							? <strong>{item.title}</strong>
							:	<Link href={getCategoryUrl(item)}>
									<a><FontAwesomeIcon icon={faChevronLeft} size={'xs'} /> {item.title}</a>
							</Link>
						}
					</li>
				))}
			</ul>
			}

			<ul className='category-sidebar__list list-unstyled' itemScope itemType='http://schema.org/ItemList'>
				{categoryMenu.map((item, i) => {
					const categoryUrl = getCategoryUrl(item);

					return (
						<li
							className={clsx({active: category.category_id === item.category_id})}
							key={item.category_id}
						>
							<div itemProp='itemListElement' itemScope itemType='http://schema.org/ListItem'>
								{item.image?.path &&
								<Link href={categoryUrl}>
									<a className={'img-link'}>
										<img src={getCategoryImg(item.image?.path)} alt={item.title} />
									</a>
								</Link>}
								<Link href={categoryUrl}>
									<a className={'title'} itemProp='url'>
										<span itemProp='name'>{item.title}</span>
									</a>
								</Link>
								<meta itemProp='position' content={String(i+1)} />
							</div>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
