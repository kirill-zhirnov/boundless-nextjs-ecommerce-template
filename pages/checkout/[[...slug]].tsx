import {useCart} from '../../hooks/cart';
import {BoundlessCheckout} from 'boundless-checkout-react';
import {useRouter} from 'next/router';
import {apiClient} from '../../lib/api';
import {TCartInited} from '../../redux/reducers/cart';
import Loader from '../../components/Loader';
import logoImg from '../../assets/logo.svg';
import Head from 'next/head';

export default function CheckoutPage() {
	const {id: cartId, cartInited} = useCart();
	const router = useRouter();

	if (cartInited !== TCartInited.yes) {
		return <Loader />;
	}

	return (
		<>
			<Head>
				<meta name='robots' content='noindex' />
			</Head>
			<BoundlessCheckout cartId={cartId!}
												show={true}
												onHide={() => router.push('/cart')}
												onThankYouPage={(data) => router.push(`/thank-you/${data.orderId}`)}
												basename={'/checkout'}
												api={apiClient}
												logo={<img src={logoImg.src} width={logoImg.width} height={logoImg.height} className={'bdl-header__img-logo'} />}
			/>
		</>
	);
}