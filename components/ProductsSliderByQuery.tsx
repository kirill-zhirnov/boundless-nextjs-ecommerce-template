import {IProduct} from 'boundless-api-client';
import {useEffect, useState} from 'react';
import {TQuery} from '../@types/common';
import {useAppDispatch} from '../hooks/redux';
import {apiClient} from '../lib/api';
import {addPromise} from '../redux/reducers/xhr';
import ProductsSlider from './ProductsSlider';

export default function ProductsSliderByQuery({query, slidesNum = 10}: {query: TQuery, slidesNum?: number}) {
	const dispatch = useAppDispatch();
	const [products, setProducts] = useState<IProduct[] | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);

		const promise = apiClient.catalog.getProducts({
			sort: '-in_stock,price',
			...query,
			'per-page': slidesNum,
		})
			.then(({products}) => setProducts(products))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));

		dispatch(addPromise(promise));

	}, [query]); //eslint-disable-line

	if (!products) return null;

	return <ProductsSlider products={products} query={query} loading={loading} />;
}