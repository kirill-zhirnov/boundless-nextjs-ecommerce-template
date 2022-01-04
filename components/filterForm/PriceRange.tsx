import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent} from 'react';

export default function PriceRangeField({field, onChange, values}: IFilterFieldProps) {
	const onInput = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.name, e.target.value);

	return (
		<div className={'row'}>
			<div className={'col mb-3'}>
				<label htmlFor='filter_price_min' className='form-label'>From</label>
				<input type='number'
							 className='form-control'
							 id='filter_price_min'
							 min={field.range?.min || 0}
							 placeholder={String(field.range?.min || '')}
							 name={'price_min'}
							 step={0.01}
							 onChange={onInput}
							 value={values.price_min}
				/>
			</div>
			<div className={'col mb-3'}>
				<label htmlFor='filter_price_max' className='form-label'>To</label>
				<input type='number'
							 className='form-control'
							 id='filter_price_max'
							 max={field.range?.max || 0}
							 placeholder={String(field.range?.max || '')}
							 name={'price_max'}
							 step={0.01}
							 onChange={onInput}
							 value={values.price_max}
				/>
			</div>
		</div>
	);
}