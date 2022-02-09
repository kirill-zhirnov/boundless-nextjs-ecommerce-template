import {IMenuItem} from '../../redux/reducers/menus';
import MenuItem from './MenuItem';

type TAsideDropDownMenu = {
	items: IMenuItem[];
};

const AsideDropDownMenu = ({items}: TAsideDropDownMenu) => {
	return (
		<ul>
			{items?.map((item) => (
				<MenuItem className='aside-menu__item' item={item} key={item.title} />
			))}
		</ul>
	);
};

export default AsideDropDownMenu;
