import {IVariantCharacteristic, IVariantIdCombinations} from 'boundless-api-client';
import {ChangeEvent, useEffect, useRef} from 'react';

// values, onSelect, idCombinations
export default function VariantPickerCharacteristic({characteristic, onSelectCase, value}: IVariantCharProps) {
	/*
	const value = values[characteristic.id];
	const submitted = useRef(false);

	const checkAvailable = (caseId: number) => {
		const _values = {...values};
		delete _values[characteristic.id];
		if (!Object.keys(_values).length) return true;

		for (const combination of Object.values(idCombinations)) {
			let out = true;
			for (const [key, value] of Object.entries(_values)) {
				out = out && combination[key] === value;
			}
			if (out && combination[characteristic.id] === caseId) return true;
		}

		return false;
	};

	const checkRowAvailability = () => {
		const available = characteristic.cases.filter(caseItem => checkAvailable(caseItem.id));

		if (available.length === 1) {
			onSubmit(available[0].id);
		}
	};

	const onSubmit = (id: number) => {
		submitted.current = true;
		onSelect(characteristic.id, id);
	};

	useEffect(() => {
		if (!submitted.current) {
			checkRowAvailability();
		} else {
			submitted.current = false;
		}
	}, [values, characteristic]); //eslint-disable-line
*/

	const onInputChange = (caseId: number, e: ChangeEvent<HTMLInputElement>) => {
		onSelectCase(characteristic.id, e.currentTarget.checked ? caseId : null);
	};

	return (
		<div className={'variant-picker__characteristic'}>
			<div className={'variant-picker__title'}>{`${characteristic.title}:`}</div>
			<div className='variant-picker__cases'>
				{characteristic.cases.map(caseItem => {
					const id = `${characteristic.id}-case-${caseItem.id}`;

					return (
						<div key={caseItem.id}>
							<input autoComplete={'off'}
										 className={'btn-check'}
								// disabled={!checkAvailable(caseItem.id)}
										 name={`characteristic-${characteristic.id}`}
										 onChange={onInputChange.bind(null, caseItem.id)}
										 type={'radio'}
										 checked={value[characteristic.id] === caseItem.id}
										 value={caseItem.id}
										 id={id}
							/>
							<label className='btn btn-outline-secondary' htmlFor={id}>
								{caseItem.title}
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}

interface IVariantCharProps {
	characteristic: IVariantCharacteristic;
	value: {[key: number]: number};
	onSelectCase: (characteristicId: number, caseId: number|null) => void;
	// idCombinations: IVariantIdCombinations;
}