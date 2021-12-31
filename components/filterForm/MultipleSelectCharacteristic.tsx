import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent} from 'react';

export default function MultipleSelectCharacteristic({field, onChange, values}: IFilterFieldProps) {
	const characteristic = field.characteristic!;
	const idPrefix = `filter_props_${characteristic.characteristic_id}`;

	const onInput = (caseId: number, e: ChangeEvent<HTMLInputElement>) => {
		const value = (characteristic.characteristic_id in values.props && Array.isArray(values.props[characteristic.characteristic_id]))
			? values.props[characteristic.characteristic_id] : []
		;
		const index = value.findIndex((item: string|number) => String(item) == String(caseId));

		if (e.target.checked) {
			if (index === -1) {
				value.push(caseId);
			}
		} else {
			if (index !== -1) {
				value.splice(index, 1);
			}
		}

		onChange('props', value, characteristic.characteristic_id);
	};

	const isChecked = (caseId: number): boolean => {
		if (characteristic.characteristic_id in values.props && Array.isArray(values.props[characteristic.characteristic_id])) {
			const index = values.props[characteristic.characteristic_id].findIndex((value: string|number) => String(value) == String(caseId));
			return index !== -1;
		}

		return false;
	};

	return (
		<div className={'mb-3'}>
			<label className='form-label'>{characteristic.title}</label>
			{characteristic.cases?.map(({case_id, title, products_qty}) =>
				<div className='form-check' key={case_id}>
					<input className='form-check-input'
								 type='checkbox'
								 value={case_id}
								 name={`props[${characteristic.characteristic_id}][]`}
								 id={`${idPrefix}_${case_id}`}
								 onChange={onInput.bind(null, case_id)}
								 checked={isChecked(case_id)}
								 disabled={products_qty === 0}
					/>
					<label className='form-check-label' htmlFor={`${idPrefix}_${case_id}`}>
						{title} ({products_qty})
					</label>
				</div>
			)}
		</div>
	);
}