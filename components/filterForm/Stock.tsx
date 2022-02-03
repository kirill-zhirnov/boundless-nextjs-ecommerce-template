import {IFilterFieldProps} from '../FilterForm';

export default function Stock({onChange, values}: IFilterFieldProps) {
	return (
		<div className={'mb-3'}>
			<label className='form-label'>Stock</label>
			<div className='form-check'>
				<label className='form-check-label'>
					<input className='form-check-input'
						type='checkbox'
						value={'1'}
						name={'in_stock'}
						onChange={(e) => onChange({in_stock: e.target.checked ? '1' : ''})}
						checked={values.in_stock == '1'}
					/>
					In stock
				</label>
			</div>

		</div>
	);
}