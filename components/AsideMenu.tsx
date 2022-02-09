import clsx from 'clsx';
import {useDrag} from '@use-gesture/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {RootState} from '../redux/store';
import {
	disableBodyScroll,
	enableBodyScroll,
	clearAllBodyScrollLocks,
} from 'body-scroll-lock';
import {useEffect, useRef} from 'react';
import {setIsOpened} from '../redux/reducers/asideMenu';
import HeaderCart from './cart/HeaderCart';
import AsideDropDownMenu from './asideMenu/AsideDropDownMenu';

export default function AsideMenu() {
	const rootEl = useRef(null);
	const isOpened = useAppSelector(
		(state: RootState) => state.asideMenu.isOpened
	);
	const mainMenu = useAppSelector((state: RootState) => state.menus.main);
	// console.log('AsideMenu', mainMenu);
	const dispatch = useAppDispatch();
	const gest = useDrag(({swipe: [swipeX]}) => {
		// console.log('gesture', swipeX);
		if (swipeX === 1) closeIfOpened();
	});

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
	}, [isOpened]); //eslint-disable-line

	return (
		<aside
			{...gest()}
			className={clsx('aside-menu', {'aside-menu_visible': isOpened})}
			ref={rootEl}
			style={{touchAction: 'none'}}
		>
			<div className='aside-menu__header-container'>
				<HeaderCart horizontal />
				<FontAwesomeIcon icon={faTimes} />
			</div>
			<nav>
				<AsideDropDownMenu items={mainMenu || []} />
			</nav>
		</aside>
	);
}
