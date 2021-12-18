// import {IProduct} from '../@types/catalog/product';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import CategoryMenu from '../components/blocks/CategoryMenu';
import ProductsList from '../components/blocks/ProductsList';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/services/api';

export default function IndexPage({categoryTree, products}: IIndexPageProps) {
	return (
		<>
			<MainLayout>
				<div className='container'>
					<div className='row'>
						<nav className='col-md-3 col-sm-4'>
							{categoryTree && <CategoryMenu categoryTree={categoryTree} />}
						</nav>
						<main className='col-md-9 col-sm-8'>
							<ProductsList products={products} />
						</main>
					</div>
				</div>
			</MainLayout>
		</>
	);
}

interface IIndexPageProps {
	categoryTree: null;
	products: IProduct[];
}

export async function getStaticProps() {
	const categoryTree = await apiClient.catalog.getCategoryTree();
	const {products} = await apiClient.catalog.getProducts({'per-page': 8});

	return {
		props: {
			categoryTree,
			products
		}
	};
}