import {ICategory} from 'boundless-api-client/types/catalog/category';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import CategoryHomeMenu from '../components/category/CategoryHomeMenu';
import ProductsList from '../components/ProductsList';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/services/api';

export default function IndexPage({categoryTree, products}: InferGetServerSidePropsType<typeof getServerSideProps>) {

	return (
		<>
			<MainLayout>
				<div className='container'>
					<div className='row'>
						<nav className='col-md-3 col-sm-4'>
							{categoryTree && <CategoryHomeMenu categoryTree={categoryTree} />}
						</nav>
						<main className='col-md-9 col-sm-8 content-box'>
							<ProductsList products={products} query={{}}/>
						</main>
					</div>
				</div>
			</MainLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const {products} = await apiClient.catalog.getProducts({'per-page': 8});

	return {
		props: {
			categoryTree,
			products
		}
	};
};

interface IIndexPageProps {
	categoryTree: ICategory[]|null;
	products: IProduct[];
}