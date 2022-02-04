import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import {IMenuItem} from '../redux/reducers/menus';
import {createPopper, Instance} from '@popperjs/core';

export default class HorizontalMenu extends React.Component<HorizontalMenuProps, HorizontalMenuState> {
	protected hideTimeout: number | null = null;
	protected popperElements: HTMLUListElement[] = [];
	protected poppers: Instance[] = [];
	protected popperRefs: HTMLLIElement[] = [];

	constructor(props: HorizontalMenuProps) {
		super(props);

		this.state = {
			visiblePopup: null,
			delayedVisible: null,
		};
	}

	handleShow(index: number) {
		if (this.hideTimeout) clearTimeout(this.hideTimeout);
		this.setState({
			visiblePopup: index,
			delayedVisible: index,
		});
		this.hideAllPoppers();
		if (this.poppers[index]) this.enablePopper(this.poppers[index]);
	}

	handleHide(index: number) {
		if (this.hideTimeout) clearTimeout(this.hideTimeout);
		this.hideTimeout = window.setTimeout(() => {
			if (index === this.state.visiblePopup) {
				this.setState({
					visiblePopup: null
				});
			}
			this.hideAllPoppers();
		}, 300);
	}

	hideAllPoppers() {
		this.poppers.forEach((popper) => popper && this.disablePopper(popper));
	}

	disablePopper(popperInstance: Instance) {
		popperInstance.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers!,
				{
					name: 'eventListeners',
					enabled: false
				},
			],
		}));
	}

	enablePopper(popperInstance: Instance) {
		popperInstance.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers!,
				{name: 'eventListeners', enabled: true},
			],
		}));

		popperInstance.update();
	}

	componentDidMount() {
		this.popperElements.forEach((element, i) => {
			if (!element) return;
			this.poppers[i] = createPopper(this.popperRefs[i], this.popperElements[i], {
				placement: 'bottom-start',
			});
		});
	}

	componentWillUnmount() {
		this.poppers.forEach(popper => popper && popper.destroy());
		this.poppers = [];
	}

	render(): React.ReactNode {
		const {menuList} = this.props;
		const {visiblePopup} = this.state;

		return (
			<nav className='horizontal-menu'>
				<div className='container'>
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
									ref={(el) => el && !this.popperRefs[i] && (this.popperRefs[i] = el)}
									onMouseOver={this.handleShow.bind(this, i)}
									onMouseOut={this.handleHide.bind(this, i)}
								>
									<div className='d-flex align-items-center' itemProp='itemListElement' itemScope itemType='http://schema.org/ListItem'>
										<ListElement item={item} position={i} />
									</div>
									{item.children && item.children.length > 0 &&
										<ul
											className={clsx('horizontal-menu__child-list list-unstyled', {'d-none': visiblePopup !== i})}
											ref={(el) => el && !this.popperElements[i] && (this.popperElements[i] = el)}
										>
											{item.children.map((childItem, j) =>
												<li key={childItem.title + j} className={clsx({active: childItem.isActive})}>
													<ListElement item={childItem} />
												</li>)}
										</ul>}
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
	menuList: IMenuItem[]
}

interface HorizontalMenuState {
	visiblePopup: number | null;
	delayedVisible: number | null;
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