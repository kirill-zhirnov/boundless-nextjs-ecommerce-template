import {IProduct} from 'boundless-api-client';
import clsx from 'clsx';
import {useAppDispatch} from '../../hooks/redux';
import {addItem2Cart} from '../../redux/actions/cart';
import {getProductUrl} from '../../lib/urls';
import Link from 'next/link';
import ProductLabels from '../product/Labels';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCartPlus} from '@fortawesome/free-solid-svg-icons/faCartPlus';
import NoImage from '../NoImage';
import {productImgRatio} from '../../lib/imgs';
import {TThumbRatio} from 'boundless-api-client';
import ProductPrice from '../productsList/ProductPrice';
import ProductListImage from '../productsList/ProductImage';
import {findSellingPrice} from '../../lib/product';

export default function SliderProductItem({product}: {product: IProduct}) {
	const productUrl = getProductUrl(product);
	const sellingPrice = findSellingPrice(product.prices);

	return (
		<div
			className={clsx('products-slider__product', {'in-stock': product.in_stock, 'out-of-stock': !product.in_stock})}
			data-id={product.product_id}
		>
			<div className='products-slider__product-wrapper'>
				<ProductImage
					product={product}
					productUrl={productUrl}
				/>
				<h4 className='products-slider__product-title'>
					<Link href={productUrl}>
						{product.title}
					</Link>
				</h4>
				<div className='products-slider__product-offer'>
					{sellingPrice && <ProductPrice price={sellingPrice} />}
				</div>
				<Product2Cart product={product} />
			</div>
		</div>
	);
}

function Product2Cart({product}: {product: IProduct}) {
	const dispatch = useAppDispatch();
	const onAddToCart = () => dispatch(addItem2Cart(product.item_id, 1));

	return (
		<div className='products-slider__to-cart'>
			{product.in_stock
				? <button
					type='button'
					className='btn btn-action'
					onClick={onAddToCart}
				>
					<FontAwesomeIcon icon={faCartPlus} /> Add to cart
				</button>
				: <span className={'text-muted'}>Out of stock</span>
			}
		</div>
	);
}

function ProductImage({product, productUrl}: {product: IProduct, productUrl: string}) {
	const img = product.images!.find(({is_default}) => is_default);

	return (
		<Link href={productUrl} className={'products-slider__product-image'}>
			{img
					? <ProductListImage image={img} alt={img.alt || product.title} maxSize={500} />
					: <NoImage ratio={productImgRatio || TThumbRatio['1-1']} />
			}
			<ProductLabels labels={product.labels!}
					className={'product__labels_small product__labels_column'}
			/>
		</Link>
	);
}