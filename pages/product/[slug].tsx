import {useEffect, useMemo, useState} from 'react';
import {ICategoryFlatItem, IProductItem, IProductVariant} from 'boundless-api-client';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/api';
import {useRouter} from 'next/router';
import BreadCrumbs from '../../components/BreadCrumbs';
import ProductImages from '../../components/product/Images';
import ProductVariantPicker from '../../components/product/VariantPicker';
import ProductPriceAndBuy from '../../components/product/PriceAndBuy';
import qs, {ParsedQs} from 'qs';
import ProductMeta from '../../components/product/ProductMeta';
import ProductCharacteristics from '../../components/product/ProductCharacteristics';
import {getProductMetaData} from '../../lib/services/meta';
import ProductLabels from '../../components/product/Labels';
import ProductVariantAndBuy from '../../components/product/VariantAndBuy';

export default function ProductPage({data}: InferGetStaticPropsType<typeof getStaticProps>) {
	const {product, categoryParents} = data;
	const [resolvedParents, setResolvedParents] = useState(categoryParents);
	const [selectedVariants, setSelectedVariants] = useState<IProductVariant[]>(product.extendedVariants?.list || []);
	const [error, setError] = useState(false);

	const router = useRouter();
	const query = useMemo<ParsedQs>(() => qs.parse(router.asPath.split('?')[1] || ''), [router.asPath]);
	const {category, ...restQuery} = query;

	const fetchParents = async (categoryId: number) =>
		setResolvedParents(await apiClient.catalog.getCategoryParents(categoryId));

	useEffect(() => {
		const categoryId = category ? parseInt(category as string) : null;
		if (!categoryId) return;

		const notDefaultCat = product.categoryRels.some(cat => (cat.is_default !== true && cat.category_id === categoryId));

		if (notDefaultCat) {
			fetchParents(categoryId);
		}
	}, [category, product]);

	return (
		<>
			<MainLayout title={product.text.custom_title || product.text.title} metaData={getProductMetaData(product!)}>
				<div className={'container'}>
					{resolvedParents && <BreadCrumbs parents={resolvedParents} activeParams={restQuery} />}
					<div className='product-page' itemScope itemType='http://schema.org/Product'>
						<div className='row'>
							<div className='col-md-7'>
								<h1 className='mb-4' itemProp='name'>{product.text.title}</h1>
								<ProductLabels labels={product.labels} className={'mb-3'}/>
								<ProductImages product={product} />
							</div>
							<div className='col-md-5'>
								<ProductVariantAndBuy product={product} />
								{/*<ProductPriceAndBuy product={product} selectedVariants={selectedVariants} setError={setError} />*/}
								{/*<ProductCharacteristics characteristics={product?.nonVariantCharacteristics!} />*/}
								{/*<h3>Shipping</h3>*/}
								{/*We ship ASAP!*/}
							</div>
						</div>
						{product.text.description && <article itemProp='description'
																									className={'product-description my-4'}
																									dangerouslySetInnerHTML={{__html: product?.text.description}} />}
						<ProductMeta product={product} parents={resolvedParents} />
					</div>
				</div>
			</MainLayout>
		</>
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

	if (data?.product?.text.url_key && data?.product?.text.url_key !== slug) {
		return {
			redirect: {
				destination: `/product/${data?.product?.text.url_key}`,
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

	const categoryId = product.categoryRels.find(cat => cat.is_default === true)?.category_id;
	let categoryParents = null;
	if (categoryId) {
		categoryParents = await apiClient.catalog.getCategoryParents(categoryId);
	}

	return {
		product,
		categoryParents
	};
};


interface IProductPageProps {
	data: IProductPageData;
}

interface IProductPageData {
	product: IProductItem;
	categoryParents: ICategoryFlatItem[] | null;
}
