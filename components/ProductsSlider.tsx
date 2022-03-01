import {useRef} from 'react';
import {IProduct} from 'boundless-api-client';
import {Swiper, SwiperProps, SwiperSlide} from 'swiper/react';
import SwiperCore, {Navigation, Scrollbar} from 'swiper';
import SliderProductItem from './productsSlider/SliderProductItem';
import ProductItemLoader from './productsSlider/ProductItemLoader';
import clsx from 'clsx';

export default function ProductsSlider({products, loading, className, swiperProps}: ProductsSliderProps) {
	const swiper = useRef<SwiperCore | null>(null);

	return (
		<div className={clsx('products-slider', className || '')}>
			<Swiper
				breakpoints={{
					450: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					750: {
						slidesPerView: 3,
						spaceBetween: 38,
					},
					992: {
						slidesPerView: 4,
						spaceBetween: 30,
					},
					1200: {
						slidesPerView: 5,
						spaceBetween: 30,
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
				spaceBetween={30}
				{...(swiperProps || {})}
			>
				{loading
					? [...Array(5)].map((_, i) => (
						<SwiperSlide className='products-slider__slide' key={i} >
							<ProductItemLoader />
						</SwiperSlide>
					))
					: products?.map((product) =>
						<SwiperSlide className='products-slider__slide' key={product.product_id} >
							<SliderProductItem product={product} key={product.product_id} />
						</SwiperSlide>
					)}
			</Swiper>
		</div>
	);
}

interface ProductsSliderProps {
	products: IProduct[] | null;
	className?: string;
	loading?: boolean;
	swiperProps?: SwiperProps;
}