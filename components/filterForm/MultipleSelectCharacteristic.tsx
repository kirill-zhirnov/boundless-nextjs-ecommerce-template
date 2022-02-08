import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent, useEffect, useState} from 'react';
import {ICharacteristicCase} from 'boundless-api-client';
import Collapse from 'react-bootstrap/Collapse';

export default function MultipleSelectCharacteristic({field, onChange, values, displayLimit, idsPrefix}: IFilterFieldProps) {
	const characteristic = field.characteristic!;
	const [visibleCases, setVisibleCases] = useState<ICharacteristicCase[]>([]);
	const [collapsedCases, setCollapsedCases] = useState<ICharacteristicCase[]>([]);
	const [showMore, setShowMore] = useState(false);

	useEffect(() => {
		const {cases} = field.characteristic!;
		if (!cases) return;
		const inStockCases = cases.filter(el => el.products_qty > 0);
		const outOfStockCases = cases.filter(el => !el.products_qty);
		const result = [...inStockCases, ...outOfStockCases];
		setVisibleCases(result.slice(0, displayLimit));
		setCollapsedCases(result.slice(displayLimit));

	}, [field.characteristic, displayLimit]);

	const onInput = (caseId: number, e: ChangeEvent<HTMLInputElement>) => {
		const value = (characteristic.characteristic_id in values.props && Array.isArray(values.props[characteristic.characteristic_id]))
			? [...values.props[characteristic.characteristic_id]] : []
			;
		const index = value.findIndex((item: string | number) => String(item) == String(caseId));

		if (e.target.checked) {
			if (index === -1) {
				value.push(caseId);
			}
		} else {
			if (index !== -1) {
				value.splice(index, 1);
			}
		}

		onChange({props: {[characteristic.characteristic_id]: value}});
	};

	const isChecked = (caseId: number): boolean => {
		const characteristicId = characteristic.characteristic_id;
		if (characteristicId in values.props && Array.isArray(values.props[characteristicId])) {
			return values.props[characteristicId].some((value: string | number) => String(value) == String(caseId));
		}

		return false;
	};

	const handleShowMore = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setShowMore(prev => !prev);
	};

	return (
		<div className={'mb-3'}>
			<label className='form-label'>{characteristic.title}</label>
			<CharacteristicCases
				caseItems={visibleCases}
				characteristicId={characteristic.characteristic_id}
				onInput={onInput}
				isChecked={isChecked}
				idsPrefix={`${idsPrefix}filter_props_${characteristic.characteristic_id}`}
			/>
			{collapsedCases.length > 0 && <>
				<Collapse in={showMore} key={characteristic.characteristic_id}>
					<div> {/* Intentional for smooth Collapse animation */}
						<div className='mt-1'>
							<CharacteristicCases
								caseItems={collapsedCases}
								characteristicId={characteristic.characteristic_id}
								onInput={onInput}
								isChecked={isChecked}
								idsPrefix={`${idsPrefix}filter_props_${characteristic.characteristic_id}`}
							/>
						</div>
					</div>
				</Collapse>
				<div className='mt-1'>
					<a
						className='small'
						href='#'
						onClick={handleShowMore}
					>
						<>{showMore ? 'Show less' : 'Show all'}</>
					</a>
				</div>
			</>}
		</div>
	);
}

const CharacteristicCases = ({caseItems, characteristicId, onInput, isChecked, idsPrefix}: ICasesProps) => {
	return (
		<div className='d-flex gap-1 flex-wrap'>
			{caseItems.map(({case_id, title, products_qty}) =>
				<div key={case_id}>
					<input className='btn-check'
						type='checkbox'
						value={case_id}
						name={`props[${characteristicId}][]`}
						id={`${idsPrefix}_${case_id}`}
						onChange={onInput.bind(null, case_id)}
						checked={isChecked(case_id)}
						disabled={products_qty === 0}
					/>
					<label className='btn btn-outline-secondary btn-sm' htmlFor={`${idsPrefix}_${case_id}`}>
						{title} ({products_qty})
					</label>
				</div>
			)}
		</div>
	);
};

interface ICasesProps {
	caseItems: ICharacteristicCase[];
	characteristicId: number;
	isChecked: (caseId: number) => boolean;
	onInput: (caseId: number, e: ChangeEvent<HTMLInputElement>) => void;
	idsPrefix: string;
}