import {IProduct} from 'boundless-api-client';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import ProductsList from '../components/ProductsList';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/api';
import {makeAllMenus} from '../lib/menu';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {IMenuItem, setFooterMenu, setMainMenu} from '../redux/reducers/menus';
import {RootState} from '../redux/store';
import VerticalMenu from '../components/VerticalMenu';

export default function IndexPage({products, mainMenu, footerMenu}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const dispatch = useAppDispatch();
	dispatch(setMainMenu(mainMenu));
	dispatch(setFooterMenu(footerMenu));

	const mainMenuList = useAppSelector((state: RootState) => state.menus.main);

	return (
		<MainLayout>
			<div className='container'>
				<div className='row'>
					<nav className='col-md-3 col-sm-4'>
						{mainMenuList && <VerticalMenu menuList={mainMenuList} />}
					</nav>
					<main className='col-md-9 col-sm-8 content-box'>
						<h1 className='page-header page-header_h1  page-header_m-h1'>Boundless store</h1>
						<ProductsList products={products} query={{}}/>
					</main>
				</div>
			</div>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const {products} = await apiClient.catalog.getProducts({'per-page': 8});

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