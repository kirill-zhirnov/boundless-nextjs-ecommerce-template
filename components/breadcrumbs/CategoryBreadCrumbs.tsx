import {ICategoryFlatItem} from 'boundless-api-client/types/catalog/category';
import clsx from 'clsx';
import Link from 'next/link';

export default function CategoryBreadCrumbs({parents}: {parents: ICategoryFlatItem[]}) {
	const _parent = [...parents];

	return (
		<nav className='breadcrumb-wrapper'>
			<ol className='breadcrumb'>
				<li className='breadcrumb-item'><a href='/'>Home</a></li>
				{parents?.length > 0 && _parent.reverse().map((parent, i) => {
					const isActive = parents.length === i + 1;
					return (
						<li className={clsx('breadcrumb-item', isActive && 'active')} key={parent.category_id}>
							{isActive
								? (parent.title || parent.joined_title)
								: <Link href={`/category/${parent.url_key || parent.category_id}`}>
									{parent.title || parent.joined_title}
								</Link>}
						</li>);
				})}
			</ol>
		</nav>

	);
}

