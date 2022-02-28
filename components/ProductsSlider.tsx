import {useRef} from 'react';
import {IProduct} from 'boundless-api-client';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Scrollbar} from 'swiper';
import SliderProductItem from './productsSlider/SliderProductItem';
import {TQuery} from '../@types/common';
import ProductItemLoader from './productsSlider/ProductItemLoader';

export default function ProductsSlider({products, query, loading}: {products: IProduct[], loading?: boolean, query?: TQuery}) {
	const swiper = useRef<SwiperCore | null>(null);

	return (
		<div className='products-slider'>
			<Swiper
				breakpoints={{
					450: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					750: {
						slidesPerView: 3,
						spaceBetween: 28,
					},
					992: {
						slidesPerView: 4,
						spaceBetween: 20,
					},
					1200: {
						slidesPerView: 5,
						spaceBetween: 20,
					},
				}}
				centerInsufficientSlides
				className='products-slider__swiper'
				grabCursor={true}
				modules={[Navigation, Scrollbar]}
				navigation
				onSwiper={(instance) => swiper.current = instance}
				scrollbar={{draggable: true}}
				slidesPerView={1}
				spaceBetween={0}
			>
				{loading
					? [...Array(5)].map((_, i) => (
						<SwiperSlide className='products-slider__slide' key={i} >
							<ProductItemLoader />
						</SwiperSlide>
					))
					: products.map((product) =>
						<SwiperSlide className='products-slider__slide' key={product.product_id} >
							<SliderProductItem product={product} key={product.product_id} query={query || {}} />
						</SwiperSlide>
					)}
			</Swiper>
		</div>
	);
}