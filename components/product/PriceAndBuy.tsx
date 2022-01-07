import {useState} from 'react';
import {IProductItem, IProductVariant} from 'boundless-api-client';
import clsx from 'clsx';
import {getLowestPrice, getProductPrice} from '../../lib/services/price';
import {useAppDispatch} from '../../hooks/redux';
import {addItem2Cart} from '../../redux/actions/cart';

export default function PriceAndBuy({selectedVariants, setError, product}: IPriceAndBuyProps) {
	const dispatch = useAppDispatch();
	const hasVariants = product.has_variants || false;
	const price = hasVariants
		? getLowestPrice(selectedVariants)
		: getProductPrice(product.price, product.old_price);

	const variantPicked = selectedVariants.length === 1;
	const isVariantAvailable = selectedVariants.length > 0;
	const [variant] = selectedVariants;
	const inStock = hasVariants ? variant?.in_stock || false : product.in_stock || false;
	const [qty, setQty] = useState(1);

	const onSubmit = () => {
		if ((hasVariants && !variantPicked) || !inStock) {
			setError(true);
		} else {
			dispatch(addItem2Cart(hasVariants ? variant.item_id : product.item_id, qty));
		}
	};

	return (
		<div className='price-and-buy'>
			{isVariantAvailable || !hasVariants ? <>
				<p className={clsx('prices', price.price_old && 'with-old')}>
					{!variantPicked && <span className='from me-2'>From: </span>}
					<span className='price'>{price.price}</span>
					{price.price_old && <span className='price-old text-muted ms-2'><s>{price.price_old}</s></span>}
				</p>
				{price.benefit && <p className='benefit-price'>
					<label className='me-2'>You save:</label>
					<span>{price.benefit}</span>
				</p>}
				<p className={clsx('stock small text-muted', inStock ? 'in' : 'out')}>
					{inStock ? 'In stock' : 'Out of stock'}
				</p>
				{inStock &&
					<div className='d-flex gap-2 flex-wrap'>
						<div className='to-basket-qty-input input-group input-group-lg d-inline-flex' style={{maxWidth: 200}}>
							<button
								className='btn btn-outline-secondary text-center'
								type='button'
								style={{width: 40}}
								disabled={qty < 2}
								onClick={() => setQty(qty - 1)}
							><>&ndash;</></button>
							<input
								type='number'
								className='form-control text-center'
								value={qty}
								min={1}
								onChange={(e) => setQty(Number(e.target.value) || 0)}
							/>
							<button
								className='btn btn-outline-secondary text-center'
								type='button'
								style={{width: 40}}
								onClick={() => setQty(qty + 1)}
							>+</button>
						</div>
						<button className='btn btn-primary btn-lg' onClick={onSubmit}>Add to cart</button>
					</div>}
			</>
				: <h5 className='py-3'>Combination not available.</h5>}
		</div >
	);
}

interface IPriceAndBuyProps {
	selectedVariants: IProductVariant[] | [];
	setError: (value: boolean) => void;
	product: IProductItem;
}