import {useEffect, useMemo, useState} from 'react';
import {ICategoryFlatItem, IGetProductsParams, IProductItem} from 'boundless-api-client';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/api';
import {useRouter} from 'next/router';
import BreadCrumbs from '../../components/BreadCrumbs';
import ProductImages from '../../components/product/Images';
import qs, {ParsedQs} from 'qs';
import MetaSchemaOrg from '../../components/product/MetaSchemaOrg';
import {getProductMetaData} from '../../lib/meta';
import ProductLabels from '../../components/product/Labels';
import ProductVariantAndBuy from '../../components/product/VariantAndBuy';
import ProductCharacteristics from '../../components/product/Characteristics';
import {makeAllMenus} from '../../lib/menu';
import {makeBreadCrumbsFromCats} from '../../lib/breadcrumbs';
import ProductShipping from '../../components/product/Shipping';
import {IMenuItem} from '../../@types/components';
import ProductsSliderByQuery from '../../components/ProductsSliderByQuery';
import {IBasicSettings} from '../../@types/settings';

export default function ProductPage({data: {product, categoryParents, mainMenu, footerMenu, basicSettings}}: InferGetStaticPropsType<typeof getStaticProps>) {
	const [resolvedParents, setResolvedParents] = useState(categoryParents);
	const router = useRouter();
	const query = useMemo<ParsedQs>(() => qs.parse(router.asPath.split('?')[1] || ''), [router.asPath]);
	const {category, ...restQuery} = query;
	const similarQuery = useMemo(() => ({cross_sell_category: 'similar', cross_sell_product: product.product_id}), [product]);
	const relatedQuery = useMemo(() => ({cross_sell_category: 'related', cross_sell_product: product.product_id}), [product]);

	const fetchParents = async (categoryId: number) =>
		setResolvedParents(await apiClient.catalog.getCategoryParents(categoryId));

	useEffect(() => {
		const categoryId = category ? parseInt(category as string) : null;
		if (!categoryId) return;

		const notDefaultCat = product.categoryRels.some(cat => (cat.is_default !== true && cat.category.category_id === categoryId));

		if (notDefaultCat) {
			fetchParents(categoryId);
		}
	}, [category, product]);

	const breadcrumbItems = useMemo(() => {
		return makeBreadCrumbsFromCats(resolvedParents || [], ({category_id}) => {
			if (resolvedParents?.length && category_id === resolvedParents[0].category_id) {
				return {
					queryParams: restQuery
				};
			}

			return {};
		});
	}, [resolvedParents, query]); //eslint-disable-line

	return (
		<MainLayout
			footerMenu={footerMenu}
			mainMenu={mainMenu}
			metaData={getProductMetaData(product)}
			title={product.seo.title}
			basicSettings={basicSettings}
		>
			<div className={'container'}>
				<BreadCrumbs items={breadcrumbItems} />
				<div className='product-page' itemScope itemType='//schema.org/Product'>
					<div className='row'>
						<div className='col-md-7'>
							<h1 className='product-page__header mb-4' itemProp='name'>
								{product.title}
							</h1>
							<ProductLabels labels={product.labels} className={'mb-3'} />
							<ProductImages product={product} />
						</div>
						<div className='col-md-5'>
							<ProductVariantAndBuy product={product} />
							<hr className='product-page__hr' />
							<ProductCharacteristics
								characteristics={product.attributes!}
								manufacturer={product.manufacturer}
								size={product.props.size}
							/>
							<hr className='product-page__hr' />
							<ProductShipping />
						</div>
					</div>
					{product.text.description && <article itemProp='description'
						className={'product-page__description'}
						dangerouslySetInnerHTML={{__html: product?.text.description}} />}
					<MetaSchemaOrg product={product} parents={resolvedParents} />
				</div>
				<ProductsSliderByQuery
					query={similarQuery as IGetProductsParams}
					title='Similar products'
					wrapperClassName='page-block'
				/>
				<ProductsSliderByQuery
					query={relatedQuery as IGetProductsParams}
					title='Frequently Bought Together'
					wrapperClassName='page-block'
				/>
			</div>
		</MainLayout>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const {pagination, products} = await apiClient.catalog.getProducts({'per-page': 100});
	if (pagination.pageCount > 1) {
		for (let page = 2; page <= pagination.pageCount; page++) {
			const {products: newProducts} = await apiClient.catalog.getProducts({'per-page': 100, page});
			products.push(...newProducts);
		}
	}
	const paths = products.map(product => ({
		params: {
			slug: product.url_key || String(product.product_id)
		}
	}));

	return {
		paths,
		fallback: 'blocking'
	};
};

export const getStaticProps: GetStaticProps<IProductPageProps> = async ({params}) => {
	const {slug} = params || {};

	let data = null;
	try {
		data = await fetchData(slug as string);
	} catch (error: any) {
		if (error.response?.status === 404) {
			return {
				notFound: true
			};
		} else {
			throw error;
		}
	}

	if (data?.product?.url_key && data?.product?.url_key !== slug) {
		return {
			redirect: {
				destination: `/product/${data?.product?.url_key}`,
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

const fetchData = async (slug: string) => {
	const product = await apiClient.catalog.getProduct(slug as string);

	const categoryId = product.categoryRels.find(cat => cat.is_default === true)?.category.category_id;
	let categoryParents = null;
	if (categoryId) {
		categoryParents = await apiClient.catalog.getCategoryParents(categoryId);
	}

	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const basicSettings = await apiClient.system.fetchSettings(['system.locale', 'system.currency']) as IBasicSettings;
	const menus = makeAllMenus({categoryTree});

	return {
		product,
		categoryParents,
		basicSettings,
		...menus
	};
};


interface IProductPageProps {
	data: IProductPageData;
}

interface IProductPageData {
	product: IProductItem;
	categoryParents: ICategoryFlatItem[] | null;
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
	basicSettings: IBasicSettings;
}
