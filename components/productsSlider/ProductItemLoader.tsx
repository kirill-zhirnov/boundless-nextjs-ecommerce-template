import ContentLoader from 'react-content-loader';

export default function ProductItemLoader() {
	return (
		<div className='products-slider__product in-stock'	>
			<div className='products-slider__product-wrapper'>
				<ProductImageLoader />
				<h4 className='products-slider__product-title'>
					<ProductTitle />
				</h4>
				<div className='products-slider__product-offer'>
					<ProductOffer />
				</div>
				<div className='text-center'>
					<CartButton />
				</div>
			</div>
		</div>
	);
}

const ProductOffer = () => (
	<ContentLoader
		speed={2}
		width={100}
		height={24}
		viewBox='0 0 100 24'
		backgroundColor={'#f3f3f3'}
		foregroundColor={'#ecebeb'}
	>
		<rect x='0' y='0' rx='3' ry='3' width='100' height='24' />
	</ContentLoader>
);


const ProductTitle = () => (
	<ContentLoader
		speed={2}
		width={140}
		height={42}
		backgroundColor={'#f3f3f3'}
		foregroundColor={'#ecebeb'}
	>
		<rect x='0' y='2' rx='3' ry='3' width='140' height='17' />
		<rect x='30' y='24' rx='3' ry='3' width='80' height='17' />
	</ContentLoader>
);


const CartButton = () => (
	<ContentLoader
		speed={2}
		width={130}
		height={38}
		viewBox='0 0 130 38'
		backgroundColor={'#f3f3f3'}
		foregroundColor={'#ecebeb'}
	>
		<rect x='0' y='0' rx='3' ry='3' width='130' height='38' />
	</ContentLoader>
);

const ProductImageLoader = () => (
	<ContentLoader
		speed={2}
		width={'100%'}
		height={200}
		backgroundColor={'#f3f3f3'}
		foregroundColor={'#ecebeb'}
	>
		<rect x='0' y='0' rx='3' ry='3' width='200' height='200' />
	</ContentLoader>
);