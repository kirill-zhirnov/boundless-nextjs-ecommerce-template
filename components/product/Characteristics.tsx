import {IItemSize, INonVariantCaracteristic, IProductItemManufacturer} from 'boundless-api-client';
import React from 'react';
import CharacteristicItem from './characteristics/CharacteristicItem';
import Manufacturer from './characteristics/Manufacturer';
import SizeAndWeight from './characteristics/SizeAndWeight';

export default function ProductCharacteristics({characteristics, manufacturer, size}: IProductCharacteristicsProps) {
	if (!characteristics.length) return null;

	return (
		<div className='product-attrs'>
			{characteristics.map(characteristic => (
				<React.Fragment key={characteristic.id}>
					{characteristic.is_folder
						? <div className='product-attrs__group'>
							<h3 className='product-attrs__group-header'>{characteristic.title}</h3>
							{characteristic.children?.map(child => (
								<CharacteristicItem characteristic={child} key={child.id} />
							))}
						</div>
						: <CharacteristicItem characteristic={characteristic} />}
				</React.Fragment>
			))}
			{manufacturer && <Manufacturer manufacturer={manufacturer} />}
			{size && <SizeAndWeight size={size} />}
		</div>
	);
}

interface IProductCharacteristicsProps {
	characteristics: INonVariantCaracteristic[];
	manufacturer: IProductItemManufacturer|null;
	size: IItemSize|null;
}