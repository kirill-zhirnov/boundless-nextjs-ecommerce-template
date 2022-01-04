import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {hideAlert} from '../redux/reducers/alert';
import {RootState} from '../redux/store';

export default function AlertWidget() {
	const dispatch = useAppDispatch();
	const {show, text, type} = useAppSelector((state: RootState) => state.alert);

	const onClose = () => {
		dispatch(hideAlert());
	};

	return (
		<ToastContainer position={'top-end'} className='mt-3 me-3'>
			<Toast className={'border-0'} onClose={onClose} show={show} delay={3000} autohide bg={type} >
				<Toast.Body>
					<div className='d-flex'>
						<div className='alert-text'>
							{text}
						</div>
						<button className='btn-close btn-sm btn-close-white me-2 m-auto' onClick={onClose} />
					</div>
				</Toast.Body>
			</Toast>
		</ToastContainer>
	);
}