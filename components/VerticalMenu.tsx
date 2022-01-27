import clsx from 'clsx';
import Link from 'next/link';
import {IMenuItem} from '../redux/reducers/menus';

export default function VerticalMenu({menuList}: {menuList: IMenuItem[]}) {
	return (
		<nav className='vertical-menu'>
			<ul className='vertical-menu__list list-unstyled mb-0' itemScope itemType='http://schema.org/ItemList'>
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
							<div itemProp='itemListElement' itemScope itemType='http://schema.org/ListItem'>
								<ListElement item={item} position={i} />
							</div>
							{item.children && item.children.length > 0 &&
								<ul className='list-unstyled'>
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

	return (
		<>
			{image && <>
				{item.url && !item.isActive ?
					<Link href={item.url}>
						<a className={'img-link me-2'}>
							<img src={image.src}
								alt={item.title}
								width={image.width}
								height={image.height}
							/>
						</a>
					</Link>
					: <img src={image.src}
						className='me-2'
						alt={item.title}
						width={image.width}
						height={image.height}
					/>}
			</>}
			{item.url && !item.isActive
				? <>
					<Link href={item.url}>
						<a className={'title'} itemProp='url'>
							{position !== undefined
								? <span itemProp='name'>{item.title}</span>
								: item.title}
						</a>
					</Link>
					{position !== undefined && <meta itemProp='position' content={String(position + 1)} />}
				</>
				: item.isActive ? <b>{item.title}</b> : item.title}
		</>
	);
}