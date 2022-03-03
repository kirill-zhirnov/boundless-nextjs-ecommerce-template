import SwiperSlider from './SwiperSlider';

const slides = [
	{
		'img': 'https://i4431-static.my-sellios.ru/media/tpl-images/24/df/6703cb392146512eeb43899ff8cf.jpeg',
		'link': '',
		'caption': 'Три вещи нельзя скрыть: солнце, луну и истину.',
		'captionPosition': 'center',
		'useFilling': true,
		'fillingColor': '#000000',
		'fillingOpacity': 0.40
	},
	{
		'img': 'https://i4431-static.my-sellios.ru/media/tpl-images/a0/af/669bf3da0205acffd5f31d093e38.jpeg',
		'link': '',
		'caption': null,
		'captionPosition': null,
		'useFilling': false,
		'fillingColor': '#000000',
		'fillingOpacity': 0.4
	},
	{
		'img': 'https://i4431-static.my-sellios.ru/media/tpl-images/26/f0/7e3a35271c7bc381dfac2814cbe7.jpg',
		'link': '',
		'caption': 'Some text',
		'captionPosition': 'top',
		'useFilling': false,
		'fillingColor': '#000000',
		'fillingOpacity': 0.4
	}
];

export default function SliderWrapper() {
	return (
		<SwiperSlider
			showPrevNext
			roundCorners
			pagination='fraction'
			size={'small'}
			slides={slides}
		/>
	);
}