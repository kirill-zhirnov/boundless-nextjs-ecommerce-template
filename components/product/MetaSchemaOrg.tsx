import {ICategoryFlatItem, IProductItem} from 'boundless-api-client';
import {getProductItemUrl} from '../../lib/urls';
import {findSellingPrice} from '../../lib/product';

export default function MetaSchemaOrg({product, parents}: IProductMetaProps) {
	const productSellingPrice = findSellingPrice(product.prices);

	return (
		<>
			<meta itemProp='productID' content={String(product?.product_id)} />
			{product?.sku && <meta itemProp='sku' content={product.sku} />}
			{parents && <meta itemProp='category' content={[...parents].reverse().map(parent => parent.title).join('/')} />}

			{product.has_variants
				? product.extendedVariants?.list.map(variant => {
					const sellingPrice = findSellingPrice(variant.prices);

					return (
						<div itemProp='offers' itemScope itemType='//schema.org/Offer' key={variant.variant_id}>
							{sellingPrice?.value && <meta itemProp='price' content={String(sellingPrice.value)} />}
							{sellingPrice?.value && <meta itemProp='priceCurrency' content={sellingPrice.currency_alias} />}
							{variant.sku && <meta itemProp='sku' content={variant.sku} />}
							{variant.title && <meta itemProp='name' content={variant.title} />}
							<link itemProp='availability' href={variant.in_stock ? '//schema.org/InStock' : '//schema.org/OutOfStock'} />
							<link itemProp='url' href={getProductItemUrl(product)} />
						</div>
					);
				})
				: <div itemProp='offers' itemScope itemType='//schema.org/Offer'>
					{productSellingPrice?.value && <meta itemProp='price' content={productSellingPrice.value} />}
					{productSellingPrice?.value && <meta itemProp='priceCurrency' content={productSellingPrice.currency_alias} />}
					<link itemProp='availability' href={product.in_stock ? '//schema.org/InStock' : '//schema.org/OutOfStock'} />
					<link itemProp='url' href={getProductItemUrl(product)} />
				</div>}
		</>
	);
}

interface IProductMetaProps {
	product: IProductItem;
	parents: ICategoryFlatItem[]|null;
}