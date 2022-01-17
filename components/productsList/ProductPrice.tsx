import {IProductPrice} from 'boundless-api-client/types/catalog/product';
import clsx from 'clsx';
import {formatMoney} from '../../lib/formatter';

export default function ProductPrice({price, className = 'products__price'}: {price: IPricePartial, className?: string}) {
	const {old, old_max, old_min, max, min, value} = price;
	if (!max && !min && !value) return <></>;
	const hasOld = !!old || !!old_min || !!old_max;

	return (
		<div className={className}>
			{!!min && <span className={'from'}>From:</span>}
			{hasOld && <s className={'old'}>{formatMoney(old_min || old)}</s>}
			<span className={clsx('current', {'has-old': hasOld})}>{formatMoney(min || value)}</span>
		</div>
	);
}

type IPricePartial = Pick<IProductPrice, 'old' | 'min' | 'old_max' | 'old_min' | 'max' | 'value'>