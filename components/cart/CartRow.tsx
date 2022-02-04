import {ICartItem} from 'boundless-api-client';
import Link from 'next/link';
import {formatMoney} from '../../lib/formatter';
import {getCartImg} from '../../lib/imgs';
import {getProductUrl} from '../../lib/urls';
import NoImage from '../NoImage';
import {TThumbRatio} from '../../@types/image';

export default function CartRow({item, rmItem, onQtyChange}: ICartRowProps) {
	return (
		<div className='cart-row row mb-2 py-3'>
			<div className='col-md-4 d-flex mb-2 align-items-start'>
				<div className='d-flex'>
					{item.vwItem?.image?.path
						? <Link href={getProductUrl(item.vwItem.product)}>
							<a className='img me-2'>
								<img src={getCartImg(item.vwItem?.image?.path)}
									alt={item.vwItem?.product?.title}
								/>
							</a>
						</Link>
						: <div className={'me-2'} style={{width: '60px'}}><NoImage ratio={TThumbRatio['1-1']} className={'bg-xs'}/></div>}
					<div className='py-1'>
						<div>
							<Link href={getProductUrl(item.vwItem.product)}>
								{item.vwItem?.product?.title || ''}
							</Link>
						</div>
						{item.vwItem.type === 'variant' && <div className='text-muted text-decoration-none'>{item.vwItem?.variant?.title || ''}</div>}
					</div>
				</div>
			</div>
			<div className='col-md-2 text-start text-md-center mb-2 py-1'>
				<span className='d-inline d-md-none'><strong>Price: </strong></span>
				{formatMoney(item.itemPrice.final_price)}
			</div>
			<div className='col-md-2 text-start text-md-center mb-2'>
				<span className='d-inline d-md-none'><strong>Qty: </strong></span>
				<div className='cart-qty-input input-group input-group-sm d-inline-flex'>
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
			<div className='col-md-2 text-start text-md-center mb-2 py-1'>
				<span className='d-inline d-md-none'><strong>Total: </strong></span>
				{formatMoney(parseInt(item.itemPrice.final_price || '') * item.qty)}</div>
			<div className='col-md-2 text-start text-md-center mb-2'>
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