import {TQuery} from '../@types/common';
import SortButtons from './SortButtons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlidersH} from '@fortawesome/free-solid-svg-icons/faSlidersH';

export default function ControlBar({params, onSort, onMobileShow}: ControlBarProps) {
	return (
		<div className='control-bar'>
			<div className='mobile-filters'>
				<button className='btn btn-outline-secondary mobile-filters__button' onClick={onMobileShow}>
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