import {ICartItem} from 'boundless-api-client';
import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {apiClient} from '../../lib/api';
import {addPromise} from '../../redux/reducers/xhr';
import {RootState} from '../../redux/store';
import debounce from 'lodash/debounce';
import CartRow from './CartRow';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons/faShoppingCart';

export default function CartItems({items, setItems, total}: ICartItemsProps) {
	const dispatch = useAppDispatch();
	const submits = useRef<Promise<any>[]>([]);
	const mounted = useRef(false);
	const cartId = useAppSelector((state: RootState) => state.cart.cartId);
	const [submitting, setSubmitting] = useState(false);

	const checkBgSubmits = () => {
		const size = submits.current.length;
		if (!size || !mounted.current) return;

		setSubmitting(true);
		Promise.allSettled(submits.current)
			.then(() => {
				if (submits.current.length === size) {
					setSubmitting(false);
					submits.current = [];
				}
			});
	};

	const rmItem = (itemId: number) => {
		if (!cartId) return;
		if (!confirm('Are you sure?')) return;

		setSubmitting(true);
		const promise = apiClient.cart.removeFromCart(cartId, [itemId])
		.then(() => checkBgSubmits());

		submits.current.push(promise);
		dispatch(addPromise(promise));
		setItems(prevItems => prevItems.filter(el => el.item_id !== itemId));
	};

	const submitQty = async (itemId: number, newQty: number) => {
		if (!cartId) return;

		const promise = apiClient.cart.setCartItemsQty(cartId, [{
			item_id: itemId,
			qty: newQty
		}])
			.then(() => checkBgSubmits());
		submits.current.push(promise);
	};

	const debouncedSubmitQty = useMemo(() =>
		debounce(
			(itemId: number, qty: number) => submitQty(itemId, qty), 700, {leading: true}
		), []);// eslint-disable-line

	const onQtyChange = (itemId: number, newQty: number) => {
		setSubmitting(true);
		debouncedSubmitQty(itemId, newQty);

		setItems(prevFiltered => {
			const out = [...prevFiltered];
			const index = out.findIndex(el => el.item_id === itemId);
			if (index >= 0) {
				out[index].qty = newQty;
			}
			return out;
		});
	};

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	return (
		<>
			<div className='cart-items'>
				<div className='cart-items__thead row'>
					<div className='cart-items__thead-cell col-md-4'></div>
					<div className='cart-items__thead-cell col-md-2'>Price</div>
					<div className='cart-items__thead-cell col-md-2'>Qty</div>
					<div className='cart-items__thead-cell col-md-2'>Total</div>
					<div className='cart-items__thead-cell col-md-2'></div>
				</div>
				{items.map(item => (
					<CartRow
						item={item}
						rmItem={() => rmItem(item.item_id)} key={item.item_id}
						onQtyChange={(qty: number) => onQtyChange(item.item_id, qty)}
					/>
				))}
				<div className='cart-items__total-row row'>
					<div className='cart-items__total-cell cart-items__total-cell_title col-md-6'>Order Total:</div>
					<div className='cart-items__total-cell col-md-2'>
						<span className='cart-items__label'>Qty: </span>
						{total.qty}
					</div>
					<div className='cart-items__total-cell col-md-2'>
						<span className='cart-items__label'>Price: </span>
						{total.price}
					</div>
				</div>
			</div>
			<div className='cart-items__actions'>
				<button
					className='btn btn-action btn-lg btn-anim'
					disabled={submitting}
				>
					Proceed to checkout <FontAwesomeIcon icon={faShoppingCart} />
				</button>
			</div>
		</>
	);
}

interface ICartItemsProps {
	items: ICartItem[];
	setItems: Dispatch<SetStateAction<ICartItem[]>>;
	total: {qty: number, price: string}
}