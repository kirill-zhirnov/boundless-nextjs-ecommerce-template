import {formatMoney} from '../../lib/formatter';
import Link from 'next/link';
import {useCart} from '../../hooks/cart';
import clsx from 'clsx';

export default function HeaderCart({className}: {className?: string}) {
	const {total} = useCart();
	const isEmpty = !total || !total.qty;
	const isDoubleQty = (total?.qty && total?.qty > 9) ? true : false;

	return (
		<Link href={'/cart'}>
			<a className={clsx('cart-header', {
				'cart-header_empty': isEmpty,
				'cart-header_active': !isEmpty
			}, className)}>
				<span className={'cart-header__icon'} />
				<b className={clsx('cart-header__qty', {
					'cart-header__qty_double': isDoubleQty
				})}>{total?.qty ?? 0}</b>
				<div className={'cart-header__total'}>{formatMoney(total?.total || 0)}</div>
			</a>
		</Link>
	);
}