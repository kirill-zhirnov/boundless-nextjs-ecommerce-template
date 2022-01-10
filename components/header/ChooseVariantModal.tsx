import Modal from 'react-bootstrap/Modal';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {hideVariantModal} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';

export default function ChooseVariantModal() {
	const dispatch = useAppDispatch();
	const show = useAppSelector((state: RootState) => state.cart.showVariantModal);
	const {product, variants} = useAppSelector((state: RootState) => state.cart.variantModalData);

	const onHide = () => {
		dispatch(hideVariantModal());
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Add to cart "{product?.text.title}"</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Please select a variant:
				{variants?.map(variant => (
					<div key={variant.variant_id}>{variant.title}</div>
				))}
			</Modal.Body>
			<Modal.Footer>
				<button className='btn btn-outline-secondary' onClick={onHide}>
					Close
				</button>
				<button type='button' className='btn btn-primary' onClick={onHide}>
					Add to cart
				</button>
			</Modal.Footer>
		</Modal>
	);
}