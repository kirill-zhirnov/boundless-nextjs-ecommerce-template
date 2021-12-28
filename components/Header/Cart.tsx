import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {getCartInfo} from '../../redux/actions/cart';
import {RootState} from '../../redux/store';
import {formatMoney} from '../../lib/formatter';
import Link from 'next/link';

export default function HeaderCart() {
	const dispatch = useAppDispatch();
	const total = useAppSelector((state: RootState) => state.cart.total);

	useEffect(() => {
		dispatch(getCartInfo());
	}, []); //eslint-disable-line

	return (
		<Link href={'/cart'}>
			<div className='cart mt-1 cursor-pointer'>
				<div className='cart__icon'>
					<div className='cart__notify'>{total?.qty ?? 0}</div>
				</div>
				{!!total?.qty && <div className='cart__detailed'>
					<div className='text'>Create an order</div>
					<div className='total-price'>
						<div className='total-price_sum'>{formatMoney(total?.total || 0)}</div>
					</div>
				</div>}
			</div>
		</Link>
	);
}