import {IFilterFieldProp} from 'boundless-api-client';
import {IFilterParams} from '../FilterFields';

export default function PriceField({valueMin, valueMax, setValue, filterField}: PriceFilterFieldProps) {
	return (
		<div className='row py-2'>
			<div className='mb-1'><strong>Price</strong></div>
			<div className='col-6 col-sm-12 col-lg-6 d-flex gap-1 align-items-center mb-2'>
				<div>From:</div>
				<input
					className='form-control form-control-sm'
					type='number'
					name='min'
					min={filterField?.range?.min || 0}
					max={filterField?.range?.max || undefined}
					value={valueMin || ''}
					onChange={(evt) => setValue('price_min', evt.target.value)}
					placeholder={String(filterField?.range?.min ?? '')}
				/>
			</div>
			<div className='col-6 col-sm-12 col-lg-6 d-flex gap-1 align-items-center mb-2'>
				To:
				<input
					className='form-control form-control-sm'
					type='number'
					name='max'
					min={filterField?.range?.min || 0}
					max={filterField?.range?.max || undefined}
					value={valueMax || ''}
					onChange={(evt) => setValue('price_max', evt.target.value)}
					placeholder={String(filterField?.range?.max ?? '')}
				/>
			</div>
		</div>
	);
}

interface PriceFilterFieldProps {
	setValue: (key: keyof IFilterParams, value: number | string | null) => void;
	valueMin: number | undefined;
	valueMax: number | undefined;
	filterField: IFilterFieldProp | undefined;
}