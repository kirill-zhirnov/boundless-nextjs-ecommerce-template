import {INonVariantCaracteristic} from 'boundless-api-client';

export default function CaracteristicItem({characteristic}: {characteristic: INonVariantCaracteristic}) {
	return (
		<>
			<dl className='d-flex gap-2 my-2 align-items-start'>
				<dt className='w-50'>
					{characteristic.title}
				</dt>
				<dd className='w-50 mb-0'>
					{characteristic.value && <div>{characteristic.value}</div>}
					{characteristic.cases?.map(caseItem => (
						<div key={caseItem.id}>{caseItem.title}</div>
					))}
				</dd>
			</dl>
			<div itemProp='additionalProperty' itemScope itemType='http://schema.org/PropertyValue'>
				<meta itemProp='name' content={characteristic.title} />
				<meta itemProp='value' content={characteristic.value || characteristic.cases?.map(el => el.title).join(', ')} />
			</div>
		</>
	);
}