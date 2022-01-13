import {IProduct} from 'boundless-api-client/types/catalog/product';
import clsx from 'clsx';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {addItem2Cart} from '../../redux/actions/cart';
import {RootState} from '../../redux/store';
import {getProductUrl} from '../../lib/services/urls';
import ProductListImage from './ProductImage';
import ProductPrice from './ProductPrice';
import {TQuery} from '../../@types/common';

export default function ProductItem({product, query, categoryId}: IProductItemProps) {
	const dispatch = useAppDispatch();
	const submitting = useAppSelector((state: RootState) => state.cart.submitting);
	const schemaAvailability = product.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock';

	const params = {...query};
	if (categoryId && categoryId !== product.default_category?.category_id) {
		Object.assign(params, {category: categoryId});
	}
	const productUrl = getProductUrl(product, params);

	const onAddToCart = (product: IProduct) => {
		if (!product.item_id) return;
		dispatch(addItem2Cart(product.item_id, 1));
	};

	return (
		<div
			className='product-item col-6 col-md-4 col-lg-3'
			data-id={product.product_id}
			itemScope
			itemType='http://schema.org/Product'
		>
			<div className='product-item__wrapper'>
				<div className={'product-item__image'}>
					<a href={productUrl} >
						{product.images && product.images.length > 0
							? <ProductListImage image={{path: product.images[0].path, width: 200, height: 200}} alt={product.images[0].alt || product.title} />
							: <div className='no-image'>
								<img src='/noImg.png' alt={product.title} />
								</div>}
					</a>
				</div>
				<div className={clsx('product-item__basket-btn', !product.in_stock && 'd-none')}>
					<button
						type='button'
						className='btn btn-outline-secondary btn-sm'
						disabled={submitting}
						onClick={() => onAddToCart(product)}
					>
						Add to basket
					</button>
				</div>
				<h4 className='product-item__title flex-grow-1'>
					<a href={productUrl} itemProp='url'>
						<span itemProp='name'>{product.title}</span>
					</a>
				</h4>

				<div className='product-item__offer'>
					{product.price && <>
						<ProductPrice price={product.price} />
						<div className={clsx('product-item__availability', product.in_stock && 'd-none')}>
							<b className={product.in_stock ? 'product-item__stock-in' : 'product-item__stock-out'}>
								{product.in_stock ? 'In stock' : 'Out of stock'}
							</b>
						</div>
						{product.price?.min
							?
							<div itemProp='offers' itemScope itemType='http://schema.org/AggregateOffer'>
								<meta itemProp='lowPrice' content={String(product.price.min)} />
								<meta itemProp='highPrice' content={String(product.price.max)} />
								<meta itemProp='priceCurrency' content={product.price.currency_alias?.toUpperCase()} />
								<link itemProp='availability' href={schemaAvailability} />
							</div>
							:
							<div itemProp='offers' itemScope itemType='http://schema.org/Offer'>
								<meta itemProp='price' content={String(product.price.value)} />
								<meta itemProp='priceCurrency' content={product.price.currency_alias?.toUpperCase()} />
								<link itemProp='availability' href={schemaAvailability} />
							</div>
						}
					</>}
				</div>
				<meta itemProp='productID' content={String(product.product_id)} />
				<meta itemProp='brand' content={product.manufacturer?.title || ''} />
				<meta itemProp='sku' content={product.sku || ''} />
			</div>
		</div>
	);
}

interface IProductItemProps {
	product: IProduct;
	query: TQuery;
	categoryId?: number;
}