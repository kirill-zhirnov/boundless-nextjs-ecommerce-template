import {IProduct} from 'boundless-api-client';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import ProductsList from '../components/ProductsList';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/api';
import {makeAllMenus} from '../lib/menu';
import VerticalMenu from '../components/VerticalMenu';
import {IMenuItem} from '../@types/components';
import SwiperSlider from '../components/SwiperSlider';
import cliffImg from '../assets/cliff_1.jpg';
import cliff2Img from '../assets/cliff_2.jpg';

export default function IndexPage({products, mainMenu, footerMenu}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<MainLayout mainMenu={mainMenu} footerMenu={footerMenu}>
			<div className='container'>
				<MainPageSlider />
				<div className='row'>
					<nav className='col-md-3 col-sm-4'>
						{mainMenu && <VerticalMenu menuList={mainMenu} />}
					</nav>
					<div className='col-md-9 col-sm-8'>
						<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Boundless store</h1>
						<ProductsList products={products} query={{}}/>
					</div>
				</div>
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

function MainPageSlider() {
	const slides = [
		{
			'img': cliffImg.src,
			'link': '',
			'caption': 'Three things cannot be long hidden: The Sun, The Moon, and The Truth.',
			'captionPosition': 'center',
			'useFilling': true,
			'fillingColor': '#000000',
			'fillingOpacity': 0.40
		},
		{
			'img': cliff2Img.src,
			'link': '',
			'caption': 'Pray not for easy lives, pray to be stronger men.',
			'captionPosition': null,
			'useFilling': true,
			'fillingColor': '#000000',
			'fillingOpacity': 0.4
		}
	];

	return (
		<SwiperSlider
			showPrevNext
			roundCorners
			pagination='progressbar'
			size={'large'}
			slides={slides}
			className={'mb-4'}
		/>
	);
}