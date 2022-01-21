import clsx from 'clsx';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {RootState} from '../redux/store';
import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import {useEffect, useRef} from 'react';
import {setIsOpened} from '../redux/reducers/asideMenu';

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
		if (rootEl.current) {
			if (isOpened) {
				disableBodyScroll(rootEl.current);
				window.addEventListener('resize', closeIfOpened);
				window.addEventListener('keydown', onEscPressed);
			} else {
				enableBodyScroll(rootEl.current);
				window.removeEventListener('resize', closeIfOpened);
				window.removeEventListener('keydown', onEscPressed);
			}
		}

		return () => {
			clearAllBodyScrollLocks();
			window.removeEventListener('resize', closeIfOpened);
			window.removeEventListener('keydown', onEscPressed);
		};
	}, [isOpened, rootEl.current]);

	return (
		<aside className={clsx('aside-menu', {'aside-menu_visible': isOpened})}
					 ref={rootEl}
		>
			<p>coming soon :)</p>
		</aside>
	);
}