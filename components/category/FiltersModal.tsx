import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function FiltersModal({show, setShow, children}: FiltersModalProps) {
	// const onHide = () => setShow(false);
	return (
		<Modal show={show} onHide={() => setShow(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Back to products</Modal.Title>
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