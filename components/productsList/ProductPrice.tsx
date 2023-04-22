import {IProductPrice} from 'boundless-api-client';
import clsx from 'clsx';
import {getPriceForTpl} from '../../lib/product';
import useFormatCurrency from '../../hooks/useFormatCurrency';

export default function ProductPrice({price, className = 'products__price'}: {price: IProductPrice, className?: string}) {
	const tplPrice = getPriceForTpl(price);
	const {formatCurrency} = useFormatCurrency();

	if (tplPrice.price === null)
		return null;

	return (
		<div className={className}>
			{tplPrice.isFrom && <span className={'from'}>From:</span>}
			{tplPrice.oldPrice && <s className={'old'}>{formatCurrency(tplPrice.oldPrice)}</s>}
			<span className={clsx('current', {'has-old': tplPrice.oldPrice})}>
				{formatCurrency(tplPrice.price)}
			</span>
		</div>
	);
}