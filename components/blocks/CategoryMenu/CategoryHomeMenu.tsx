import clsx from 'clsx';
import Link from 'next/link';
import {ICategoryPartial} from '../../../@types/category';
import {getCategoryImg} from '../../../lib/services/imgs';
import {getCategoryUrl} from '../../../lib/services/urls';

export default function CategoryHomeMenu({categoryTree}: {categoryTree: ICategoryPartial[]}) {
	return (
		<ul className='category-menu__list list-unstyled list-group'>
			{categoryTree && categoryTree.map(category => {
				const showChildren = 'children' in category && category.children && category.children.length > 0;
				return (
					<li
						className={clsx('category-menu__item list-group-item', showChildren && 'has-children')}
						key={category.category_id}
					>
						{category.image?.path && <img src={getCategoryImg(category.image?.path)} alt={category.title || ''} className='me-2' />}
						<Link href={getCategoryUrl(category)}>{category.title}</Link>
						{showChildren &&
							<ul className='category-menu__child-list'>
								{category.children && category.children.map(child => (
									<li key={child.category_id}>
										{child.image?.path && <img src={getCategoryImg(child.image?.path)} alt={child.title || ''} className='me-2' />}
										<Link href={getCategoryUrl(child)}>{child.title}</Link>
									</li>
								))}
							</ul>}
					</li>
				);
			})}
		</ul>
	);
}