import clsx from 'clsx';
import Link from 'next/link';
import {IMenuItem} from '../../@types/components';

export default function FooterMenu({menuList}: {menuList: IMenuItem[]}) {
	return (
		<>
			<h3 className='page-footer__header'>Most popular</h3>
			<ul className='page-footer-menu list-unstyled' itemScope itemType='//schema.org/ItemList'>
				{menuList.map((item, i) => (
					<li
						className={clsx('page-footer-menu__list-element', {
							active: item.isActive,
						})}
						key={item.title + i}
					>
						<div itemProp='itemListElement' itemScope itemType='//schema.org/ListItem'>
							<ListElement item={item} position={i} />
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

function ListElement({item, position}: {item: IMenuItem, position: number}) {
	if (item.url) return (
		<>
			<Link href={item.url}>
				<a className={clsx(
					'page-footer-menu__element is-link',
					{active: item.isActive}
				)}>
					<span className='title' itemProp='name'>
						{item.title}
					</span>
				</a>
			</Link>
			<meta itemProp='position' content={String(position + 1)} />
		</>
	);

	return (
		<div className={clsx(
			'page-footer-menu__element',
			{active: item.isActive}
		)}>
			<span className='page-footer-menu__text-title'>
				{item.title}
			</span>
		</div>
	);
}