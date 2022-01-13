import {useEffect, useState} from 'react';
import {ICategoryFlatItem, IProductItem, IProductVariant} from 'boundless-api-client';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/services/api';
import {useRouter} from 'next/router';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import ProductImages from '../../components/product/ProductImages';
import VariantPicker from '../../components/VariantPicker';
import PriceAndBuy from '../../components/product/PriceAndBuy';
import qs from 'qs';
import ProductMeta from '../../components/product/ProductMeta';
import ProductCharacteristics from '../../components/product/ProductCharacteristics';
import {getProductMetaData} from '../../lib/services/meta';

export default function ProductPage({data}: InferGetStaticPropsType<typeof getStaticProps>) {
	const router = useRouter();
	const {product, categoryParents} = data!;
	const [parents, setParents] = useState(categoryParents);
	const [selectedVariants, setSelectedVariants] = useState<IProductVariant[]>(product?.extendedVariants?.list || []);
	const [error, setError] = useState(false);

	const title = product?.text.custom_title || product?.text.title;
	const query = qs.parse(router.asPath.split('?')[1] || '');
	const {category, ...requestParams} = query;

	const fetchNewParents = async (categoryId: number) => {
		const {parents} = await apiClient.catalog.getCategoryItem(categoryId, {with_parents: 1});
		if (parents) setParents(parents);
	};

	useEffect(() => {
		if (!product) return;
		const categoryId = parseInt(category as string) || null;
		if (!categoryId) return;
		const notDefaultCat = product.categoryRels.some(cat => (cat.is_default !== true && cat.category_id === categoryId));

		if (notDefaultCat) {
			fetchNewParents(categoryId);
		}
	}, []); //eslint-disable-line

	return (
		<>
			<MainLayout title={title} metaData={getProductMetaData(product!)}>
				<div className='container content-box' >
					{parents && <BreadCrumbs parents={parents} activeParams={requestParams} />}
					<div className='product-wrapper' itemScope itemType='http://schema.org/Product'>
						<div className='row'>
							<div className='col-md-7'>
								<h1 className='mb-4' itemProp='name'>{product?.text.title}</h1>
								<ProductImages images={product?.images!} />
							</div>
							<div className='col-md-5'>
								{product?.has_variants &&
									<>
										<VariantPicker variants={product?.extendedVariants!} onPick={setSelectedVariants} error={error} setError={setError} />
									</>}
								<PriceAndBuy product={product!} selectedVariants={selectedVariants} setError={setError} />
								<ProductCharacteristics characteristics={product?.nonVariantCharacteristics!} />
								<h3>Shipping</h3>
								We ship ASAP!
							</div>
						</div>
						<div className='product-description row my-4'>
							{product?.text.description && <article itemProp='description' className='col-md-8 offset-md-2' dangerouslySetInnerHTML={{__html: product?.text.description}} />}
						</div>
						<ProductMeta product={product!} parents={parents} />
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
				props: {},
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
		const {parents} = await apiClient.catalog.getCategoryItem(categoryId, {with_parents: 1});
		categoryParents = parents!;
	}

	return {
		product,
		categoryParents
	};
};


interface IProductPageProps {
	data: IProductPageData | null;
}

interface IProductPageData {
	product: IProductItem | null;
	categoryParents: ICategoryFlatItem[] | null;
}
