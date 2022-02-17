import clsx from 'clsx';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {calcTotalPrice} from '../../lib/calculator';
import {hideCall2Order} from '../../redux/reducers/cart';
import {RootState} from '../../redux/store';
import ProductImage from '../productsList/ProductImage';
import NoImage from '../NoImage';
import {TThumbRatio} from '../../@types/image';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {formatMoney} from '../../lib/formatter';
import {useEffect, useState} from 'react';

export default function CallToOrder() {
	const dispatch = useAppDispatch();
	const show = useAppSelector((state: RootState) => state.cart.showCall2Order);
	const [hiding, setHiding] = useState(false);
	const {item, qty} = useAppSelector((state: RootState) => state.cart.call2OrderData);

	const hide = () => {
		setHiding(true);
		setTimeout(() => {
			setHiding(false);
			dispatch(hideCall2Order());
		}, 300);
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
		<div className={clsx('call-to-order__wrapper', {'d-none': !show})}>
			<div className='container call-to-order__container'>
				<div className={clsx('call-to-order', {opened: show, hiding: hiding})} onClick={(e) => e.stopPropagation()}>
					<h5 className={'call-to-order__header mb-3'}>
						Product added to cart
						<button className='btn-close btn-sm' onClick={hide} />
					</h5>
					{item &&
						<>
							<div className='call-to-order__item mb-3'>
								<div className='call-to-order__img-wrapper'>
									{item.image
										? <ProductImage image={item.image} alt={item.product.title} maxSize={100} />
										: <NoImage ratio={TThumbRatio['1-1']} />
									}
								</div>
								<div className={'desc'}>
									<div>{item.product.title}</div>
									{item.variant && <div className={'text-muted variant mt-1'}>{item.variant.title}</div>}
								</div>
							</div>
							{item.prices.length > 0 &&
								<div className='mb-3'>
									{`${formatMoney(item.prices[0].value)} x ${qty} = ${calcTotalPrice(item.prices[0].value!, qty!)}`}
								</div>}
						</>
					}
					<div className='text-end'>
						<Link href='/cart'>
							<a className='btn btn-action btn-anim'>
								<FontAwesomeIcon icon={faCheck} /> Place an order
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}