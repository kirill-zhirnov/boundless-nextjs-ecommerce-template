import {IExtendedVariants, IProductVariant} from 'boundless-api-client';
import {useState} from 'react';
import VariantPickerCharacteristic from './variantPicker/Characteristic';
import {IVariantCombination} from 'boundless-api-client/src/types/catalog/variant';
import _isEqual from 'lodash/isEqual';

export default function ProductVariantPicker({extendedVariants, onChange}: IVariantPickerProps) {
	const {characteristics, list, combinations} = extendedVariants;
	const [value, setValue] = useState<{[characteristicId: number]: number}>({});

	const onSelectCase = (characteristicId: number, caseId: number|null) => {
		const newValue = {...value};
		if (caseId === null) {
			delete newValue[characteristicId];
		} else {
			newValue[characteristicId] = caseId;
		}

		setValue(newValue);

		let variant: IProductVariant|undefined;
		const variantId = findVariantIdByCombinations(newValue, combinations);
		if (variantId) {
			variant = list.find(({variant_id}) => String(variant_id) == variantId);
		}

		if (onChange) {
			onChange(newValue, variant);
		}
	};

	return (
		<div className='variant-picker'>
			{characteristics.map(characteristic => (
				<VariantPickerCharacteristic characteristic={characteristic}
																		 key={characteristic.id}
																		 onSelectCase={onSelectCase}
																		 value={value}
					// values={values}
					// idCombinations={idCombinations}
					// onSelect={variantSelected}
				/>
				// d-flex gap-2 mb-3 align-items-center
				// <div className='variant-picker__characteristic' >
				// </div>
			))}
			{/*{error && <div className='alert alert-danger' role='alert'>*/}
			{/*	Please pick a product variant*/}
			{/*</div>}*/}
		</div>
	);
}

interface IVariantPickerProps {
	extendedVariants: IExtendedVariants;
	onChange?: (value: {[characteristicId: number]: number}, variant?: IProductVariant) => void
}

const findVariantIdByCombinations = (value: {[key: number]: number}, combinations: IVariantCombination): null|string => {
	const requiredCombinations = Object.entries(value).map(([characteristicId, caseId]) => `${characteristicId}-${caseId}`);

	const result = Object.entries(combinations).find(([variantId, variantCombination]) => {
		return _isEqual(requiredCombinations, variantCombination);
	});

	return result ? result[0] : null;
};