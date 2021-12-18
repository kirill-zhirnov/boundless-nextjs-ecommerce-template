import {IProduct} from 'boundless-api-client/types/catalog/product';
import {getProductsListImg} from "../../../lib/services/imgs";
import {formatMoney} from "../../../lib/formatter";

export default function ProductItem({product}: {product: IProduct}) {
	const schemaAvailability = product.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock';
	const url = `/products/${String(product.url_key || '')}`;

	return (
		<div
			className='product-item col-6 col-md-4 col-lg-3'
			data-id={product.product_id}
			itemScope
			itemType='http://schema.org/Product'
		>
			<div className='product-item__wrapper'>
				<div className={'product-item__image'}>
					<a href={url} >
						{product.images && product.images.length > 0 ?
							<div className={'img'}>
								<img src={getProductsListImg(product.images[0].path, 200)}
										 alt={product.images[0].alt || product.title}
								/>
							</div>
							: <div className='no-image' />}
					</a>
				</div>
				<div className='product-item__basket-btn'>

				</div>
				<h4 className='product-item__title'>
					<a href={`/products/${product.url_key || product.product_id}`} itemProp='url'>
						<span itemProp='name'>{product.title}</span>
					</a>
				</h4>

				<div className='product-item__offer'>
					{product.price?.value && <div className='product-item__price'>
						{formatMoney(product.price.value)}
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