import clsx from 'clsx';
import Link from 'next/link';
import {IBreadCrumbItem} from '../@types/components';

export default function BreadCrumbs({items}: {items: IBreadCrumbItem[]}) {
	const isEmpty = items.length === 0;

	const richItemAttrs = {
		itemProp: 'itemListElement',
		itemScope: true,
		itemType: '//schema.org/ListItem'
	};

	return (
		<nav className={clsx('breadcrumb-wrapper', isEmpty && 'd-none')}>
			{!isEmpty && <ol className='breadcrumb' itemProp='breadcrumb' itemScope itemType='//schema.org/BreadcrumbList'>
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
							:
							<>
								<span itemProp='item'>
									<span itemProp='name'>{item.title}</span>
								</span>
								<meta itemProp='position' content={String(i + 2)} />
							</>
						}
					</li>))}
			</ol>}
		</nav>
	);
}