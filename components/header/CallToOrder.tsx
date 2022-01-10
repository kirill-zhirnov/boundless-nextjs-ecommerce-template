import clsx from 'clsx';
import Link from 'next/link';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {calcTotalPrice} from '../../lib/calculator';
import {hideCall2Order} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';
import ProductImage from '../productsList/ProductImage';
import ProductPrice from '../productsList/ProductPrice';

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
		<div className={clsx('call-to-order', !show && 'd-none')} onClick={(e) => e.stopPropagation()}>
			<div className='position-relative'>
				<h5>	Product added to cart</h5>
				<button className='btn-close btn-sm' onClick={hide} />
			</div>
			<hr className='my-0' />
			<div className='mt-3 d-flex gap-2 text-start'>
				<>
					{item?.image && <ProductImage image={item.image} alt={item?.product.title} maxSize={100}/>}
					{item?.product.title || ''}
				</>
			</div>
			{item?.prices && item.prices.length > 0 &&
				<div className='my-1'>
					<ProductPrice price={item?.prices[0]} className='d-inline'/> {` x ${qty} = ${item.prices[0].value ? calcTotalPrice(item.prices[0].value, qty!) : ''}`}
				</div>}
			<div className='mt-2 text-center'>
				<Link href='/cart'>
					<a className='btn btn-primary'>Place an order</a>
				</Link>
			</div>
		</div >
	);
}