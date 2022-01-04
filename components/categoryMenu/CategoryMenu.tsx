import clsx from 'clsx';
import Link from 'next/link';
import {ICategoryPartial} from '../../@types/category';
import {getCategoryImg} from '../../lib/services/imgs';
import {getCategoryUrl} from '../../lib/services/urls';
import ChevronLeft from '@fortawesome/fontawesome-free/svgs/solid/chevron-left.svg';

export default function CategoryMenu({categoryTree, activeId, parents}: CategoryMenuProps) {
	const parentCategory = parents[1] || null;

	return (
		<ul className='category-menu__list list-unstyled list-group' itemScope itemType='http://schema.org/ItemList'>
			{parentCategory &&
				<>
					<li className='category-menu__item list-group-item d-flex align-items-center ps-1'>
						<img src={ChevronLeft.src} width={11} height={11} className='me-1'/>
						<Link href={getCategoryUrl(parentCategory)}>
							{` ${parentCategory.title}`}
						</Link>
					</li>
					<hr className='mt-0' />
				</>}
			{categoryTree && categoryTree.map((category, i) => (
				<li
					className={clsx(
						'category-menu__item list-group-item',
						activeId === category.category_id && 'active'
					)}
					key={category.category_id}
				>
					<div itemProp='itemListElement' itemScope itemType='http://schema.org/ListItem'>
						{category.image?.path && <img src={getCategoryImg(category.image?.path)} alt={category.title} className='me-2' />}
						<Link href={getCategoryUrl(category)} >
							<a itemProp='url'>
								<span itemProp='name'>{category.title}</span>
							</a>
						</Link>
						<meta itemProp='position' content={String(i+1)} />
					</div>
				</li>
			))}
		</ul >
	);
}

interface CategoryMenuProps {
	categoryTree: ICategoryPartial[];
	activeId?: number;
	parents: ICategoryPartial[];
}
