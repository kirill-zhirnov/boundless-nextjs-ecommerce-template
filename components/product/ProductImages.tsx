import React, {useState} from 'react';
import {IProductImage} from 'boundless-api-client/types/image';
import clsx from 'clsx';
import ProductImage from './ProductImage';
import {getMetaImgUrl} from '../../lib/services/imgs';
import ImagesSlider from './ImagesSlider';

export default function ProductImages({images}: {images: IProductImage[]}) {
	const [activeImg, setActiveImg] = useState(0);

	const onThumbClick = (e: React.MouseEvent, index: number) => {
		e.preventDefault();
		setActiveImg(index);
	};

	return (
		<div>
			{images.length > 0 ?
				<>
					<div className='d-none d-md-flex'>
						<ul className='list-unstyled thumbs-list flex-shrink-0'>
							{images.map((image, i) => (
								<li
									className={clsx('thumb mb-2', activeImg === i && 'active')}
									key={image.image_id}
									onMouseEnter={() => setActiveImg(i)}
								>
									<a href='#' className='d-flex justify-content-center align-content-center' onClick={(e) => onThumbClick(e, i)}>
										<ProductImage image={image.image} maxSize={100} alt={image.alt || image.description!} preserveRatio={true} />
									</a>
									<meta itemProp='image' content={getMetaImgUrl(image.image)} />
								</li>
							))}
						</ul>
						<figure className='big-img mx-5 flex-grow-1 text-center'>
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
				: <div className='text-center my-4'>Product has no images</div>}
		</div>
	);
}