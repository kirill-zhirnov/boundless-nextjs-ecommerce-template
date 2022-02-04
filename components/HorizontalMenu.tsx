import clsx from 'clsx';
import Link from 'next/link';
import {useRef, useState} from 'react';
import {IMenuItem} from '../redux/reducers/menus';
import {usePopper} from 'react-popper';
import {CSSTransition} from 'react-transition-group';

export default function HorizontalMenu({menuList}: {menuList: IMenuItem[]}) {
	const [referenceElement, setReferenceElement] = useState<HTMLLIElement | null>(null);
	const popperElements = useRef<HTMLUListElement[]>([...Array(menuList.length)]);
	const hideTimeout = useRef<number | null>(null);
	const [popperElement, setPopperElement] = useState<HTMLUListElement | null>(null);
	const [visible, setVisible] = useState<number | null>(null);
	const [delayedVisible, setDelayedVisible] = useState<number | null>(null);

	const {styles, attributes} = usePopper(referenceElement, popperElement, {
		placement: 'bottom-start',
	});

	const handleShow = (index: number, e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		if (hideTimeout.current) clearTimeout(hideTimeout.current);
		setVisible(index);
		setDelayedVisible(index);
		setReferenceElement(e.currentTarget);
		setPopperElement(popperElements.current[index]);
	};

	const handleHide = (index: number) => {
		if (hideTimeout.current) clearTimeout(hideTimeout.current);
		hideTimeout.current = window.setTimeout(() => {
			if (index === visible) setVisible(null);
			setReferenceElement(null);
			setPopperElement(null);
		}, 300);
	};

	return (
		<div className='container'>
			<nav className='horizontal-menu'>
				<ul className='horizontal-menu__list list-unstyled mb-0 justify-content-around' itemScope itemType='http://schema.org/ItemList'>
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
								onMouseOver={handleShow.bind(null, i)}
								onMouseOut={handleHide.bind(null, i)}
							>
								<div className='d-flex align-items-center' itemProp='itemListElement' itemScope itemType='http://schema.org/ListItem'>
									<ListElement item={item} position={i} />
								</div>
								{item.children && item.children.length > 0 &&
									<CSSTransition
										in={visible === i}
										timeout={600}
										onExited={() => setDelayedVisible(null)}
										classNames={{
											enterActive: 'animate__animated animate__fadeIn',
											exitActive: 'animate__animated animate__fadeOut',
											exitDone: 'd-none'
										}}
									>
										<ul
											className={clsx('horizontal-menu__child-list list-unstyled', {'d-none': delayedVisible !== i})}
											ref={(el) => {
												if (el) popperElements.current[i] = el;
											}}
											style={styles.popper}
											{...attributes.popper}
										>
											{item.children.map((childItem, j) =>
												<li key={childItem.title + j} className={clsx({active: childItem.isActive})}>
													<ListElement item={childItem} />
												</li>)}
										</ul>
									</CSSTransition>}
							</li>
						);
					})}
				</ul>
			</nav >
		</div>
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
						<a className={clsx('horizontal-menu__link img-link', isRootElem ? 'is-root' : 'is-child')}>
							{imageElem}
						</a>
					</Link>
					: imageElem}
			</>}
			{item.url && !item.isActive
				? <>
					<Link href={item.url}>
						<a className={clsx('horizontal-menu__link title', isRootElem ? 'is-root' : 'is-child')} itemProp='url'>
							{isRootElem
								? <span itemProp='name'>{item.title}</span>
								: item.title}
						</a>
					</Link>
					{isRootElem && <meta itemProp='position' content={String(position + 1)} />}
				</>
				: <span className={clsx('horizontal-menu__text-title', isRootElem ? 'is-root' : 'is-child')}>
					{item.title}
				</span>}
		</>
	);
}