import {IProduct} from 'boundless-api-client';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import ProductsList from '../components/ProductsList';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/api';
import {makeAllMenus} from '../lib/menu';
import VerticalMenu from '../components/VerticalMenu';
import {IMenuItem} from '../@types/components';
import ProductsSlider from '../components/ProductsSlider';
import SliderWrapper from '../components/SliderWrapper';

export default function IndexPage({products, mainMenu, footerMenu}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<MainLayout mainMenu={mainMenu} footerMenu={footerMenu}>
			<div className='container'>
				<div className='row'>
					<nav className='col-md-3 col-sm-4'>
						{mainMenu && <VerticalMenu menuList={mainMenu} />}
					</nav>
					<div className='col-md-9 col-sm-8'>
						<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Boundless store</h1>
						<ProductsList products={products} query={{}}/>
					</div>
				</div>
				<ProductsSlider products={products.slice(0, 5)} />
				<SliderWrapper />
			</div>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const {products} = await apiClient.catalog.getProducts({collection: ['main-page'], sort: 'in_collection'});

	const menus = makeAllMenus({categoryTree});

	return {
		props: {
			products,
			...menus
		}
	};
};

interface IIndexPageProps {
	products: IProduct[];
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
}