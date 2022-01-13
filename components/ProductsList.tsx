import {IProduct} from 'boundless-api-client/types/catalog/product';
import {TQuery} from '../@types/common';
import ProductItem from './productsList/ProductItem';

export default function ProductsList({products, query, categoryId}: IProductListProps) {
	return (
		<>
			<div className='product-list row'>
				{products && products.map(product => (
					<ProductItem product={product} key={product.product_id} query={query} categoryId={categoryId} />
				))}
			</div>
		</>
	);
}

interface IProductListProps {
	products: IProduct[];
	query: TQuery;
	categoryId?: number;
}