import {IProduct} from 'boundless-api-client/types/catalog/product';
import ProductItem from './ProductsList/ProductItem';

export default function ProductsList({products}: {products: IProduct[]}) {
	return (
		<>
			<div className='product-list row'>
				{products && products.map(product => (
					<ProductItem product={product} key={product.product_id} />
				))}
			</div>
		</>
	);
}