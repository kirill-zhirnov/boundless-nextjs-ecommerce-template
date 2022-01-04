import clsx from 'clsx';
import Link from 'next/link';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {hideCall2Order} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';

export default function CallToOrder() {
	const dispatch = useAppDispatch();
	const show = useAppSelector((state: RootState) => state.cart.showCall2Order);
	const {item, qty} = useAppSelector((state: RootState) => state.cart.call2OrderData);

	const hide = () => {
		dispatch(hideCall2Order());
	};

	useEffect(() => {
		if (show) {
			document.body.addEventListener('click', hide);
		} else {
			document.body.removeEventListener('click', hide);
		}
		return () => {
			document.body.removeEventListener('click', hide);
		};
	}, [show]); //eslint-disable-line

	return (
		<div className={clsx('call-to-order', !show && 'd-none')} onClick={(e) => e.stopPropagation() }>
			<div className='position-relative'>
				Product added to cart
				<button className='btn-close btn-sm' onClick={hide} />
			</div>
			<hr className='my-0' />
			<div className='p-4'>{item?.product.title || ''}</div>
			<div className='mt-2 text-center'>
				<Link href='/cart'>
					<a className='btn btn-primary'>Place an order</a>
				</Link>
			</div>
		</div >
	);
}