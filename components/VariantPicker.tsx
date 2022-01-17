import {IExtendedVariants, IProductVariant} from 'boundless-api-client';
import {useState} from 'react';
import VariantCharacteristic from './variantPicker/Characteristic';

export default function VariantPicker({variants, onPick, error, setError}: IVariantPickerProps) {
	const {characteristics, idCombinations, list} = variants;
	const [values, setValues] = useState<{[key: number]: number}>({});

	const variantSelected = (charId: number, caseId: number) => {
		const newValues = {...values, [charId]: caseId};
		setValues(newValues);
		setError(false);

		const filteredList = list.filter(variant => {
			let out = true;
			for (const [key, value] of Object.entries(newValues)) {
				out = out && idCombinations[variant.variant_id][key] === value;
			}
			return out;
		});

		onPick(filteredList);
	};

	return (
		<>
			<div className='variant-picker'>
				{characteristics.map(characteristic => (
					<div className='characteristic d-flex gap-2 mb-3 align-items-center' key={characteristic.id}>
						<VariantCharacteristic
							characteristic={characteristic}
							values={values}
							idCombinations={idCombinations}
							onSelect={variantSelected}
						/>
					</div>
				))}
				{error && <div className='alert alert-danger' role='alert'>
					Please pick a product variant
				</div>}
			</div>
		</>
	);
}

interface IVariantPickerProps {
	variants: IExtendedVariants;
	onPick: (variant: IProductVariant[]) => void;
	error: boolean;
	setError: (value: boolean) => void;
}