import {INonVariantCaracteristic} from 'boundless-api-client';
import CaracteristicItem from './CaracteristicItem';

export default function ProductCharacteristics({characteristics}: IProductCharacteristicsProps) {
	if (!characteristics.length) return <></>;

	return (
		<div className='product-characteristics'>
			{characteristics.map(characteristic => (
				<div className='product-characteristic' key={characteristic.id}>
					{characteristic.is_folder
						? <>
							<h6 className='text-center'>{characteristic.title}</h6>
							{characteristic.children?.map(child => (
								<CaracteristicItem characteristic={child} key={child.id} />
							))}
						</>
						: <CaracteristicItem characteristic={characteristic} />}
				</div>
			))}
		</div>
	);
}

interface IProductCharacteristicsProps {
	characteristics: INonVariantCaracteristic[];
}