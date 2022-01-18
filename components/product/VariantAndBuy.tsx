import {IProductItem} from 'boundless-api-client';
import ProductVariantPicker from './VariantPicker';
import ProductPriceAndBuy from './PriceAndBuy';


export default function ProductVariantAndBuy({product}: {product: IProductItem}) {
	const onCaseChange = () => {};

	return (
		<>
			{product.has_variants && <ProductVariantPicker extendedVariants={product.extendedVariants!}
																										 onChange={onCaseChange}
			/>}
			<ProductPriceAndBuy product={product} />
		</>
	);
}