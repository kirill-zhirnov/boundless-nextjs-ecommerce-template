import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/services/api';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {ICategoryFlatItem, ICategoryItem} from 'boundless-api-client/types/catalog/category';
import ErrorComponent from 'next/error';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import ProductsList from '../../components/blocks/ProductsList';
import CategoryMenu from '../../components/blocks/CategoryMenu';
import {IPagination} from 'boundless-api-client/types/common';
import Pagination from '../../components/Pagination';
import {useRouter} from 'next/router';
import Head from 'next/head';
import CategoryBreadCrumbs from '../../components/breadcrumbs/CategoryBreadCrumbs';

export default function CategoryPage({errorCode, category, products, categoryMenu, pagination}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	if (errorCode) return <ErrorComponent statusCode={errorCode} />;
	console.log(category);

	const title = category?.text?.custom_header || category?.text?.title || null;

	const setPage = (page: number) => {
		router.push({
			pathname: router.pathname,
			query: Object.assign(router.query, {page})
		});
	};

	return (
		<>
			<Head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<meta httpEquiv='X-UA-Compatible' content='ie=edge' />

				<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
				<link rel='manifest' href='/site.webmanifest' />
				<link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />

				<title>{title}</title>
			</Head>
			<MainLayout>
				<div className='container'>
					<div className='row'>
						<div className='col-md-3 col-sm-4'>
							{category && categoryMenu && <CategoryMenu categoryTree={categoryMenu} active_id={category?.category_id} flat />}
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

export const getServerSideProps: GetServerSideProps<ICategoryPageProps> = async ({params, query, res}) => {
	const {slug} = params || {};
	const {page, perPage} = query || {};
	const category = await apiClient.catalog.getCategoryItem(
		String(slug || ''),
		{with_children: 1, with_parents: 1, with_siblings: 1}
	);

	if (!category) {
		const errorCode = 404;
		res.statusCode = errorCode;

		return {
			props: {
				errorCode,
				category: null
			}
		};
	}
	const categoryMenu: ICategoryFlatItem[] = [];
	const {category_id, parent_id, siblings, children} = category;
	if (children && children.length > 0) {
		categoryMenu.push(...children);
	} else if (siblings && siblings.length > 0) {
		const filteredSiblings = siblings.filter(elem => elem.parent_id === parent_id);
		categoryMenu.push(...filteredSiblings);
	}

	const {products, pagination} = await apiClient.catalog.getProducts({
		category: [category_id],
		page: Number(page) || 1,
		'per-page': Number(perPage) || 10
	});

	return {
		props: {
			category,
			products,
			categoryMenu,
			pagination
		}
	};
};

interface ICategoryPageProps {
	errorCode?: number;
	category: ICategoryItem | null;
	products?: IProduct[];
	categoryMenu?: ICategoryFlatItem[];
	pagination?: IPagination;
}