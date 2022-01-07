import React, {useState} from 'react';
import {IProductImage} from 'boundless-api-client/types/image';
import clsx from 'clsx';
import ProductImage from './ProductImage';
import {getMetaImgUrl} from '../../lib/services/imgs';

export default function ProductImages({images}: {images: IProductImage[]}) {
	const [activeImg, setActiveImg] = useState(0);

	const onThumbClick = (e: React.MouseEvent, index: number) => {
		e.preventDefault();
		setActiveImg(index);
	};

	return (
		<>
			<div className='d-flex'>
				{images.length > 0 &&
					<>
						<ul className='list-unstyled thumbs-list'>
							{images.map((image, i) => (
								<li
									className={clsx('thumb mb-2', activeImg === i && 'active')}
									key={image.image_id}
									onMouseEnter={() => setActiveImg(i)}
								>
									<a href='#' onClick={(e) => onThumbClick(e, i)}>
										<ProductImage image={image.image} maxSize={100} alt={image.alt || image.description!} />
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
					</>}
			</div>
		</>
	);
}