import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {RootState} from '../../redux/store';
import clsx from 'clsx';
import {setIsOpened} from '../../redux/reducers/asideMenu';

export default function AsideBackdrop() {
	const asideIsOpened = useAppSelector((state: RootState) => state.asideMenu.isOpened);
	const dispatch = useAppDispatch();

	const onClicked = () => dispatch(setIsOpened(false));

	return (
		<div className={clsx('aside-backdrop', {'aside-backdrop_visible': asideIsOpened})}
				 onClick={onClicked}
		/>
	);
}