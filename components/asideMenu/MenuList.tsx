import {faCaretDown, faCaretRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {IMenuItem} from '../../@types/components';
import {useAppSelector} from '../../hooks/redux';
import {RootState} from '../../redux/store';

export default function AsideMenuList({menuList}: {menuList: IMenuItem[]}) {
	const isRouting = useAppSelector((state: RootState) => state.app.isRouteChanging);
	const [opened, setOpened] = useState<number[]>([]);

	useEffect(() => {
		if (isRouting) return;

		const index = menuList.findIndex(el => el.isActive);
		if (index !== -1) setOpened([index]);
	}, [isRouting]); //eslint-disable-line

	const toggleOpen = (index: number) => {
		setOpened(prev => {
			if (prev.includes(index)) return prev.filter(el => el !== index);
			return [...prev, index];
		});
	};

	return (
		<nav>
			<ul className='aside-menu__list list-unstyled' itemScope itemType='//schema.org/ItemList'>
				{menuList.map((item, i) => {
					const hasChildren = item.children && item.children.length > 0;
					const collapsibleProps = {onClick: () => toggleOpen(i)};
					const open = hasChildren && opened.includes(i);

					return (
						<li
							className={clsx('aside-menu__root-element', {
								active: item.isActive,
								'has-children': hasChildren,
								open
							})}
							key={item.title + i}
							{...(hasChildren ? collapsibleProps : {})}
						>
							<div itemProp='itemListElement' itemScope itemType='//schema.org/ListItem'>
								<ListElement item={item} position={i} open={open} />
							</div>
							{hasChildren && <ChildList children={item.children!} />}
						</li>
					);
				})}
			</ul>
		</nav >
	);
}

function ChildList({children}: {children: IMenuItem[]}) {
	return <ul className='aside-menu__child-list list-unstyled'>
		{children.map((childItem, j) =>
			<li key={childItem.title + j} className={clsx({active: childItem.isActive})}>
				<ListElement item={childItem} />
			</li>)}
	</ul>;
}

function ListElement({item, position, open}: {item: IMenuItem, position?: number, open?: boolean}) {
	const image = item.img || null;
	const hasChildren = item.children && item.children.length > 0;
	const isRootElem = position !== undefined;

	const rootProps = {onClick: (e: React.MouseEvent) => e.preventDefault()};

	const imageElem = image
		? <img src={image.src}
			className='me-2'
			alt={item.title}
			width={image.width}
			height={image.height}
		/>
		: null;

	if (item.url && (isRootElem || !item.isActive)) return <>
			<Link
					href={item.url}
					className={clsx(
							'aside-menu__element is-link',
							isRootElem ? 'is-root' : 'is-child',
							{active: item.isActive}
					)}
					{...(isRootElem ? rootProps : {})}>
					<span>
							{image && <span className='img-link'>{imageElem}</span>}
							<span {...(isRootElem ? {itemProp: 'name'} : {})}>
									{item.title}
							</span>
					</span>
					{isRootElem && hasChildren && <FontAwesomeIcon className='ms-2' icon={open ? faCaretDown : faCaretRight} />}
			</Link>
			{isRootElem && <meta itemProp='position' content={String(position + 1)} />}
			{!isRootElem && hasChildren && <ChildList children={item.children!} />}
	</>;

	return (
		<>
			<div className={clsx(
				'aside-menu__element',
				isRootElem ? 'is-root' : 'is-child',
				{active: item.isActive}
			)}>
				<span>
					{image && imageElem}
					{item.title}
				</span>
				{isRootElem && hasChildren && <FontAwesomeIcon className='ms-2' icon={open ? faCaretDown : faCaretRight} />}
			</div>
			{!isRootElem && hasChildren && <ChildList children={item.children!} />}
		</>
	);
}