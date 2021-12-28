import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {hideCall2Order} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';

export default function CallToOrder() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const show = useAppSelector((state: RootState) => state.cart.showCall2Order);
	const {product, qty} = useAppSelector((state: RootState) => state.cart.call2OrderData);

	useEffect(() => {
		let timeout: NodeJS.Timeout|null = null;
		if (show) {
			timeout = setTimeout(() => {
				dispatch(hideCall2Order());
			}, 4000);

		}
		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [show]); //eslint-disable-line

	useEffect(() => {
		if (router.pathname === '/cart') dispatch(hideCall2Order());
	}, [router.pathname]); //eslint-disable-line

	return (
		<div className={clsx('call-to-order', !show && 'd-none')}>
			<div className='position-relative'>
				Product added to cart
				<button className='btn-close btn-sm' onClick={() => dispatch(hideCall2Order())} />
			</div>
			<hr className='my-0' />
			<div className='p-4'>{product?.text.title || ''}</div>
			<div className='mt-2 text-center'>
				<Link href='/cart'>
					<a className='btn btn-primary'>Place an order</a>
				</Link>
			</div>
		</div >
	);
}