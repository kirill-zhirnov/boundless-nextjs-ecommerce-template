import {TGetProductsInStock} from 'boundless-api-client';
import {IFilterParams} from '../FilterFields';

export default function StockField({inStock, setValue}: StockFilterFieldProps) {
	const checked = inStock === TGetProductsInStock.inStock;

	return (
		<div className='row py-2'>
			<div className='mb-1'><strong>Stock</strong></div>
			<div className='col-6 col-sm-12 col-lg-6 d-flex gap-1 align-items-center mb-2'>
				<div className='form-check'>
					<label className='form-check-label'>
						<input
							className='form-check-input'
							type='checkbox'
							value='1'
							checked={checked}
							onChange={(e) => setValue('in_stock', e.target.checked ? '1' :'')}
						/>
						Is in stock
					</label>
				</div>
			</div>
		</div>
	);
}

interface StockFilterFieldProps {
	setValue: (key: keyof IFilterParams, value: number | string | null) => void;
	inStock?: TGetProductsInStock;
}