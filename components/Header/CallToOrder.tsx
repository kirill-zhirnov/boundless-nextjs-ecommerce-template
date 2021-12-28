import clsx from 'clsx';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {hideCall2Order} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';

export default function CallToOrder() {
	const dispatch = useAppDispatch();
	const show = useAppSelector((state: RootState) => state.cart.showCall2Order);
	const {product, qty} = useAppSelector((state: RootState) => state.cart.call2OrderData);

	useEffect(() => {
		const timeout = setTimeout(() => {
			dispatch(hideCall2Order());
		}, 4000);

		return () => {
			clearTimeout(timeout);
		};
	}, [show]); //eslint-disable-line

	return (
		<div className={clsx('call-to-order', !show && 'd-none')}>
			<div className='position-relative'>
				Product added to cart
				<button className='btn-close btn-sm' onClick={() => dispatch(hideCall2Order())}/>
			</div>
			<hr className='my-0' />
			<div className='p-4'>{product?.text.title || ''}</div>
			<div className='mt-2 text-center'>
				<button className='btn btn-primary'>Place an order</button>
			</div>
		</div>
	);
}