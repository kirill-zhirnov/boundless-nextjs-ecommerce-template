import {formatMoney} from '../../lib/formatter';
import Link from 'next/link';
import {useCart} from '../../hooks/cart';
import clsx from 'clsx';

export default function HeaderCart({
	className,
	horizontal = false,
}: {
	className?: string;
	horizontal?: boolean;
}) {
	const {total} = useCart();
	const isEmpty = !total || !total.qty;
	// const isDoubleQty = total?.qty && total?.qty > 9 ? true : false;

	return (
		<Link href={'/cart'}>
			<a
				className={clsx(
					'cart-header',
					{
						'cart-header_empty': isEmpty,
						'cart-header_active': !isEmpty,
						'cart-header_horizontal': horizontal,
					},
					className
				)}
			>
				<span
					className={clsx('cart-header__icon', {
						'cart-header__icon_horizontal': horizontal,
					})}
					data-qty={total?.qty.toString() ?? '0'}
				/>
				{/* <b
					className={clsx('cart-header__qty', {
						'cart-header__qty_double': isDoubleQty,
					})}
				>
					{total?.qty ?? 0}
				</b> */}
				<div
					className={clsx('cart-header__total', {
						'cart-header__total_horizontal': horizontal,
					})}
				>
					{formatMoney(total?.total || 0)}
				</div>
			</a>
		</Link>
	);
}
