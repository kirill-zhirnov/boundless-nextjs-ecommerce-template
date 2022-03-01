import {useRouter} from 'next/router';
import {BoundlessOrderInfo} from 'boundless-checkout-react';
import {apiClient} from '../../lib/api';

export default function ThankYouPage() {
	const router = useRouter();
	console.log('router:', router.query.id);
	if (!router.query.id) {
		return <p>soon</p>;
	}

	console.log('going futher to checkout');
	return (
		<BoundlessOrderInfo orderId={router.query.id as unknown as string}
												api={apiClient}
		/>
	);
}