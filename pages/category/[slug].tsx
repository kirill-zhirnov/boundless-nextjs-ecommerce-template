import {useEffect, useMemo, useState} from 'react';
import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/api';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {ICategoryItem} from 'boundless-api-client/types/catalog/category';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import ProductsList from '../../components/ProductsList';
import {IPagination} from 'boundless-api-client/types/common';
import Pagination from '../../components/Pagination';
import {NextRouter, useRouter} from 'next/router';
import BreadCrumbs from '../../components/BreadCrumbs';
import CategorySidebar from '../../components/category/Sidebar';
import {filterProductsQuery} from '../../lib/category';
import {TQuery} from '../../@types/common';
import FilterForm from '../../components/FilterForm';
import {createGetStr} from 'boundless-api-client/utils';
import qs from 'qs';
import {getCategoryItemUrl} from '../../lib/urls';
import SortButtons from '../../components/SortButtons';
import {getCategoryMetaData} from '../../lib/meta';
import {makeAllMenus} from '../../lib/menu';
import {IMenuItem, setFooterMenu, setMainMenu} from '../../redux/reducers/menus';
import {useAppDispatch} from '../../hooks/redux';
import {makeBreadCrumbsFromCats} from '../../lib/breadcrumbs';

export default function CategoryPage({data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const {category, mainMenu, footerMenu} = data;
	const router = useRouter();
	const [productsQuery, setProductsQuery] = useState(data.productsQuery);
	const [collection, setCollection] = useState(data.collection);

	const dispatch = useAppDispatch();
	dispatch(setMainMenu(mainMenu));
	dispatch(setFooterMenu(footerMenu));

	const onCollectionChange = async (newParams: TQuery) => {
		const {collection, filteredQuery} = await fetchCollection(category.category_id, newParams);
		setCollection(collection);
		setProductsQuery(filteredQuery);

		changeUrl(router, filteredQuery);
	};

	useEffect(() => {
		setCollection(data.collection);
		setProductsQuery(data.productsQuery);
	}, [data]);

	const breadcrumbItems = useMemo(() => makeBreadCrumbsFromCats(category.parents!), [category.parents]);

	const title = category.text?.custom_header || category.text?.title;

	return (
		<MainLayout title={title} metaData={getCategoryMetaData(category)}>
			<div className='container'>
				<div className='row'>
					<div className='col-md-3 col-sm-4'>
						<CategorySidebar category={category} />
						<FilterForm filterFields={category.filter!.fields}
							queryParams={productsQuery}
							categoryId={category.category_id}
							onSearch={onCollectionChange} />
					</div>
					<main className='col-md-9 col-sm-8 content-box'>
						<BreadCrumbs items={breadcrumbItems} />
						<h1 className='page-header page-header_h1  page-header_m-h1'>{title}</h1>
						{category.text?.description_top &&
							<div className={'mb-3'} dangerouslySetInnerHTML={{__html: category.text.description_top}} />
						}

						{collection && <>
							<SortButtons params={productsQuery} onSort={onCollectionChange} />
							<ProductsList products={collection.products} query={productsQuery} categoryId={category.category_id} />
							<Pagination pagination={collection.pagination} params={productsQuery} onChange={onCollectionChange} />
						</>}
						{category.text?.description_bottom && <div dangerouslySetInnerHTML={{__html: category.text.description_bottom}} />}
					</main>
				</div>
			</div>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<ICategoryPageProps> = async ({req, params}) => {
	const url = new URL(`http://host${req.url!}`);
	const queryString = url.search.replace(/^\?/, '');
	const query = qs.parse(queryString);

	const {slug} = params || {};

	let data = null;
	try {
		data = await fetchData(slug as string, query);
	} catch (error: any) {
		if (error.response?.status === 404) {
			return {
				notFound: true
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

	const {collection, filteredQuery: productsQuery} = await fetchCollection(category.category_id, params);
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const menus = makeAllMenus({categoryTree, activeCategoryId: category.category_id});

	const out = {
		category,
		collection,
		productsQuery,
		...menus
	};

	return out;
};

const fetchCollection = async (categoryId: number, params: TQuery) => {
	const filteredQuery = filterProductsQuery(params);
	const collection = await apiClient.catalog.getProducts({
		category: [categoryId],
		sort: 'in_category,-in_stock,price',
		...filteredQuery,
		...{'per-page': 12}
	});

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
	data: ICategoryPageData;
}

interface ICategoryPageData {
	category: ICategoryItem;
	collection: {
		products: IProduct[];
		pagination: IPagination;
	},
	productsQuery: {[key: string]: any},
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
}