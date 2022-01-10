import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent} from 'react';

export default function TextCharacteristic({field, onChange, values}: IFilterFieldProps) {
	const characteristic = field.characteristic!;
	const id = `filter_prop_${characteristic.characteristic_id}`;

	const onInput = (e: ChangeEvent<HTMLInputElement>) => {
		onChange('props', e.target.value, characteristic.characteristic_id);
	};

	return (
		<div className={'mb-3'}>
			<label htmlFor={id}
						 className='form-label'
			>
				{characteristic.title}
			</label>
			<input type='text'
						 className='form-control'
						 id={id}
						 value={values.props[characteristic.characteristic_id]}
						 onChange={onInput}
			/>
		</div>
	);
}