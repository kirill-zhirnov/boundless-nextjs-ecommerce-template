import {useCart} from '../../hooks/cart';
import {BoundlessCheckout} from 'boundless-checkout-react';
import {useRouter} from 'next/router';
import {apiClient} from '../../lib/api';
import {TCartInited} from '../../redux/reducers/cart';
import Loader from '../../components/Loader';
import logoImg from '../../assets/logo.svg';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'boundless-checkout-react/dist/index.esm.css';

export default function CheckoutPage() {
	const {id: cartId, cartInited} = useCart();
	const router = useRouter();

	if (cartInited !== TCartInited.yes) {
		return <Loader />;
	}

	return (
		<BoundlessCheckout cartId={cartId!}
											 show={true}
											 onHide={() => router.push('/cart')}
											 onThankYouPage={(data) => {console.log('need to go to the thank-you-page:', data);}}
											 basename={'/checkout'}
											 api={apiClient}
											 logo={<img src={logoImg.src} width={logoImg.width} height={logoImg.height} className={'bdl-header__img-logo'} />}
		/>
	);
}