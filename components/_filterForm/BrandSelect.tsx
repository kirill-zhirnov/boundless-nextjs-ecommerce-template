import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent} from 'react';

export default function BrandSelect({field, onChange, values}: IFilterFieldProps) {
	const manufacturers = field.manufacturers!;
	const {brand} = values;

	const onInput = (manufacturerId: number, e: ChangeEvent<HTMLInputElement>) => {
		const value = brand.filter((el: number) => el !== manufacturerId);

		if (e.target.checked) {
			value.push(manufacturerId);
		}

		onChange('brand', value);
	};

	return (
		<div className={'mb-3'}>
			<label className='form-label'>Brand</label>
			{manufacturers.map(({manufacturer_id, title, products_qty}) =>
				<div className='form-check' key={manufacturer_id}>
					<label className='form-check-label'>
						<input className='form-check-input'
							type='checkbox'
							value={manufacturer_id}
							name={'brand[]'}
							onChange={onInput.bind(null, manufacturer_id)}
							checked={values.brand.includes(manufacturer_id)}
							disabled={products_qty === 0}
						/>
						{title} ({products_qty})
					</label>
				</div>
			)}
		</div>
	);
}