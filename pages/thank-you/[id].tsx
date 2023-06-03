import {useRouter} from 'next/router';
import {StarterWrapper, startOrderInfo, resetCheckoutState} from 'boundless-checkout-react';
import {apiClient} from '../../lib/api';
import MainLayout from '../../layouts/Main';
import {GetServerSideProps} from 'next';
import {makeAllMenus} from '../../lib/menu';
import {IMenuItem} from '../../@types/components';
import {useCallback, useEffect, useRef} from 'react';

export default function ThankYouPage({mainMenu, footerMenu}: IProps) {
	const router = useRouter();
	const checkoutStarter = useRef<StarterWrapper>();

	const checkoutRef = useCallback((node: HTMLDivElement) => {
		if (node && router.query.id) {
			checkoutStarter.current = startOrderInfo(node, {
				orderId: router.query.id as unknown as string,
				api: apiClient,
				onError: (error) => console.error('order info error:', error)
			});
		}
	}, [router.query.id]);

	useEffect(() => {
		return () => {
			if (checkoutStarter.current) {
				checkoutStarter.current.destroy();
				resetCheckoutState();
			}
		};
	}, []);

	if (!router.query.id) {
		return null;
	}

	return (
		<MainLayout title={'Thank you for your order!'}
								mainMenu={mainMenu}
								footerMenu={footerMenu}
								noIndex
		>
			<div className={'container'}>
				<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Thank you for your order!</h1>
				<div ref={checkoutRef} />
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