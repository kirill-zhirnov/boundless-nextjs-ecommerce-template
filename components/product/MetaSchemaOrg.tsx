import {ICategoryFlatItem, IProductItem} from 'boundless-api-client';
import {getProductItemUrl} from '../../lib/urls';

export default function MetaSchemaOrg({product, parents}: IProductMetaProps) {
	return (
		<>
			<meta itemProp='productID' content={String(product?.product_id)} />
			{product?.sku && <meta itemProp='sku' content={product.sku} />}
			{parents && <meta itemProp='category' content={[...parents].reverse().map(parent => parent.title).join('/')} />}

			{product.has_variants
				? product.extendedVariants?.list.map(variant => (
					<div itemProp='offers' itemScope itemType='http://schema.org/Offer' key={variant.variant_id}>
						{variant.price && <meta itemProp='price' content={String(variant.price)} />}
						<meta itemProp='priceCurrency' content='USD' />
						{variant.sku && <meta itemProp='sku' content={variant.sku} />}
						{variant.title && <meta itemProp='name' content={variant.title} />}
						<link itemProp='availability' href={variant.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock'} />
						<link itemProp='url' href={getProductItemUrl(product)} />
					</div>
				))
				: <div itemProp='offers' itemScope itemType='http://schema.org/Offer'>
					<meta itemProp='price' content={String(product.price)} />
					<meta itemProp='priceCurrency' content='USD' />
					<link itemProp='availability' href={product.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock'} />
					<link itemProp='url' href={getProductItemUrl(product)} />
				</div>}
		</>
	);
}

interface IProductMetaProps {
	product: IProductItem;
	parents: ICategoryFlatItem[]|null;
}