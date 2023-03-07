import {ICartItem} from 'boundless-api-client';
import Link from 'next/link';
import {formatMoney} from '../../lib/formatter';
import {getCartImg} from '../../lib/imgs';
import {getProductUrl} from '../../lib/urls';
import NoImage from '../NoImage';
import {TThumbRatio} from '../../@types/image';
import {calcTotalPrice} from '../../lib/calculator';

export default function CartRow({item, rmItem, onQtyChange}: ICartRowProps) {
	const imgPath = item.vwItem?.image?.path;
	const productUrl = getProductUrl(item.vwItem.product);

	const imgElement = imgPath
		? <img src={getCartImg(imgPath)}
			alt={item.vwItem?.product?.title}
		/>
		: <NoImage ratio={TThumbRatio['1-1']} className={'bg-xs'} />;

	return (
		<div className='cart-item row'>
			<div className='cart-item__description-col col-md-4'>
				<Link href={productUrl}>
					<a className='cart-item__img-link'>
						{imgElement}
					</a>
				</Link>
				<div className='cart-item__title'>
					<div>
						<Link href={productUrl}>
							{item.vwItem?.product?.title || ''}
						</Link>
					</div>
					{item.vwItem.type === 'variant' && <div className='text-muted'>{item.vwItem?.variant?.title || ''}</div>}
				</div>
			</div>
			<div className='cart-item__col col-md-2'>
				<span className='cart-items__label'><strong>Price: </strong></span>
				{formatMoney(item.itemPrice.final_price)}
			</div>
			<div className='cart-item__col cart-item__col_qty col-md-2'>
				<span className='cart-items__label'><strong>Qty: </strong></span>
				<div className='cart-item__qty-input input-group input-group-sm'>
					<button
						className='btn btn-outline-secondary text-center'
						type='button'
						style={{width: 25}}
						disabled={item.qty < 2}
						onClick={() => onQtyChange(item.qty - 1)}
					><>&ndash;</></button>
					<input
						type='number'
						className='form-control form-control-sm text-center'
						name={`qty[${item.item_id}]`}
						value={item.qty}
						min={1}
						onChange={(e) => onQtyChange(Number(e.target.value) || 0)}
					/>
					<button
						className='btn btn-outline-secondary text-center'
						type='button'
						style={{width: 25}}
						onClick={() => onQtyChange(item.qty + 1)}
					>+</button>
				</div>
			</div>
			<div className='cart-item__col col-md-2'>
				<span className='cart-items__label'><strong>Total: </strong></span>
				{calcTotalPrice(item.itemPrice.final_price!, item.qty)}</div>
			<div className='cart-item__col cart-item__col_rm col-md-2'>
				<button
					className='btn btn-sm btn-outline-secondary'
					onClick={rmItem}
				>
					Remove
				</button>
			</div>
		</div >
	);
}

interface ICartRowProps {
	item: ICartItem;
	rmItem: () => void;
	onQtyChange: (qty: number) => void
}