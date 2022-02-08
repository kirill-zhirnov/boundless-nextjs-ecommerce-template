import clsx from 'clsx';
import {IMenuItem} from '../../redux/reducers/menus';
import {UnstyledChevron} from './Chevron/Chevron';
import SubMenu from './SubMenu';

type TMenuItemProps = {
	item: IMenuItem;
	className?: string;
};

const MenuItem = ({item, className}: TMenuItemProps) => {
	return (
		<>
			<div className={clsx(className)}>
				<div>{item.title}</div>
				{item.children && <UnstyledChevron />}
				{item.children && (
					<SubMenu children={item.children} className='aside-menu__submenu' />
				)}
			</div>
		</>
	);
};

export default MenuItem;
