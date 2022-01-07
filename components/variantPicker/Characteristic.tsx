import {IVariantCharacteristic, IVariantIdCombinations} from 'boundless-api-client';

export default function VariantCharacteristic({characteristic, values, onSelect, idCombinations}: IVariantCharProps) {
	const value = values[characteristic.id];

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
							onChange={() => onSelect(characteristic.id, caseItem.id)}
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