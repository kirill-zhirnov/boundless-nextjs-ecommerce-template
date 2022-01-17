import clsx from 'clsx';
import {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {getLowestPrice} from '../../lib/price';
import {addItem2Cart} from '../../redux/actions/cart';
import {hideVariantModal} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';
import VariantPicker from '../VariantPicker';

export default function ChooseVariantModal() {
	const dispatch = useAppDispatch();
	const show = useAppSelector((state: RootState) => state.cart.showVariantModal);
	const {product, variants} = useAppSelector((state: RootState) => state.cart.variantModalData);
	const [error, setError] = useState(false);
	const [filteredVariants, setFilteredVariants] = useState(variants?.list || []);
	const [variant] = filteredVariants;
	const price = getLowestPrice(filteredVariants);
	const inStock = variant?.in_stock || false;

	const variantPicked = filteredVariants.length === 1;

	const onHide = () => {
		dispatch(hideVariantModal());
	};

	useEffect(() => {
		if (show) {
			setFilteredVariants(variants?.list || []);
		}
	}, [show, variants]);

	const onSubmit = () => {
		if (!variant || !variantPicked) return;

		dispatch(addItem2Cart(variant.item_id));
		onHide();
	};

	if (!variants) return <></>;

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Add to cart "{product?.text.title}"</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h5 className='mb-3'>Please select a variant:</h5>
				<VariantPicker variants={variants!} error={error} setError={setError} onPick={setFilteredVariants} />
				{variantPicked && <div className='modal-price'>
					<p className={clsx('prices', price.price_old && 'with-old')}>
						{!variantPicked && <span className='from me-2'>From: </span>}
						<span className='price'>{price.price}</span>
						{price.price_old && <span className='price-old text-muted ms-2'><s>{price.price_old}</s></span>}
					</p>
					<p className={clsx('stock small text-muted', inStock ? 'in' : 'out')}>
						{inStock ? 'In stock' : 'Out of stock'}
					</p>
				</div>}
			</Modal.Body>
			<Modal.Footer>
				<button className='btn btn-outline-secondary' onClick={onHide}>
					Cancel
				</button>
				<button type='button' className='btn btn-primary' onClick={onSubmit} disabled={!variantPicked || !inStock}>
					Add to cart
				</button>
			</Modal.Footer>
		</Modal>
	);
}