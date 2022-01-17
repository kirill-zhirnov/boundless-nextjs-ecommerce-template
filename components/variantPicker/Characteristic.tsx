import {IVariantCharacteristic, IVariantIdCombinations} from 'boundless-api-client';
import {useEffect, useRef} from 'react';

export default function VariantCharacteristic({characteristic, values, onSelect, idCombinations}: IVariantCharProps) {
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

	return (
		<>
			<div className='title'>{`${characteristic.title}: `}</div>
			<div className='cases d-flex gap-2 flex-wrap'>
				{characteristic.cases.map(caseItem => (
					<div key={caseItem.id}>
						<input
							autoComplete='off'
							className='btn-check'
							disabled={!checkAvailable(caseItem.id)}
							name={`characteristic-${characteristic.id}`}
							onChange={() => onSubmit(caseItem.id)}
							type='radio'
							checked={value === caseItem.id}
							value={caseItem.id}
							id={'case-' + caseItem.id}
						/>
						<label className='btn btn-outline-secondary btn-sm' htmlFor={'case-' + caseItem.id}>
							{caseItem.title}
						</label>
					</div>
				))}
			</div>
		</>
	);
}

interface IVariantCharProps {
	characteristic: IVariantCharacteristic;
	values: {[key: number]: number};
	onSelect: (charId: number, caseId: number) => void;
	idCombinations: IVariantIdCombinations;
}