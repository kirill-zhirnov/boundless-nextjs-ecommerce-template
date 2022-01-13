import clsx from 'clsx';
import Link from 'next/link';
import {ICategoryPartial} from '../../@types/category';
import {getCategoryImg} from '../../lib/services/imgs';
import {getCategoryUrl} from '../../lib/services/urls';
import ChevronLeft from '@fortawesome/fontawesome-free/svgs/solid/chevron-left.svg';

export default function CategoriesSidebar({categoryTree, activeId, parents}: CategoryMenuProps) {
	const parentCategory = parents[1] || null;

	return (
		<div className={'categories-sidebar'}>
			{/*{parentCategory &&*/}
			{/*<>*/}
			{/*	<li className='category-menu__item list-group-item d-flex align-items-center ps-1'>*/}
			{/*		<img src={ChevronLeft.src} width={11} height={11} className='me-1'/>*/}
			{/*		<Link href={getCategoryUrl(parentCategory)}>*/}
			{/*			{` ${parentCategory.title}`}*/}
			{/*		</Link>*/}
			{/*	</li>*/}
			{/*	<hr className='mt-0' />*/}
			{/*</>}*/}

			<ul className='categories-sidebar__list list-unstyled' itemScope itemType='http://schema.org/ItemList'>
				{categoryTree && categoryTree.map((category, i) => {
					const categoryUrl = getCategoryUrl(category);

					return (
						<li
							className={clsx('categories-sidebar__item', {active: activeId === category.category_id})}
							key={category.category_id}
						>
							<div itemProp='itemListElement' itemScope itemType='http://schema.org/ListItem'>
								{category.image?.path &&
								<Link href={categoryUrl}>
									<a className={'img-link me-2'}>
										<img src={getCategoryImg(category.image?.path)} alt={category.title} />
									</a>
								</Link>}
								<Link href={categoryUrl}>
									<a itemProp='url'>
										<span itemProp='name'>{category.title}</span>
									</a>
								</Link>
								<meta itemProp='position' content={String(i+1)} />
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

interface CategoryMenuProps {
	categoryTree: ICategoryPartial[];
	activeId?: number;
	parents: ICategoryPartial[];
}
