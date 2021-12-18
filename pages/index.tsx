// import {IProduct} from '../@types/catalog/product';
import {IProduct} from 'boundless-api-client/types/catalog/product';
import CategoryMenu from '../components/blocks/CategoryMenu';
import ProductsList from '../components/blocks/ProductList';
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
	let categoryTree = null;
	let products: IProduct[] = [];
	try {
		categoryTree = await apiClient.catalog.getCategoryTree();
		products = await apiClient.catalog.getProducts({'per-page': 8});
	} catch (err) {
		console.error(err);
	}

	return {
		props: {
			categoryTree,
			products
		}
	};
}