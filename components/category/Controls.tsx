import {TQuery} from '../../@types/common';
import SortButtons from '../SortButtons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlidersH} from '@fortawesome/free-solid-svg-icons/faSlidersH';

export default function CaregoryControls({params, onSort, onMobileShow}: ControlBarProps) {
	return (
		<div className='category-controls'>
			<div className='category-controls__mobile'>
				<button className='btn btn-outline-secondary category-controls__toggle-filters' onClick={onMobileShow}>
					<FontAwesomeIcon className='me-2' icon={faSlidersH} />
					Filters
				</button>
			</div>
			<SortButtons params={params} onSort={onSort} />
		</div>
	);
}

interface ControlBarProps {
	params: TQuery;
	onSort: (query: TQuery) => void;
	onMobileShow: (e: React.MouseEvent) => void;
}