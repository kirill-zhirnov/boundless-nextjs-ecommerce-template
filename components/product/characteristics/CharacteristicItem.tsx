import {INonVariantCaracteristic} from 'boundless-api-client';

export default function CharacteristicItem({characteristic}: {characteristic: INonVariantCaracteristic}) {
	return (
		<>
			<dl className='product-attrs__item'>
				<dt className='product-attrs__item-name-wrapper'>
					<span className='product-attrs__item-name'>
						{characteristic.title}
					</span>
				</dt>
				<dd className='product-attrs__item-value'>
					{characteristic.value && <div>{characteristic.value}</div>}
					{characteristic.cases?.map(caseItem => (
						<div key={caseItem.id}>{caseItem.title}</div>
					))}
				</dd>
			</dl>
			<div itemProp='additionalProperty' itemScope itemType='//schema.org/PropertyValue'>
				<meta itemProp='name' content={characteristic.title} />
				<meta itemProp='value' content={characteristic.value || characteristic.cases?.map(el => el.title).join(', ')} />
			</div>
		</>
	);
}