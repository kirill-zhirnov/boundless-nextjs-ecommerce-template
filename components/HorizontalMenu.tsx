import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import {IMenuItem} from '../redux/reducers/menus';
import {CSSTransition} from 'react-transition-group';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';

export default class HorizontalMenu extends React.Component<HorizontalMenuProps, HorizontalMenuState> {
	protected hideTimeout: number | null = null;

	constructor(props: HorizontalMenuProps) {
		super(props);

		this.state = {
			visiblePopup: null,
		};
	}

	handleShow(index: number) {
		if (this.hideTimeout) clearTimeout(this.hideTimeout);
		this.setState({
			visiblePopup: index,
		});
	}

	handleHide(index: number) {
		if (this.hideTimeout) clearTimeout(this.hideTimeout);
		this.hideTimeout = window.setTimeout(() => {
			if (index === this.state.visiblePopup) {
				this.setState({
					visiblePopup: null
				});
			}
		}, 300);
	}

	render(): React.ReactNode {
		const {menuList} = this.props;
		const {visiblePopup} = this.state;

		return (
			<nav className='horizontal-menu'>
				<div className='container'>
					<ul className='horizontal-menu__list list-unstyled' itemScope itemType='http://schema.org/ItemList'>
						{menuList.map((item, i) => {
							const hasChildren = item.children && item.children.length > 0;
							return (
								<li
									className={clsx('horizontal-menu__root-element', {
										active: item.isActive,
										'has-children': hasChildren,
										'open': hasChildren && item.isActive
									})}
									key={item.title + i}
									onMouseOver={this.handleShow.bind(this, i)}
									onMouseOut={this.handleHide.bind(this, i)}
								>
									<div itemProp='itemListElement' itemScope itemType='http://schema.org/ListItem'>
										<ListElement item={item} position={i} hasChildren={hasChildren} />
									</div>
									{item.children && item.children.length > 0 &&
										<CSSTransition
											in={visiblePopup === i}
											timeout={600}
											unmountOnExit
											classNames={{
												enterActive: 'animate__animated animate__fadeInUp',
												exitActive: 'animate__animated animate__fadeOut',
											}}
										>
											<ul
												className={clsx('horizontal-menu__child-list list-unstyled')}
											>
												{item.children.map((childItem, j) =>
													<li key={childItem.title + j} className={clsx('horizontal-menu__child-element', {active: childItem.isActive})}>
														<ListElement item={childItem} />
													</li>)}
											</ul>
										</CSSTransition>}
								</li>
							);
						})}
					</ul>
				</div>
			</nav >
		);
	}
}

interface HorizontalMenuProps {
	menuList: IMenuItem[];
}

interface HorizontalMenuState {
	visiblePopup: number | null;
}

function ListElement({item, position, hasChildren}: {item: IMenuItem, position?: number, hasChildren?: boolean}) {
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

	const titleWithIcon = hasChildren
		? <>
			{item.title}
			{hasChildren && <FontAwesomeIcon className='ms-2' icon={faCaretDown} />}
		</>
		: item.title;

	if (item.url && (!item.isActive || isRootElem)) return (
		<>
			<Link href={item.url}>
				<a className={clsx(
					'horizontal-menu__element is-link',
					isRootElem ? 'is-root' : 'is-child',
					{active: item.isActive}
				)}>
					{image && <span className='img-link'>{imageElem}</span>}
					<span className='title' {...(isRootElem ? {itemProp: 'name'} : {})}>
						{isRootElem ? titleWithIcon : item.title}
					</span>
				</a>
			</Link>
			{isRootElem && <meta itemProp='position' content={String(position + 1)} />}
		</>
	);

	return (
		<div className={clsx(
			'horizontal-menu__element',
			isRootElem ? 'is-root' : 'is-child',
			{active: item.isActive}
		)}>
			{image && imageElem}
			<span className='horizontal-menu__text-title'>
				{titleWithIcon}
			</span>
		</div>
	);
}