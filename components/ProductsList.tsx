import {IProduct} from 'boundless-api-client';
import {TQuery} from '../@types/common';
import ProductItem from './productsList/ProductItem';

export default function ProductsList({products, query, categoryId}: IProductListProps) {
	return (
		<ul className='products list-unstyled'>
			{products.map(product => (
				<ProductItem product={product} key={product.product_id} query={query} categoryId={categoryId} />
			))}
		</ul>
	);
}

interface IProductListProps {
	products: IProduct[];
	query: TQuery;
	categoryId?: number;
}