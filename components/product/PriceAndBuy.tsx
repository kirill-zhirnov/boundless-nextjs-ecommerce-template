import {useState, useMemo, ChangeEvent, MouseEvent} from 'react';
import {IProductItem, IProductVariant} from 'boundless-api-client';
import clsx from 'clsx';
import {useAppDispatch} from '../../hooks/redux';
import {addItem2Cart} from '../../redux/actions/cart';
import {getPriceForTpl, IPriceForTpl} from '../../lib/product';
import {formatMoney} from '../../lib/formatter';
import currency from 'currency.js';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus';
import {faCartPlus} from '@fortawesome/free-solid-svg-icons/faCartPlus';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function ProductPriceAndBuy({product, selectedVariant, setError, onAddedToCart}: IPriceAndBuyProps) {
	const dispatch = useAppDispatch();
	const [qty, setQty] = useState<number>(1);

	const {price, benefit, isInStock} = useMemo(() => {
		let price: IPriceForTpl, benefit: number | null = null;
		if (selectedVariant) {
			price = {price: selectedVariant.price, oldPrice: selectedVariant.price_old};
		} else {
			price = getPriceForTpl(product.price);
		}

		if (price.price && price.oldPrice) {
			benefit = new currency(price.oldPrice).subtract(price.price).toJSON();
		}

		const isInStock = selectedVariant ? selectedVariant.in_stock : product.in_stock;

		return {price, benefit, isInStock};
	}, [product, selectedVariant]);

	const onBuyBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (product.has_variants && !selectedVariant) {
			setError('Please, choose a variant.');
			return;
		}

		const itemId = selectedVariant ? selectedVariant.item_id : product.item_id;
		dispatch(addItem2Cart(itemId, qty));

		if (onAddedToCart) {
			onAddedToCart(itemId, qty);
		}
	};

	return (
		<div className='price-and-buy'>
			{price.price && <p className={'price-and-buy__price'}>
				{price.isFrom && <span className={'price-and-buy__from'}>From:</span>}
				<span className={clsx('price-and-buy__current', {'has-old': price.oldPrice})}>{formatMoney(price.price)}</span>
				{price.oldPrice && <span className={'price-and-buy__old'}>{formatMoney(price.oldPrice)}</span>}
			</p>}
			{benefit && <p className={'price-and-buy__benefit'}>
				<label className={'price-and-buy__benefit-label'}>You save:</label>
				<span className={'price-and-buy__benefit-value'}>{formatMoney(benefit)}</span>
			</p>}
			{(!product.has_variants || selectedVariant) && <>
				<p className={clsx('price-and-buy__stock', {'in': isInStock, 'out': !isInStock})}>
					{isInStock && 'In stock'}
					{!isInStock && 'Out of stock'}
				</p>
				{(product.sku || selectedVariant?.sku) && <p>
					SKU: <span className='text-muted'>{selectedVariant?.sku || product.sku}</span>
				</p>}
			</>}
			{isInStock !== false && <div className={'price-and-buy__2-cart'}>
				<PriceAndBuyQty qty={qty}
					setQty={setQty}
				/>
				<div className={'price-and-buy__btns'}>
					<button type={'button'}
						className={'btn btn-action btn-anim btn-lg'}
						onClick={onBuyBtnClicked}
					>
						<FontAwesomeIcon icon={faCartPlus} /> Buy
					</button>
				</div>
			</div>}
		</div>
	);
}

interface IPriceAndBuyProps {
	product: Pick<IProductItem, 'price' | 'has_variants' | 'in_stock' | 'item_id' | 'sku'>;
	selectedVariant?: IProductVariant | null;
	setError: (error: null | string) => void;
	onAddedToCart?: (itemId: number, qty: number) => void;
}

const PriceAndBuyQty = ({qty, setQty}: {qty: number, setQty: (value: number) => void}) => {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => setQty(parseInt(e.target.value) || 1);
	const onBtnClicked = (diff: number, e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		let newQty = qty + diff;
		if (newQty < 1) {
			newQty = 1;
		}

		setQty(newQty);
	};

	return (
		<div className={'price-and-buy__qty input-group'}>
			<button type={'button'}
				className={'btn btn-outline-secondary text-center'}
				onClick={onBtnClicked.bind(null, -1)}
			>
				<FontAwesomeIcon icon={faMinus} />
			</button>
			<input type={'number'}
				className={'form-control'}
				value={qty}
				min={1}
				onChange={onChange}
			/>
			<button type={'button'}
				className={'btn btn-outline-secondary text-center'}
				onClick={onBtnClicked.bind(null, 1)}
			>
				<FontAwesomeIcon icon={faPlus} />
			</button>
		</div>
	);
};