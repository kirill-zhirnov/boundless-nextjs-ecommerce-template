import {IFilterParams} from '../FilterFields';

export default function PriceField({valueMin, valueMax, setValue, min = null, max = null}: PriceFilterFieldProps) {
	return (
		<div className='row py-2'>
			<div className='mb-1'><strong>Price</strong></div>
			<div className='col-6 col-sm-12 col-lg-6 d-flex gap-1 align-items-center mb-2'>
				<div>From:</div>
				<input
					className='form-control form-control-sm'
					type='number'
					name='min'
					min={min || 0}
					max={max || undefined}
					value={valueMin || ''}
					onChange={(evt) => setValue('price_min', evt.target.value)}
					placeholder={String(min ?? '')}
				/>
			</div>
			<div className='col-6 col-sm-12 col-lg-6 d-flex gap-1 align-items-center mb-2'>
				To:
				<input
					className='form-control form-control-sm'
					type='number'
					name='max'
					min={min || 0}
					max={max || undefined}
					value={valueMax || ''}
					onChange={(evt) => setValue('price_max', evt.target.value)}
					placeholder={String(max ?? '')}
				/>
			</div>
		</div>
	);
}

interface PriceFilterFieldProps {
	setValue: (key: keyof IFilterParams, value: number | string | null) => void;
	valueMin: number | undefined;
	valueMax: number | undefined;
	min?: number | null;
	max?: number | null;
}