import {IExtendedVariants, IProductVariant} from 'boundless-api-client';
import {useState} from 'react';
import VariantPickerCharacteristic from './variantPicker/Characteristic';
import {IVariantCombination} from 'boundless-api-client/src/types/catalog/variant';
import _isEqual from 'lodash/isEqual';
import clsx from 'clsx';

export default function ProductVariantPicker({extendedVariants, onChange, animateError}: IVariantPickerProps) {
	const {characteristics, list, combinations, idCombinations} = extendedVariants;
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
		<div className={clsx('variant-picker', {'animate__animated animate__shakeX': animateError})}>
			{characteristics.map(characteristic => (
				<VariantPickerCharacteristic characteristic={characteristic}
																		 key={characteristic.id}
																		 onSelectCase={onSelectCase}
																		 value={value}
																		 idCombinations={idCombinations}
																		 variants={list}
				/>
			))}
		</div>
	);
}

interface IVariantPickerProps {
	extendedVariants: IExtendedVariants;
	onChange?: (value: {[characteristicId: number]: number}, variant?: IProductVariant) => void,
	animateError: boolean;
}

const findVariantIdByCombinations = (value: {[key: number]: number}, combinations: IVariantCombination): null|string => {
	const requiredCombinations = Object.entries(value).map(([characteristicId, caseId]) => `${characteristicId}-${caseId}`);

	//eslint-disable-next-line
	const result = Object.entries(combinations).find(([variantId, variantCombination]) => _isEqual(requiredCombinations, variantCombination));

	return result ? result[0] : null;
};