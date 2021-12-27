import {useMemo, useState} from 'react';
import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/services/api';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {ICategoryItem} from 'boundless-api-client/types/catalog/category';
import ErrorComponent from 'next/error';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import ProductsList from '../../components/blocks/ProductsList';
import {IPagination} from 'boundless-api-client/types/common';
import Pagination from '../../components/Pagination';
import {NextRouter, useRouter} from 'next/router';
import CategoryBreadCrumbs from '../../components/BreadCrumbs/CategoryBreadCrumbs';
import CategoryMenu from '../../components/blocks/CategoryMenu/CategoryMenu';
import {getMenu4Category, filterProductsQuery} from '../../lib/services/category';
// import CategoryFilters from '../../components/blocks/CategoryFilters';
import {TQuery} from '../../@types/common';
import FilterForm from "../../components/FilterForm";

export default function CategoryPage({errorCode, data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const [productsQuery, setProductsQuery] = useState(data.productsQuery);
	const [collection, setCollection] = useState(data.collection);
	const {category} = data;
	const menu = useMemo(() => category ? getMenu4Category(category) : [], [category]);

	const onCollectionChange = async (newParams: TQuery) => {
		const {collection, filteredQuery} = await fetchCollection(category.category_id, newParams);
		setCollection(collection);
		setProductsQuery(filteredQuery);

		changeUrl(router, filteredQuery);
	};

	if (errorCode) return <ErrorComponent statusCode={errorCode} />; //FIXME currently errorCode is not provided

	const title = category?.text?.custom_header || category?.text?.title;
	console.log(category);
	return (
		<>
			<MainLayout title={title}>
				<div className='container'>
					<div className='row'>
						<div className='col-md-3 col-sm-4'>
							{category && menu && <CategoryMenu categoryTree={menu} active_id={category?.category_id} />}
							{category.filter && <FilterForm filterFields={category.filter.fields}
																							queryParams={productsQuery}
																							onSearch={(values) => console.log('onSubmit', values)} />}
							{/*{category && <CategoryFilters*/}
							{/*	category={category}*/}
							{/*	productsQuery={productsQuery}*/}
							{/*	onCollectionChange={onCollectionChange}*/}
							{/*/>}*/}
						</div>
						<main className='col-md-9 col-sm-8 content-box'>
							{title && <h2 className='text-center mb-3'>{title}</h2>}
							{category?.parents && <CategoryBreadCrumbs parents={category?.parents} />}
							{category?.text?.description_top && <div dangerouslySetInnerHTML={{__html: category?.text?.description_top}} />}
							{collection.products && <ProductsList products={collection.products} />}
							{category?.text?.description_bottom && <div dangerouslySetInnerHTML={{__html: category?.text?.description_bottom}} />}
							{collection.pagination && <Pagination pagination={collection.pagination} params={productsQuery} onChange={onCollectionChange} />}
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

const fetchData = async (slug: string, params: TQuery) => {
	const category = await apiClient.catalog.getCategoryItem(slug, {
		with_children: 1,
		with_parents: 1,
		with_siblings: 1,
		with_filter: 1
	});

	params['per-page'] = 1; // FIXME just for test

	const {collection, filteredQuery: productsQuery} = await fetchCollection(category.category_id, params);

	const out = {
		category,
		collection,
		productsQuery,
	};

	return out;
};

const fetchCollection = async (categoryId: number, params: TQuery) => {
	const filteredQuery = filterProductsQuery(params);
	const collection = await apiClient.catalog.getProducts({category: [categoryId], ...filteredQuery});

	return {
		filteredQuery,
		collection
	};
};

const changeUrl = (router: NextRouter, query: TQuery) => {
	router.push({
		pathname: router.pathname,
		query: Object.assign({...query}, {slug: router.query.slug})
	}, undefined, {shallow: true}); //shallow to skip SSR of the page
};

interface ICategoryPageProps {
	data: ICategoryPageData;
	errorCode?: number;
}

interface ICategoryPageData {
	category: ICategoryItem;
	collection: {
		products: IProduct[];
		pagination: IPagination;
	},
	productsQuery: {[key: string]: any}
}