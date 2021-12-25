import {ICharacteristic, IFilterFieldProp} from 'boundless-api-client';
import {IFilterParams} from '../FilterFields';

export default function CharacteristicField({characteristic, setValue, filterField}: CharacteristicFieldProps) {
	return (
		<div className='row py-2'>
			<div className='mb-1'><strong>{characteristic.title}</strong></div>
			<div className='d-flex gap-1 flex-wrap'>
				{characteristic.cases.map((charCase,i) => (
					<div key={charCase.case_id}>
						<input type='checkbox' className='btn-check' id={String(charCase.case_id)} />
						<label className='btn btn-outline-secondary btn-sm' htmlFor={String(charCase.case_id)}>
							{charCase.title} ({filterField?.characteristic?.cases[i].products_qty || 0})
						</label>
					</div>
				))}
			</div>
		</div>
	);
}

interface CharacteristicFieldProps {
	setValue: (key: keyof IFilterParams, value: number | string | null) => void;
	characteristic: ICharacteristic;
	filterField: IFilterFieldProp | undefined;
}