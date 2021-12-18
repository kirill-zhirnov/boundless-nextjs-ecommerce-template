import {IProduct} from 'boundless-api-client/types/catalog/product';
import {TThumbRatio} from '../../@types/image';
import ProductCard from './ProductCard';

export default function ProductsList({products}: {products: IProduct[]}) {
	return (
		<>
			<div className='product-list row'>
				{products && products.map(product => (
					<ProductCard product={product} imgRatio={TThumbRatio['2-3']} key={product.product_id} />
				))}
			</div>
		</>
	);
}