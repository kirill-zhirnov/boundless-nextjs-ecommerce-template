import {IVariantCharacteristic, IVariantIdCombinations} from 'boundless-api-client';
import {ChangeEvent, useEffect, useMemo, useRef, MouseEvent} from 'react';
import {IProductVariant} from 'boundless-api-client/src/types/catalog/variant';
import clsx from 'clsx';

// values, onSelect, idCombinations
export default function VariantPickerCharacteristic({characteristic, onSelectCase, value, idCombinations, variants}: IVariantCharProps) {
	const onLabelClicked = (caseId: number, e: MouseEvent<HTMLLabelElement>) => {
		e.preventDefault();
		onSelectCase(characteristic.id, value[characteristic.id] === caseId ? null : caseId);
	};

	return (
		<div className={'variant-picker__characteristic'}>
			<div className={'variant-picker__title'}>{`${characteristic.title}:`}</div>
			<div className='variant-picker__cases'>
				{characteristic.cases.map(caseItem => {
					const id = `${characteristic.id}-case-${caseItem.id}`;
					const availableVariants = findAvailableVariants(variants, idCombinations, {...value, ...{[characteristic.id]: caseItem.id}});
					const inStockVariants = availableVariants.filter(({in_stock}) => in_stock);

					return (
						<div key={caseItem.id}
								 className={'variant-picker__case-item'}
						>
							<input autoComplete={'off'}
										 className={'btn-check'}
										 disabled={!availableVariants.length}
										 name={`characteristic-${characteristic.id}`}
										 // onChange={onInputChange.bind(null, caseItem.id)}
										 type={'radio'}
										 checked={value[characteristic.id] === caseItem.id}
										 value={caseItem.id}
										 id={id}
							/>
							<label className={clsx('btn btn-outline-secondary', {'out-of-stock': !inStockVariants.length})}
										 htmlFor={id}
										 onClick={onLabelClicked.bind(null, caseItem.id)}
							>
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
	value: {[characteristicId: number|string]: number};
	onSelectCase: (characteristicId: number, caseId: number|null) => void;
	idCombinations: IVariantIdCombinations;
	variants: IProductVariant[]
}

const findAvailableVariants = (variants: IProductVariant[], idCombinations: IVariantIdCombinations, value: {[characteristicId: number|string]: number}): IProductVariant[] => {
	const variantIds: number[] = [];

	for (const [variantId, combination] of Object.entries(idCombinations)) {
		if (isValueSuitsCombination(combination, value)) {
			variantIds.push(parseInt(variantId));
		}
	}

	return variants.filter(({variant_id}) => variantIds.includes(variant_id));
};

const isValueSuitsCombination = (combination: {[characteristicId: number|string]: number}, value: {[characteristicId: number|string]: number}): boolean => {
	for (const [characteristicId, caseId] of Object.entries(value)) {
		if (!(characteristicId in combination) || combination[characteristicId] != caseId) {
			return false;
		}
	}

	return true;
};