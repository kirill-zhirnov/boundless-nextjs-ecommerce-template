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
import {DragGesture} from '@use-gesture/vanilla';

export default function AsideMenu({menuList}: {menuList?: IMenuItem[]}) {
	const rootEl = useRef(null);
	const isOpened = useAppSelector((state: RootState) => state.asideMenu.isOpened);
	const isRouteChanging = useAppSelector((state: RootState) => state.app.isRouteChanging);
	const dispatch = useAppDispatch();
	const gesture = useRef<DragGesture | null>(null);

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

	const enableSwipe = () => {
		const body = document.querySelector('body');

		body!.style.touchAction = 'none';
		gesture.current = new DragGesture(body!, ({last, direction: [dx], velocity: [vx, vy]}) => {
			if (last && vx > 0.3 && (Math.abs(vy) < Math.abs(vx)) && dx === 1) {
				closeIfOpened();
			}
		});
	};

	const disableSwipe = () => {
		const body = document.querySelector('body');

		if (gesture.current) gesture.current.destroy();
		gesture.current = null;
		body!.style.touchAction = 'auto';
	};

	useEffect(() => {
		if (isRouteChanging) closeIfOpened();
	}, [isRouteChanging]); //eslint-disable-line

	useEffect(() => {
		if (isOpened) {
			if (rootEl.current) {
				disableBodyScroll(rootEl.current);
			}

			enableSwipe();

			window.addEventListener('resize', closeIfOpened);
			window.addEventListener('keydown', onEscPressed);
		} else {
			if (rootEl.current) {
				enableBodyScroll(rootEl.current);
			}

			disableSwipe();

			window.removeEventListener('resize', closeIfOpened);
			window.removeEventListener('keydown', onEscPressed);
		}

		return () => {
			clearAllBodyScrollLocks();
			window.removeEventListener('resize', closeIfOpened);
			window.removeEventListener('keydown', onEscPressed);

			disableSwipe();
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