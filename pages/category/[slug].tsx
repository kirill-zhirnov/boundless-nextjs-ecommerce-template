import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/services/api';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {ICategoryItem} from 'boundless-api-client/types/catalog/category';
import ErrorComponent from 'next/error';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import ProductsList from '../../components/blocks/ProductsList';
import {IPagination} from 'boundless-api-client/types/common';
import Pagination from '../../components/Pagination';
import {useRouter} from 'next/router';
import CategoryBreadCrumbs from '../../components/BreadCrumbs/CategoryBreadCrumbs';
import CategoryMenu from '../../components/blocks/CategoryMenu/CategoryMenu';
import {useEffect, useRef, useState} from 'react';
import {getMenu4Category, getProductsQuery4Category} from '../../lib/services/category';
import {IFilter} from 'boundless-api-client/types/catalog/filter';
import FilterFields from '../../components/blocks/FilterFields';

export default function CategoryPage({errorCode, data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const isRerender = useRef(false);
	const {slug, ...params} = router.query;

	const [categoryData, setCategoryData] = useState({
		category: data?.category || null,
		products: data?.products || [],
		pagination: data?.pagination || null,
		menu: data?.category ? getMenu4Category(data?.category) : [],
		filter: data?.filter || null
	});

	console.log('Filter:', data?.filter);
	const getData = async (params: {[key: string]: any}) => {
		const _data = await fetchData(slug as string, params);
		setCategoryData({
			..._data,
			menu: getMenu4Category(_data.category)
		});
	};

	const changeFilters = (newParams: {[key: string]: any}) => {
		const {'per-page': perPage} = params;
		router.push({
			pathname: router.pathname,
			query: Object.assign(newParams, {slug, 'per-page': perPage})
		}, undefined, {shallow: true}); //shallow to skip SSR of the page
	};

	useEffect(() => {
		if (isRerender.current) getData(router.query);

		isRerender.current = true;
	}, [router.query]); //eslint-disable-line

	const navUrl = {
		baseUrl: router.asPath.split('?')[0],
		params
	};

	if (errorCode) return <ErrorComponent statusCode={errorCode} />;

	const {category, products, pagination, menu, filter} = categoryData;

	const title = category?.text?.custom_header || category?.text?.title;

	return (
		<>
			<MainLayout title={title}>
				<div className='container'>
					<div className='row'>
						<div className='col-md-3 col-sm-4'>
							{category && menu && <CategoryMenu categoryTree={menu} active_id={category?.category_id} />}
							{filter?.fields && <FilterFields fields={filter.fields} changeFilters={changeFilters} />}
						</div>
						<main className='col-md-9 col-sm-8 content-box'>
							{title && <h2 className='text-center mb-3'>{title}</h2>}
							{category?.parents && <CategoryBreadCrumbs parents={category?.parents} />}
							{category?.text?.description_top && <div dangerouslySetInnerHTML={{__html: category?.text?.description_top}} />}
							{products && <ProductsList products={products} />}
							{category?.text?.description_bottom && <div dangerouslySetInnerHTML={{__html: category?.text?.description_bottom}} />}
							{pagination && <Pagination pagination={pagination} navUrl={navUrl} />}
						</main>
					</div>
				</div>
			</MainLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<ICategoryPageProps> = async ({params, query}) => {
	const {slug} = params || {};

	const data = await fetchData(slug as string, query);

	return {
		props: {
			data
		}
	};
};

const fetchData = async (slug: string, params: {[key: string]: any}) => {
	const category = await apiClient.catalog.getCategoryItem(slug as string, {with_children: 1, with_parents: 1, with_siblings: 1});

	const {products, pagination} = await apiClient.catalog.getProducts(getProductsQuery4Category(category.category_id, params));
	const out = {
		category,
		products,
		pagination,
		filter: null as IFilter | null
	};

	if (category.props && category.props.use_filter) {
		const filters = await apiClient.catalog.getFilters();
		const filter = category.props.filter_id
			? filters.find(filter => filter.filter_id === category.props!.filter_id)
			: filters.find(filter => filter.is_default === true);

		if (filter) {
			out.filter = filter;
		}
	}

	return out;
};

interface ICategoryPageProps {
	data: ICategoryPageData | null;
	errorCode?: number;
}

interface ICategoryPageData {
	category: ICategoryItem | null;
	products?: IProduct[];
	pagination?: IPagination;
	filter?: IFilter | null;
}