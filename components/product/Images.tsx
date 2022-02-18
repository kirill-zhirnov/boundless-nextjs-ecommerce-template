import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import ProductImage from './ProductImage';
import {getMetaImgUrl, getProductImg, productImgRatio} from '../../lib/imgs';
import NoImage from '../NoImage';
import {IProductItem} from 'boundless-api-client';
import dynamic from 'next/dynamic';
import {Item, Gallery, useGallery} from 'react-photoswipe-gallery';

import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
const ImagesSlider = dynamic(() => import('./ImagesSlider'), {ssr: false});

export default function ProductImagesWrapper({product}: {product: IProductItem}) {
	return (
		<Gallery>
			<ProductImages product={product} />
		</Gallery>
	);
}

function ProductImages({product}: {product: IProductItem}) {
	const [activeImg, setActiveImg] = useState(0);
	const images = product.images;
	const {open: openLighBox} = useGallery();

	const onImageClick = (index: number, e: React.MouseEvent) => {
		e.preventDefault();
		openLighBox(index);
	};

	const images4Gallery = useMemo(() => (images || []).map(image => getProductImg(image.image, 1800, false)), [images]);

	if (!images || !images.length)
		return <NoImage ratio={productImgRatio || '1-1'} />;

	return (
		<>
			<div className='product-gallery d-none d-md-flex'>
				<ul className='product-gallery__thumbs list-unstyled'>
					{images.map((image, i) => (
						<Item
							original={images4Gallery[i].src}
							width={images4Gallery[i].width}
							height={images4Gallery[i].height}
							id={image.image_id}
							key={image.image_id}
						>
							{({ref}) => (<li
								ref={ref as React.MutableRefObject<HTMLLIElement>}
								className={clsx('product-gallery__thumb', {active: activeImg === i})}
								key={image.image_id}
								onMouseEnter={() => setActiveImg(i)}
								onClick={() => setActiveImg(i)}
							>
								<a href='#' className='product-gallery__thumb-link' onClick={(e) => {
									e.preventDefault();
								}}>
									<ProductImage image={image.image} maxSize={100} alt={image.alt || product.text.title} preserveRatio={true} />
								</a>
								<meta itemProp='image' content={getMetaImgUrl(image.image)} />
							</li>)}
						</Item>
					))}
				</ul>
				<figure className='product-gallery__big-img'>
					<a href='#' onClick={onImageClick.bind(null, activeImg)}>
						<ProductImage image={images[activeImg].image} maxSize={800} alt={images[activeImg].alt || images[activeImg].description!} />
					</a>
					<meta itemProp='image' content={getMetaImgUrl(images[activeImg].image)} />
					<figcaption>
						{images[activeImg].description!}
					</figcaption>
				</figure>
			</div>

			<div className='d-block d-md-none'>
				<ImagesSlider images={images} onClick={openLighBox} />
			</div>
		</>
	);
}