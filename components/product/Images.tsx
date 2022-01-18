import React, {useState} from 'react';
import {IProductImage} from 'boundless-api-client/types/image';
import clsx from 'clsx';
import ProductImage from './ProductImage';
import {getMetaImgUrl, productImgRatio} from '../../lib/imgs';
import ImagesSlider from './ImagesSlider';
import NoImage from '../NoImage';
import {IProductItem} from 'boundless-api-client';

export default function ProductImages({product}: {product: IProductItem}) {
	const [activeImg, setActiveImg] = useState(0);

	const onThumbClick = (e: React.MouseEvent, index: number) => {
		e.preventDefault();
		setActiveImg(index);
	};

	const images = product.images;
	if (!images || !images.length)
		return <NoImage ratio={productImgRatio || '1-1'} />;

	return (
		<>
			<div className='product-gallery d-none d-md-flex'>
				<ul className='product-gallery__thumbs list-unstyled'>
					{images.map((image, i) => (
						<li
							className={clsx('product-gallery__thumb', {active: activeImg === i})}
							key={image.image_id}
							onMouseEnter={() => setActiveImg(i)}
						>
							<a href='#' className='product-gallery__thumb-link' onClick={(e) => onThumbClick(e, i)}>
								<ProductImage image={image.image} maxSize={100} alt={image.alt || product.text.title} preserveRatio={true} />
							</a>
							<meta itemProp='image' content={getMetaImgUrl(image.image)} />
						</li>
					))}
				</ul>
				<figure className='product-gallery__big-img'>
					<a href='#' onClick={(e) => e.preventDefault()}>
						<ProductImage image={images[activeImg].image} maxSize={800} alt={images[activeImg].alt || images[activeImg].description!} />
					</a>
					<meta itemProp='image' content={getMetaImgUrl(images[activeImg].image)} />
					<figcaption>
						{images[activeImg].description!}
					</figcaption>
				</figure>
			</div>

			<div className='d-block d-md-none'>
				<ImagesSlider images={images}/>
			</div>
		</>
	);
}