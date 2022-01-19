import {INonVariantCaracteristic} from 'boundless-api-client';
import CharacteristicItem from './characteristics/CharacteristicItem';

export default function ProductCharacteristics({characteristics}: IProductCharacteristicsProps) {
	if (!characteristics.length) return null;

	return (
		<div className='product-characteristics'>
			{characteristics.map(characteristic => (
				<div className='product-characteristic' key={characteristic.id}>
					{characteristic.is_folder
						? <>
							<h6>{characteristic.title}</h6>
							{characteristic.children?.map(child => (
								<CharacteristicItem characteristic={child} key={child.id} />
							))}
						</>
						: <CharacteristicItem characteristic={characteristic} />}
				</div>
			))}
		</div>
	);
}

interface IProductCharacteristicsProps {
	characteristics: INonVariantCaracteristic[];
}