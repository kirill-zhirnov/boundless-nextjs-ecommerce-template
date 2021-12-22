import clsx from 'clsx';
import Link from 'next/link';
import {ICategoryPartial} from '../../../@types/category';
import {getCategoryImg} from '../../../lib/services/imgs';
import {getCategoryUrl} from '../../../lib/services/urls';

export default function CategoryMenu({categoryTree, active_id}: CategoryMenuProps) {
	return (
		<ul className='category-menu__list list-unstyled list-group'>
			{categoryTree && categoryTree.map(category => (
				<li
					className={clsx(
						'category-menu__item list-group-item',
						active_id === category.category_id && 'active'
					)}
					key={category.category_id}
				>
					{category.image?.path && <img src={getCategoryImg(category.image?.path)} alt={category.title || ''} className='me-2' />}
					<Link href={getCategoryUrl(category)}>{category.title}</Link>
				</li>
			))}
		</ul>
	);
}

interface CategoryMenuProps {
	categoryTree: ICategoryPartial[];
	active_id?: number;
}