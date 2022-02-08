import clsx from 'clsx';
import {IMenuItem} from '../../redux/reducers/menus';
import MenuItem from './MenuItem';

type TSubMenuProps = {
	children: IMenuItem[];
	className: string;
};

const SubMenu = ({children, className}: TSubMenuProps) => {
	// console.log('SubMenu', children);
	return (
		<div className={clsx(className)}>
			{children.map((item) => {
				return (
					<MenuItem key={item.title} item={item} className='aside-menu__item' />
				);
			})}
		</div>
	);
};

export default SubMenu;
