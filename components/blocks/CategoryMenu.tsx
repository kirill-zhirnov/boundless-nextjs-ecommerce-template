import {ICategory} from 'boundless-api-client/types/catalog/category';
import clsx from 'clsx';
import Link from 'next/link';

export default function CategoryMenu({categoryTree, active_id, flat = false}: CategoryMenuProps) {
	const getCategoryUrl = (category: ICategoryPartial) => {
		if (category.custom_link) return category.custom_link;
		return `/category/${category.url_key || category.category_id}`;
	};

	return (
		<ul className='category-menu__list list-unstyled list-group'>
			{categoryTree && categoryTree.map(category => {
				const showChildren = 'children' in category && category.children && category.children.length > 0 && !flat;
				return (
					<li
						className={clsx(
							'category-menu__item list-group-item',
							showChildren && 'has-children',
							active_id === category.category_id && 'active'
						)}
						key={category.category_id}
					>
						<Link href={getCategoryUrl(category)}>{category.title}</Link>
						{showChildren &&
							<ul className='category-menu__child-list'>
								{category.children && category.children.map(child => (
									<li key={child.category_id}>
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

type ICategoryPartial = Pick<ICategory, 'category_id' | 'title'| 'custom_link' | 'url_key' > & {children?: ICategory[]|null };

interface CategoryMenuProps {
	categoryTree: ICategoryPartial[];
	active_id?: number;
	flat?: boolean;
}