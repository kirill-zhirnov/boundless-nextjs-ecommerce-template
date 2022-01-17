import {ICategoryFlatItem, IProductItem} from 'boundless-api-client';
import {getProductItemUrl} from '../../lib/services/urls';

export default function ProductMeta({product, parents}: IProductMetaProps) {
	return (
		<>
			<meta itemProp='productID' content={String(product?.product_id)} />
			<meta itemProp='brand' content={product?.manufacturer?.text?.title || ''} />
			{product?.sku && <meta itemProp='sku' content={product.sku} />}
			{parents && <meta itemProp='category' content={[...parents].reverse().map(parent => parent.title).join('/')} />}

			{product.has_variants
				? product.extendedVariants?.list.map(variant => (
					<div itemProp='offers' itemScope itemType='http://schema.org/Offer' key={variant.variant_id}>
						<meta itemProp='price' content={variant.price} />
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
			{product.props.size?.weight && <div itemProp='weight' itemScope itemType='http://schema.org/QuantitativeValue'>
				<meta itemProp='value' content={String(product.props.size?.weight)} />
				<meta itemProp='unitText' content='kg.' />
			</div>}
			{product.props.size?.width && <div itemProp='width' itemScope itemType='http://schema.org/QuantitativeValue'>
				<meta itemProp='value' content={String(product.props.size?.width)} />
				<meta itemProp='unitText' content='cm.' />
			</div>}
			{product.props.size?.height && <div itemProp='height' itemScope itemType='http://schema.org/QuantitativeValue'>
				<meta itemProp='value' content={String(product.props.size?.height)} />
				<meta itemProp='unitText' content='cm.' />
			</div>}
			{!Array.isArray(product.props.size) && product.props.size?.length && <div itemProp='length' itemScope itemType='http://schema.org/QuantitativeValue'>
				<meta itemProp='value' content={String(product.props.size?.length)} />
				<meta itemProp='unitText' content='cm.' />
			</div>}
		</>
	);
}

interface IProductMetaProps {
	product: IProductItem;
	parents: ICategoryFlatItem[]|null;
}