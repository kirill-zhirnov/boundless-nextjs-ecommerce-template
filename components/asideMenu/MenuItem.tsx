import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {IMenuItem} from '../../redux/reducers/menus';
import SubMenu from './SubMenu';

type TMenuItemProps = {
	item: IMenuItem;
	className?: string;
};

const MenuItem = ({item, className}: TMenuItemProps) => {
	return (
		<>
			<li className={className}>
				<a href={item.url}>{item.title}</a>
				{item.children && (
					<>
						<FontAwesomeIcon icon={faChevronRight} />
					</>
				)}
				<SubMenu
					children={item.children || []}
					className='aside-menu__submenu'
				/>
			</li>
		</>
	);
};

export default MenuItem;
