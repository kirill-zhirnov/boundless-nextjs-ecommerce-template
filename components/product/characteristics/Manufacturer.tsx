import {IProductItemManufacturer} from 'boundless-api-client';
import {getManufacturerImg} from '../../../lib/imgs';

export default function Manufacturer({manufacturer}: {manufacturer: IProductItemManufacturer}) {
	const image = manufacturer.image?.path ? getManufacturerImg(manufacturer.image) : null;
	const title = manufacturer.title || '';
	return (
		<>
			<dl className='product-attrs__item product-attrs__item_brand'>
				<dt className='product-attrs__item-name-wrapper'>
					<span className='product-attrs__item-name'>Brand</span>
				</dt>
				<dd className='product-attrs__item-value'>
					{image && <img
						className='product-attrs__brand-img'
						alt={title}
						src={image.src}
					/>}
					{title}
				</dd>
			</dl>
			<div itemProp='brand' itemScope itemType='//schema.org/Brand'>
				<meta itemProp='name' content={title} />
			</div>
		</>
	);
}