import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';

export default function FiltersModal({show, setShow, children}: FiltersModalProps) {
	const onBackClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShow(false);
	};

	return (
		<Modal show={show} onHide={() => setShow(false)}>
			<Modal.Header>
				<Modal.Title><a href={'#'} className='close-filter' onClick={onBackClick}>
					<FontAwesomeIcon className='me-2' icon={faArrowLeft} />
					Back to products
				</a></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{children}
			</Modal.Body>
		</Modal>
	);
}

interface FiltersModalProps {
	show: boolean;
	setShow: (show: boolean) => void;
	children: React.ReactNode[] | React.ReactNode;
}