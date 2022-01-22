import clsx from 'clsx';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {RootState} from '../redux/store';
import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import {useEffect, useRef} from 'react';
import {setIsOpened} from '../redux/reducers/asideMenu';
import HeaderCart from './cart/HeaderCart';

export default function AsideMenu() {
	const rootEl = useRef(null);
	const isOpened = useAppSelector((state: RootState) => state.asideMenu.isOpened);
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
		} else if (e.keyCode !== undefined && e.keyCode === 13) {
			closeIfOpened();
		}
	};

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
			<div>
				<HeaderCart className={'cart-header_horizontal'} />
			</div>
			<p>coming soon :)</p>
		</aside>
	);
}