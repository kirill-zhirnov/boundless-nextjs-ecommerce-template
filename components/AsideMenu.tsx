import clsx from 'clsx';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {RootState} from '../redux/store';
import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import {useEffect, useRef} from 'react';
import {setIsOpened} from '../redux/reducers/asideMenu';
import HeaderCart from './cart/HeaderCart';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {IMenuItem} from '../redux/reducers/menus';
import AsideMenuList from './asideMenu/MenuList';

export default function AsideMenu({menuList}: {menuList?: IMenuItem[]}) {
	const rootEl = useRef(null);
	const isOpened = useAppSelector((state: RootState) => state.asideMenu.isOpened);
	const isRouteChanging = useAppSelector((state: RootState) => state.app.isRouteChanging);
	const dispatch = useAppDispatch();

	const closeIfOpened = () => {
		if (isOpened) {
			dispatch(setIsOpened(false));
		}
	};
	const onEscPressed = (e: KeyboardEvent) => {
		if (e.defaultPrevented || !isOpened) {
			return;
		}

		if (e.key !== undefined && e.key === 'Escape') {
			closeIfOpened();
		} else if (e.keyCode !== undefined && e.keyCode === 27) {
			closeIfOpened();
		}
	};

	useEffect(() => {
		if (isRouteChanging) closeIfOpened();
	}, [isRouteChanging]); //eslint-disable-line

	useEffect(() => {
		if (isOpened) {
			if (rootEl.current) {
				disableBodyScroll(rootEl.current);
			}

			window.addEventListener('resize', closeIfOpened);
			window.addEventListener('keydown', onEscPressed);
		} else {
			if (rootEl.current) {
				enableBodyScroll(rootEl.current);
			}

			window.removeEventListener('resize', closeIfOpened);
			window.removeEventListener('keydown', onEscPressed);
		}

		return () => {
			clearAllBodyScrollLocks();
			window.removeEventListener('resize', closeIfOpened);
			window.removeEventListener('keydown', onEscPressed);
		};
	}, [isOpened]);//eslint-disable-line

	return (
		<aside className={clsx('aside-menu', {'aside-menu_visible': isOpened})}
			ref={rootEl}
		>
			<div className='aside-menu__header'>
				<HeaderCart className={'cart-header cart-header_horizontal'} />
				<div className='aside-menu__close-btn' onClick={closeIfOpened} >
					<FontAwesomeIcon icon={faTimes} />
				</div>
			</div>
			{menuList && <AsideMenuList menuList={menuList} />}
		</aside>
	);
}