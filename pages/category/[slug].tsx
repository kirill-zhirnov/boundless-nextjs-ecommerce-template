import {useEffect, useMemo, useState} from 'react';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {NextRouter, useRouter} from 'next/router';
import {useAppSelector} from '../../hooks/redux';
import dynamic from 'next/dynamic';
import qs from 'qs';
import {apiClient} from '../../lib/api';
import {getCategoryItemUrl} from '../../lib/urls';
import {filterProductsQuery} from '../../lib/category';
import {createGetStr} from 'boundless-api-client/utils';
import {getCategoryMetaData} from '../../lib/meta';
import {makeAllMenus} from '../../lib/menu';
import {IMenuItem} from '../../@types/components';
import {makeBreadCrumbsFromCats} from '../../lib/breadcrumbs';
import {IProduct, ICategoryItem} from 'boundless-api-client';
import {IPagination} from 'boundless-api-client/types/common';
import {TQuery} from '../../@types/common';

import MainLayout from '../../layouts/Main';
import ProductsList from '../../components/ProductsList';
import Pagination from '../../components/Pagination';
import BreadCrumbs from '../../components/BreadCrumbs';
import CategorySidebar from '../../components/category/Sidebar';
import FiltersModal from '../../components/category/FiltersModal';
import CategoryControls from '../../components/category/Controls';
import {RootState} from '../../redux/store';
import ProductsSliderByQuery from '../../components/ProductsSliderByQuery';
const FilterForm = dynamic(() => import('../../components/FilterForm'), {ssr: false});

export default function CategoryPage({data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const {category, mainMenu, footerMenu} = data;
	const router = useRouter();
	const [productsQuery, setProductsQuery] = useState(data.productsQuery);
	const [collection, setCollection] = useState(data.collection);
	const [showModal, setShowModal] = useState(false);
	const isRouteChanging = useAppSelector((state: RootState) => state.app.isRouteChanging);

	const onCollectionChange = async (newParams: TQuery) => {
		const {collection, filteredQuery} = await fetchCollection(category.category_id, newParams);
		setShowModal(false);
		setCollection(collection);
		setProductsQuery(filteredQuery);

		changeUrl(router, filteredQuery);
	};

	useEffect(() => {
		if (isRouteChanging) setShowModal(false);
	}, [isRouteChanging]);

	useEffect(() => {
		setCollection(data.collection);
		setProductsQuery(data.productsQuery);
	}, [data]);

	const breadcrumbItems = useMemo(() =>
		makeBreadCrumbsFromCats(category.parents!, ({category_id}) => ({isActive: category_id === category.category_id}))
		, [category.parents, category.category_id]);

	return (
		<MainLayout
			footerMenu={footerMenu}
			mainMenu={mainMenu}
			metaData={getCategoryMetaData(category)}
			title={category.seo.title}
		>
			<div className='container'>
				<div className='row'>
					<div className='category-sidebar__wrapper col-md-4 col-lg-3'>
						<CategorySidebar category={category} />
						<FilterForm filterFields={category.filter!.fields}
							queryParams={productsQuery}
							categoryId={category.category_id}
							onSearch={onCollectionChange}
							idsPrefix='desk_'
						/>
					</div>
					<div className='col-md-8 col-lg-9'>
						<BreadCrumbs items={breadcrumbItems} />
						<h1 className='page-heading page-heading_h1  page-heading_m-h1'>{category.text?.title}</h1>
						{category.text?.description_top &&
							<div className={'mb-3'} dangerouslySetInnerHTML={{__html: category.text.description_top}} />
						}

						{collection && <>
							<CategoryControls params={productsQuery} onSort={onCollectionChange} onMobileShow={() => setShowModal(true)}/>
							<ProductsList products={collection.products} query={productsQuery} categoryId={category.category_id} />
							<Pagination pagination={collection.pagination} params={productsQuery} onChange={onCollectionChange} />
						</>}
						{category.text?.description_bottom && <div dangerouslySetInnerHTML={{__html: category.text.description_bottom}} />}
					</div>
				</div>
				<ProductsSliderByQuery query={productsQuery} title='Great products'/>
			</div>
			<FiltersModal
				show={showModal}
				setShow={setShowModal}
			>
				<CategorySidebar category={category} />
				<FilterForm filterFields={category.filter!.fields}
					queryParams={productsQuery}
					categoryId={category.category_id}
					onSearch={onCollectionChange}
					idsPrefix='mobile_'
				/>
			</FiltersModal>
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