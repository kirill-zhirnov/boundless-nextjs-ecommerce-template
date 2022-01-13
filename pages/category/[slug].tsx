import {useEffect, useMemo, useState} from 'react';
import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/services/api';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {ICategoryItem} from 'boundless-api-client/types/catalog/category';
import ErrorComponent from 'next/error';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import ProductsList from '../../components/ProductsList';
import {IPagination} from 'boundless-api-client/types/common';
import Pagination from '../../components/Pagination';
import {NextRouter, useRouter} from 'next/router';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import CategoryMenu from '../../components/categoryMenu/CategoryMenu';
import {getMenu4Category, filterProductsQuery} from '../../lib/services/category';
import {TQuery} from '../../@types/common';
import FilterForm from '../../components/FilterForm';
import {createGetStr} from 'boundless-api-client/utils';
import qs from 'qs';
import {getCategoryItemUrl} from '../../lib/services/urls';
import SortButtons from '../../components/SortButtons';
import {getCategoryMetaData} from '../../lib/services/meta';

export default function CategoryPage({errorCode, data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const [productsQuery, setProductsQuery] = useState(data?.productsQuery || {});
	const [collection, setCollection] = useState(data?.collection || null);
	const menu = useMemo(() => data?.category ? getMenu4Category(data?.category) : [], [data?.category]);

	const onCollectionChange = async (newParams: TQuery) => {
		const {collection, filteredQuery} = await fetchCollection(category!.category_id, newParams);
		setCollection(collection);
		setProductsQuery(filteredQuery);

		changeUrl(router, filteredQuery);
	};

	useEffect(() => {
		if (data) {
			setCollection(data.collection);
			setProductsQuery(data.productsQuery);
		}
	}, [data]);

	if (!data && errorCode) return <ErrorComponent statusCode={errorCode} />;

	const {category} = data!;
	const title = category?.text?.custom_header || category?.text?.title;

	return (
		<>
			<MainLayout title={title} metaData={getCategoryMetaData(category)}>
				<div className='container'>
					<div className='row'>
						<div className='col-md-3 col-sm-4'>
							<CategoryMenu categoryTree={menu} activeId={category.category_id} parents={category.parents!} />
							<FilterForm filterFields={category.filter!.fields}
								queryParams={productsQuery}
								categoryId={category.category_id}
								onSearch={onCollectionChange} />
						</div>
						<main className='col-md-9 col-sm-8 content-box'>
							<h2 className='text-center mb-3'>{title}</h2>
							<BreadCrumbs parents={category.parents!} />
							<SortButtons params={productsQuery} onSort={onCollectionChange} />
							{category.text?.description_top && <div dangerouslySetInnerHTML={{__html: category.text.description_top}} />}
							{collection && <ProductsList products={collection.products} query={productsQuery} categoryId={category.category_id} />}
							{category.text?.description_bottom && <div dangerouslySetInnerHTML={{__html: category.text.description_bottom}} />}
							{collection && <Pagination pagination={collection.pagination} params={productsQuery} onChange={onCollectionChange} />}
						</main>
					</div>
				</div>
			</MainLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<ICategoryPageProps> = async ({req, params, res}) => {
	const url = new URL(`http://host${req.url!}`);
	const queryString = url.search.replace(/^\?/, '');
	const query = qs.parse(queryString);

	const {slug} = params || {};

	let data = null;
	try {
		data = await fetchData(slug as string, query);
	} catch (error: any) {
		if (error.response?.status === 404) {
			res.statusCode = 404;
			return {
				props: {
					data,
					errorCode: 404
				}
			};
		} else {
			throw error;
		}
	}

	const redirectUrl = getCategoryItemUrl(data.category);

	if (redirectUrl !== `/category/${slug}`) {
		return {
			redirect: {
				destination: `${redirectUrl}?${queryString}`,
				permanent: true,
			}
		};
	}

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

	// params['per-page'] = 1; // FIXME just for test

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
	const collection = await apiClient.catalog.getProducts({category: [categoryId], sort: 'in_category,-in_stock,price', ...filteredQuery});

	return {
		filteredQuery,
		collection
	};
};

const changeUrl = (router: NextRouter, query: TQuery) => {
	const baseUrl = router.asPath.split('?')[0];
	router.push(`${baseUrl}?${createGetStr(query)}`, undefined, {shallow: true}); //shallow to skip SSR of the page
};

interface ICategoryPageProps {
	data: ICategoryPageData | null;
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