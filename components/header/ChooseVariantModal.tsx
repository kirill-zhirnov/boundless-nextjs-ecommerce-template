import Modal from 'react-bootstrap/Modal';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {hideVariantModal} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';
import ProductVariantAndBuy from '../product/VariantAndBuy';
import ProductImage from '../productsList/ProductImage';
import NoImage from '../NoImage';
import {TThumbRatio} from 'boundless-api-client';

export default function ChooseVariantModal() {
	const dispatch = useAppDispatch();
	const show = useAppSelector((state: RootState) => state.cart.showVariantModal);
	const {product} = useAppSelector((state: RootState) => state.cart.variantModalData);

	const onHide = () => dispatch(hideVariantModal());
	const image = product ? product.images.find(({is_default}) => is_default) : undefined;

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Please, choose a variant:</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{product && <>
					<div className={'d-flex mb-3'}>
						<div className={'me-2'} style={{width: '60px'}}>
							{image
								? <ProductImage image={image.image} maxSize={60} />
								: <NoImage ratio={TThumbRatio['1-1']} className={'bg-xs'} />
							}
						</div>
						<h6>{product.text.title}</h6>
					</div>
					<ProductVariantAndBuy product={product}
																onAddedToCart={onHide}
					/>
				</>}
			</Modal.Body>
		</Modal>
	);
}