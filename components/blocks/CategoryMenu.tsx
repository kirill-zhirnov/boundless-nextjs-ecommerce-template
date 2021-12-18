import {ICategory} from 'boundless-api-client/types/catalog/category';
import clsx from 'clsx';

export default function CategoryMenu({categoryTree}: CatgoryMenuProps) {
	return (
		<ul className='category-menu__list list-unstyled list-group'>
			{categoryTree && categoryTree.map(category => {
				const hasChildren = category.children && category.children.length > 0;
				return (
					<li className={clsx('category-menu__item list-group-item', hasChildren && 'has-children')} key={category.category_id}>
						<a href={`/category/${category.url_key}`}>{category.title}</a>
						{hasChildren &&
							<ul className='category-menu__child-list'>
								{category.children && category.children.map(child => (
									<li key={child.category_id}>
										<a href={`/category/${child.url_key}`}>{child.title}</a>
									</li>
								))}
							</ul>}
					</li>
				);
			})}
		</ul>
	);
}

interface CatgoryMenuProps {
	categoryTree: ICategory[];
}