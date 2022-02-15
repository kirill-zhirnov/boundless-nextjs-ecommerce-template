import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent} from 'react';

export default function TextCharacteristic({field, onChange, values, idsPrefix}: IFilterFieldProps) {
	const characteristic = field.characteristic!;
	const id = `${idsPrefix}filter_prop_${characteristic.characteristic_id}`;

	const onInput = (e: ChangeEvent<HTMLInputElement>) => {
		onChange({props: {[characteristic.characteristic_id]: e.target.value}});
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