import {useRouter} from 'next/router';
import {BoundlessOrderInfo} from 'boundless-checkout-react';
import {apiClient} from '../../lib/api';
import MainLayout from '../../layouts/Main';
import {GetServerSideProps} from 'next';
import {makeAllMenus} from '../../lib/menu';
import {IMenuItem} from '../../@types/components';

export default function ThankYouPage({mainMenu, footerMenu}: IProps) {
	const router = useRouter();
	if (!router.query.id) {
		return null;
	}

	return (
		<MainLayout title={'Thank you for your order!'}
								mainMenu={mainMenu}
								footerMenu={footerMenu}
		>
			<div className={'container'}>
				<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Thank you for your order!</h1>
				<BoundlessOrderInfo orderId={router.query.id as unknown as string}
														api={apiClient}
				/>
			</div>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const {mainMenu, footerMenu} = makeAllMenus({categoryTree});

	return {
		props: {
			mainMenu,
			footerMenu
		}
	};
};

interface IProps {
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
}