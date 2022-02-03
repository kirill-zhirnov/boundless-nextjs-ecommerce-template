import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent} from 'react';
import {Range as RangeComponent, createSliderWithTooltip} from 'rc-slider';
import {formatMoney, getCurrencySymbol} from '../../lib/formatter';
import 'rc-slider/assets/index.css';

const Range = createSliderWithTooltip(RangeComponent);

export default function PriceRangeField({field, onChange, values}: IFilterFieldProps) {
	const onInput = (e: ChangeEvent<HTMLInputElement>) => onChange({[e.target.name]: e.target.value});
	const minValue = field.range?.min ? parseFloat(field.range.min) : 0;
	const maxValue = field.range?.max ? parseFloat(field.range?.max) : 0;

	const onRangeChange = ([min, max]: number[]) => {
		onChange({
			'price_min': min !== minValue ? min : '',
			'price_max': max !== maxValue ? max : ''
		});
	};

	return (
		<>
			<label className='form-label'>Price ({getCurrencySymbol()})</label>
			<Range
				allowCross={false}
				className='range-slider mb-2'
				max={maxValue}
				min={minValue}
				onChange={onRangeChange}
				step={0.01}
				tipFormatter={formatMoney}
				value={[values.price_min || minValue, values.price_max || maxValue]}
			/>
			<div className={'row'}>
				<div className={'col mb-3 d-flex gap-2 justify-content-center'}>
					<label htmlFor='filter_price_min' className='text-muted'><small>From</small></label>
					<input type='number'
						className='form-control form-control-sm'
						id='filter_price_min'
						min={minValue}
						placeholder={String(minValue || '')}
						name={'price_min'}
						step={0.01}
						onChange={onInput}
						value={values.price_min}
					/>
				</div>
				<div className={'col mb-3 d-flex gap-2 justify-content-center'}>
					<label htmlFor='filter_price_max' className='text-muted'><small>To</small></label>
					<input type='number'
						className='form-control form-control-sm'
						id='filter_price_max'
						max={maxValue}
						placeholder={String(maxValue || '')}
						name={'price_max'}
						step={0.01}
						onChange={onInput}
						value={values.price_max}
					/>
				</div>
			</div>
		</>
	);
}