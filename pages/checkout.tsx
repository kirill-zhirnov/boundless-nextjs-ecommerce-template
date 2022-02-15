import MainLayout from '../layouts/Main';
import {useCart} from '../hooks/cart';
import {useEffect} from 'react';
import CartRowLoader from '../components/cart/CartRowLoader';
import {apiClient} from '../lib/api';

import {BoundlessCheckout} from 'boundless-checkout-react';
//import dynamic from 'next/dynamic';
// const {BoundlessCheckout} = dynamic(() => import('boundless-checkout-react'), {ssr: false});

export default function CheckoutPage() {
	const {id: cartId, cartInited, total} = useCart();

	useEffect(() => {
		if (total?.qty === 0) {

		}
	}, [total]);

	const onHide = () => {};

	return (
		<MainLayout mainMenu={[]} footerMenu={[]}>
			<div className='container'>
				{cartInited ?
					<BoundlessCheckout show={true}
														 basename={'/checkout'}
														 cartId={cartId!}
														 onHide={onHide}
														 api={apiClient}
					/>
					: <Loader />
				}
			</div>
		</MainLayout>
	);
}

const Loader = () => {
	return (
		<div className='pt-md-4'>
			{[...Array(3)].map((_, i) => (
				<CartRowLoader key={i} bg={i % 2 === 0 ? '#f9f9f9' : ''} />
			))}
		</div>
	);
};