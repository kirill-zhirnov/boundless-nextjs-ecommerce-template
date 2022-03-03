import {Swiper, SwiperProps, SwiperSlide} from 'swiper/react';
import {Navigation, Scrollbar, Pagination} from 'swiper';
import clsx from 'clsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import SwiperSliderSlide, {ISwiperSliderSlide} from './swiperSlider/SwiperSliderSlide';
import {PaginationOptions} from 'swiper/types';

export default function SwiperSlider({className, slideClassName, showPrevNext, swiperProps, roundCorners, size, pagination, slides}: ProductsSliderProps) {
	return (
		<div className={clsx(
			'swiper-slider',
			roundCorners && 'swiper-slider_rounded',
			size && `swiper-slider_size-${size}`,
			className || ''
		)}>
			<Swiper
				className='swiper-slider__swiper'
				grabCursor={true}
				modules={[Navigation, Scrollbar, Pagination]}
				navigation={showPrevNext
					? {
						prevEl: '.swiper-slider__prev',
						nextEl: '.swiper-slider__next'
					}
					: false}
				pagination={pagination
					? {
						clickable: true,
						type: pagination as PaginationOptions['type']
					} : false}
				watchOverflow={true}
				{...(swiperProps || {})}
			>
				{slides.map((slide, i) =>
					<SwiperSlide className={clsx('swiper-slider__slide', slideClassName || '')} key={i} >
						<SwiperSliderSlide {...slide} />
					</SwiperSlide>)}
			</Swiper>
			{showPrevNext && <>
				<a href='#' className='swiper-slider__prev'><FontAwesomeIcon icon={faChevronLeft} /></a>
				<a href='#' className='swiper-slider__next'><FontAwesomeIcon icon={faChevronRight} /></a>
			</>}
		</div >
	);
}

interface ProductsSliderProps {
	className?: string;
	slideClassName?: string;
	showPrevNext?: boolean;
	pagination?: PaginationOptions['type'];
	roundCorners?: boolean;
	size?: 'small' | 'medium' | 'large';
	swiperProps?: SwiperProps;
	slides: ISwiperSliderSlide[];
}