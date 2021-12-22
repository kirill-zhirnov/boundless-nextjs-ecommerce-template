import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/services/api';
import {GetServerSideProps, GetStaticProps, InferGetServerSidePropsType} from 'next';
import {ICategoryFlatItem, ICategoryItem} from 'boundless-api-client/types/catalog/category';
import ErrorComponent from 'next/error';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import ProductsList from '../../components/blocks/ProductsList';
import {IPagination} from 'boundless-api-client/types/common';
import Pagination from '../../components/Pagination';
import {useRouter} from 'next/router';
import CategoryBreadCrumbs from '../../components/breadcrumbs/CategoryBreadCrumbs';
import CategoryMenu from '../../components/blocks/CategoryMenu/CategoryMenu';
import {useEffect, useState} from 'react';
import {IGetProductsParams} from 'boundless-api-client/endpoints/catalog';

export default function CategoryPage({errorCode, data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const [category, setCategory] = useState<ICategoryItem | null>(null);
	const [products, setProducts] = useState<IProduct[]>([]);
	const [pagination, setPagination] = useState<IPagination | null>(null);
	const [categoryMenu, setCategoryMenu] = useState<ICategoryFlatItem[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchData = async () => {
		const {slug, page, perPage, price_min, price_max} = router.query;
		const _category = await apiClient.catalog.getCategoryItem(
			slug as string,
			{with_children: 1, with_parents: 1, with_siblings: 1}
		);
		if (!_category) return;
		setCategory(_category);
		setCategoryMenu(getCategoryMenu(_category));

		const params: IGetProductsParams = {
			category: [_category.category_id],
			page: Number(page) || 1,
			'per-page': Number(perPage) || 10
		};
		if (price_max) params.price_max = Number(price_max);
		if (price_min) params.price_min = Number(price_min);

		const {products: _products, pagination: _pagination} = await apiClient.catalog.getProducts(params);
		console.log(_pagination);

		setPagination(_pagination);
		setProducts(_products);
	};

	useEffect(() => {
		if (!data) fetchData();
	}, []); //eslint-disable-line

	useEffect(() => {
		if (data && data.category) {
			setCategory(data.category);
			setCategoryMenu(getCategoryMenu(data.category));
			if (data.pagination) setPagination(data.pagination);
			if (data.products) setProducts(data.products);
		}
	}, [data]);

	const getCategoryMenu = (category: ICategoryItem): ICategoryFlatItem[] => {
		const categoryMenu: ICategoryFlatItem[] = [];
		const {parent_id, siblings, children} = category;
		if (children && children.length > 0) {
			categoryMenu.push(...children);
		} else if (siblings && siblings.length > 0) {
			const filteredSiblings = siblings.filter(elem => elem.parent_id === parent_id);
			categoryMenu.push(...filteredSiblings);
		}

		return categoryMenu;
	};


	if (errorCode) return <ErrorComponent statusCode={errorCode} />;

	const title = category?.text?.custom_header || category?.text?.title;

	const setPage = (page: number) => {
		router.push({
			pathname: router.pathname,
			query: Object.assign(router.query, {page})
		});
	};

	return (
		<>
			<MainLayout title={title}>
				<div className='container'>
					<div className='row'>
						<div className='col-md-3 col-sm-4'>
							{category && categoryMenu && <CategoryMenu categoryTree={categoryMenu} active_id={category?.category_id} />}
						</div>
						<main className='col-md-9 col-sm-8 content-box'>
							{title && <h2 className='text-center mb-3'>{title}</h2>}
							{category?.parents && <CategoryBreadCrumbs parents={category?.parents} />}
							{category?.text?.description_top && <div dangerouslySetInnerHTML={{__html: category?.text?.description_top}} />}
							{products && <ProductsList products={products} />}
							{category?.text?.description_bottom && <div dangerouslySetInnerHTML={{__html: category?.text?.description_bottom}} />}
							{pagination && <Pagination pagination={pagination} setPage={setPage} />}
						</main>
					</div>
				</div>
			</MainLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps = async (context) => {
	const {query} = context;

	console.log(query);
	return {
		props: {
			data: null
		}
	};
};

export const getStaticPaths = async (context) => {
  return {
    paths: [
      { params: { slug: 'chekhly-na-iphone' } } // See the "paths" section below
    ],
    fallback: true
  };

};

// export const getServerSideProps: GetServerSideProps<ICategoryPageProps> = async ({params, query, res}) => {
// 	const {slug} = params || {};
// 	const {page, perPage, price_min, price_max} = query || {};

// 	if (price_min || price_max) {
// 		return {
// 			props: {
// 				data: null
// 			}
// 		};
// 	}

// 	const category = await apiClient.catalog.getCategoryItem(
// 		slug as string,
// 		{with_children: 1, with_parents: 1, with_siblings: 1}
// 	);

// 	if (!category) {
// 		const errorCode = 404;
// 		res.statusCode = errorCode;

// 		return {
// 			props: {
// 				errorCode,
// 				data: null
// 			}
// 		};
// 	}

// 	const {products, pagination} = await apiClient.catalog.getProducts({
// 		category: [category.category_id],
// 		page: Number(page) || 1,
// 		'per-page': Number(perPage) || 10
// 	});

// 	return {
// 		props: {
// 			data: {
// 				category,
// 				products,
// 				pagination
// 			}
// 		}
// 	};
// };

interface ICategoryPageProps {
	data: ICategoryPageData | null;
	errorCode?: number;
}

interface ICategoryPageData {
	category: ICategoryItem | null;
	products?: IProduct[];
	categoryMenu?: ICategoryFlatItem[];
	pagination?: IPagination;
}