import React, {useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Pagination, Navigation, Scrollbar} from 'swiper';
import {IProductImage} from 'boundless-api-client/types/image';
import ProductImage from './ProductImage';

export default function ImagesSlider({images, onClick}: ImagesSliderProps) {
	const swiper = useRef<SwiperCore | null>(null);

	const onImageClick = (index: number, e: React.MouseEvent, ) => {
		e.preventDefault();
		onClick(index);
	};

	return (
		<div className='slider mb-5'>
			<div className={'slider__wrapper'}>
				<Swiper grabCursor={true}
					modules={[Navigation, Pagination, Scrollbar]}
					centerInsufficientSlides
					slidesPerView={1}
					spaceBetween={0}
					breakpoints={{
						576: {
							slidesPerView: 1,
							spaceBetween: 20,
						},
						768: {
							slidesPerView: 2,
							spaceBetween: 28,
						},
					}}
					pagination={{clickable: true}}
					scrollbar={{draggable: true}}
					navigation
					onSwiper={(instance) => swiper.current = instance}
				>
					{images.map((image, i) =>
						<SwiperSlide key={image.image_id} onClick={onImageClick.bind(null, i)} >
							<ProductImage image={image.image} maxSize={800} alt={image.alt || image.description!} />
						</SwiperSlide>
					)}
				</Swiper>
			</div>
		</div>
	);
}

interface ImagesSliderProps {
	images: IProductImage[];
	onClick: (i: number) => void;
}