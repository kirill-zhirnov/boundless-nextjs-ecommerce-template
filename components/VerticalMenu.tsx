import clsx from 'clsx';
import Link from 'next/link';
import {IMenuItem} from '../@types/components';

export default function VerticalMenu({menuList}: {menuList: IMenuItem[]}) {
	return (
		<nav className='vertical-menu'>
			<ul className='vertical-menu__list list-unstyled mb-0' itemScope itemType='//schema.org/ItemList'>
				{menuList.map((item, i) => {
					const hasChildren = item.children && item.children.length > 0;
					return (
						<li
							className={clsx({
								active: item.isActive,
								'has-children': hasChildren,
								'open': hasChildren && item.isActive
							})}
							key={item.title + i}
						>
							<div itemProp='itemListElement' itemScope itemType='//schema.org/ListItem'>
								<ListElement item={item} position={i} />
							</div>
							{item.children && item.children.length > 0 &&
								<ul className='vertical-menu__child-list list-unstyled'>
									{item.children.map((childItem, j) =>
										<li key={childItem.title + j} className={clsx({active: childItem.isActive})}>
											<ListElement item={childItem} />
										</li>)}
								</ul>}
						</li>
					);
				})}
			</ul>
		</nav >
	);
}

function ListElement({item, position}: {item: IMenuItem, position?: number}) {
	const image = item.img || null;
	const isRootElem = position !== undefined;

	const imageElem = image
		? <img src={image.src}
			className='me-2'
			alt={item.title}
			width={image.width}
			height={image.height}
		/>
		: null;

	return (
		<>
			{image && <>
				{item.url && !item.isActive ?
					<Link href={item.url}>
						<a className={clsx('vertical-menu__link img-link', isRootElem ? 'is-root' : 'is-child')}>
							{imageElem}
						</a>
					</Link>
					: imageElem}
			</>}
			{item.url && !item.isActive
				? <>
					<Link href={item.url}>
						<a className={clsx('vertical-menu__link title', isRootElem ? 'is-root' : 'is-child')} itemProp='url'>
							{isRootElem
								? <span itemProp='name'>{item.title}</span>
								: item.title}
						</a>
					</Link>
					{isRootElem && <meta itemProp='position' content={String(position + 1)} />}
				</>
				: <span className={clsx('vertical-menu__text-title', isRootElem ? 'is-root' : 'is-child')}>
					{item.title}
				</span>}
		</>
	);
}