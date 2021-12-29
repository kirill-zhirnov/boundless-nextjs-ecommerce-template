import {ICartItem} from 'boundless-api-client';
import {useEffect, useState} from 'react';
import CartItems from '../components/Cart/CartItems';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/services/api';
import {setCartTotal} from '../redux/reducers/cart';
import {addPromise} from '../redux/reducers/xhr';
import {RootState} from '../redux/store';
import CartRowLoader from '../components/Cart/CartRowLoader';

export default function CartPage() {
	const dispatch = useAppDispatch();
	const cartId = useAppSelector((state: RootState) => state.cart.cartId);
	const cartLoading = useAppSelector((state: RootState) => state.cart.loading);
	const [items, setItems] = useState<ICartItem[]>([]);
	const [loading, setLoading] = useState(false);

	const getCartItems = async (cartId: string) => {
		setLoading(true);
		const promise = apiClient.orders.getCartItems(cartId)
			.then(({cart, items}) => {
				if (cart && items) {
					setItems(items);
					dispatch(setCartTotal(cart.total));
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				setLoading(false);
			});

		dispatch(addPromise(promise));
	};

	useEffect(() => {
		if (cartId) getCartItems(cartId);
	}, [cartId]); //eslint-disable-line

	return (
		<>
			<MainLayout>
				<div className='container'>
					<main className='cart-page row'>
						<div className='col-lg-8 offset-lg-2'>
							<h1 className='text-center mb-3 mb-md-5'>Shopping cart</h1>
							<div className='cart-page__content content-box p-3'>
								{loading || cartLoading
									? <Loader />
									: <>
										{items?.length === 0 &&
											<div>
												<p className='text-center my-4'>
													Your shopping cart is empty.
												</p>
												<p className='text-center'>
													<a href='/' className='btn btn-success'>
														Go shopping!
													</a>
												</p>
											</div>}
										{items.length > 0 && <CartItems items={items} />}
									</>}
							</div>
						</div>
					</main>
				</div>
			</MainLayout>
		</>
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