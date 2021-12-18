import {IProduct} from 'boundless-api-client/types/catalog/product';
import {TThumbMode, TThumbRatio} from '../../@types/image';
import {getImageUrl} from '../../lib/services/media';

export default function ProductCard({product, imgRatio}: {product: IProduct, imgRatio: TThumbRatio}) {
	const schemaAvailability = product.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock';
	const url = `/products/${String(product.url_key || '')}`;

	const formatPrice = (price: string | number | null, old: string | number | null) => {
		return '1000 $';
	};

	return (
		<div
			className='product-item col-6 col-md-4 col-lg-3'
			data-id={product.product_id}
			itemScope
			itemType='http://schema.org/Product'
		>
			<div className='product-item__wrapper'>
				<div className={'product-item__image' + ` ratio-${imgRatio}`}>
					<a href={url} >
						{product.images && product.images.length > 0 ?
							<div className={'img'}>
								<img src={getImageUrl(product.images[0].path, {'max-size': 200, ratio: imgRatio})} alt={product.images[0].alt || ''} />
							</div>
							: <div className='no-image' />}
					</a>
				</div>
				<div className='product-item__basket-btn'>

				</div>
				<h4 className='product-item__title'>
					<a href={`/products/${String(product.url_key || '')}`} itemProp='url'>
						<span itemProp='name'>{product.title}</span>
					</a>
				</h4>

				<div className='product-item__offer'>
					{product.price && <div className='product-item__price'>
						{formatPrice(product.price.value, product.price.old)}
					</div>}
					<div className='product-item__availability'>
						<b className={product.in_stock ? 'product-item__stock-in' : 'product-item__stock-out'}>
							{product.in_stock ? 'In stock' : 'Out of stock'}
						</b>
					</div>

				</div>

				<meta itemProp='productID' content={String(product.product_id)} />
				<meta itemProp='brand' content={product.manufacturer?.title || ''} />
				<meta itemProp='sku' content={product.sku || ''} />
			</div>
		</div>
	);
}