import {ICategoryFlatItem} from 'boundless-api-client/types/catalog/category';
import clsx from 'clsx';
import Link from 'next/link';
import {TQuery} from '../@types/common';
import {getCategoryUrl} from '../lib/services/urls';

export default function BreadCrumbs({parents, activeParams}: IBreadCrumbsProps) {
	const _parents = [...parents];

	const richItemAttrs = {
		itemProp: 'itemListElement',
		itemScope: true,
		itemType: 'http://schema.org/ListItem'
	};

	return (
		<nav className='breadcrumb-wrapper'>
			<ol className='breadcrumb' itemProp='breadcrumb' itemScope itemType='http://schema.org/BreadcrumbList'>
				<li className='breadcrumb-item' {...richItemAttrs}>
					<Link href='/'>
						<a itemProp='item'><span itemProp='name'>Home</span></a>
					</Link>
					<meta itemProp='position' content='1' />
				</li>
				{parents?.length > 0 && _parents.reverse().map((parent, i) => {
					const isLast = parents.length === i + 1;
					const isActive = isLast && !activeParams;
					const title = parent.title || parent.joined_title;

					return (
						<li
							className={clsx('breadcrumb-item', isActive && 'active')}
							key={parent.category_id}
							{...(isActive ? {} : richItemAttrs)}
						>
							{isActive
								? title
								: <Link href={getCategoryUrl(parent, activeParams)}>
									<a itemProp='item'>
										<span itemProp='name'>{title}</span>
									</a>
								</Link>}
							<meta itemProp='position' content={String(i + 2)} />
						</li>);
				})}
			</ol>
		</nav>
	);
}

interface IBreadCrumbsProps {
	parents: ICategoryFlatItem[];
	activeParams?: TQuery;
}