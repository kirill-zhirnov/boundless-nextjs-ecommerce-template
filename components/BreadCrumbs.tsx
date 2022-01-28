import clsx from 'clsx';
import Link from 'next/link';
import {IBreadCrumbItem} from '../@types/components';

export default function BreadCrumbs({items}: {items: IBreadCrumbItem[]}) {
	const isEmpty = items.length === 0;

	const richItemAttrs = {
		itemProp: 'itemListElement',
		itemScope: true,
		itemType: 'http://schema.org/ListItem'
	};

	return (
		<nav className={clsx('breadcrumb-wrapper', isEmpty && 'd-none')}>
			{!isEmpty && <ol className='breadcrumb' itemProp='breadcrumb' itemScope itemType='http://schema.org/BreadcrumbList'>
				<li className='breadcrumb-item' {...richItemAttrs}>
					<Link href='/'>
						<a itemProp='item'><span itemProp='name'>Home</span></a>
					</Link>
					<meta itemProp='position' content='1' />
				</li>
				{items.map((item, i) => (
					<li
						className={clsx('breadcrumb-item', item.isActive && 'active')}
						key={i}
						{...(item.url ? richItemAttrs : {})}
					>
						{item.url && !item.isActive
							? <>
								<Link href={item.url}>
									<a itemProp='item'>
										<span itemProp='name'>{item.title}</span>
									</a>
								</Link>
								<meta itemProp='position' content={String(i + 2)} />
							</>
							: item.title}
					</li>))}
			</ol>}
		</nav>
	);
}