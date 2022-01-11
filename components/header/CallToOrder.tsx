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
		// dispatch(hideCall2Order());
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
		<div className={clsx('call-to-order', {opened: show})} onClick={(e) => e.stopPropagation()}>
			<h5 className={'call-to-order__header mb-3'}>
				Product added to cart
				<button className='btn-close btn-sm' onClick={hide} />
			</h5>
			<div className='call-to-order__item mb-3'>
				<>
					{item?.image && <ProductImage image={item.image} alt={item?.product.title} maxSize={100} />}
					<div className={'desc'}>
						<div>{item?.product.title || ''}</div>
						{item?.variant && <div className={'text-muted variant mt-1'}>{item.variant.title}</div>}
					</div>
				</>
			</div>
			{item?.prices && item.prices.length > 0 &&
				<div className='mb-3'>
					<ProductPrice price={item?.prices[0]} className='d-inline' /> {` x ${qty} = ${item.prices[0].value ? calcTotalPrice(item.prices[0].value, qty!) : ''}`}
				</div>}
			<div className='text-end'>
				<Link href='/cart'>
					<a className='btn btn-action btn-anim'>Place an order</a>
				</Link>
			</div>
		</div >
	);
}