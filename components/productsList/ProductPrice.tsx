import {IProductPrice} from 'boundless-api-client/types/catalog/product';
import clsx from 'clsx';
import {formatMoney} from '../../lib/formatter';
import {getPriceForTpl} from '../../lib/product';

export default function ProductPrice({price, className = 'products__price'}: {price: IProductPrice, className?: string}) {
	const tplPrice = getPriceForTpl(price);

	if (tplPrice.price === null)
		return null;

	return (
		<div className={className}>
			{tplPrice.isFrom && <span className={'from'}>From:</span>}
			{tplPrice.oldPrice && <s className={'old'}>{formatMoney(tplPrice.oldPrice)}</s>}
			<span className={clsx('current', {'has-old': tplPrice.oldPrice})}>
				{formatMoney(tplPrice.price)}
			</span>
		</div>
	);
}