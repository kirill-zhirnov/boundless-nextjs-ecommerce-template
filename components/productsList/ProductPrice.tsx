import {IProductPrice} from 'boundless-api-client/types/catalog/product';
import clsx from 'clsx';
import {formatMoney} from '../../lib/formatter';

export default function ProductPrice({price, className = 'product-item__price'}: {price: IPricePartial, className?: string}) {
	const {old, old_max, old_min, max, min, value} = price;
	if (!max && !min && !value) return <></>;
	const hasOld = !!old || !!old_min || !!old_max;

	return (
		<div className={className}>
			<span className={clsx('formatted-price', hasOld && 'has-old')}>
				{!!min && <span className='from'>From: </span>}
				{hasOld && <s>{formatMoney(old_min || old)}</s>}
				<span className='current'>{formatMoney(min || value)}</span>
			</span>
		</div>
	);
}

type IPricePartial = Pick<IProductPrice, 'old' | 'min' | 'old_max' | 'old_min' | 'max' | 'value'>