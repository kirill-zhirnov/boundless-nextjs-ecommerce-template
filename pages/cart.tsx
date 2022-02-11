import {ICartItem} from 'boundless-api-client';
import {useEffect, useState} from 'react';
import CartItems from '../components/cart/CartItems';
import {useAppDispatch} from '../hooks/redux';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/api';
import {setCartTotal, TCartInited} from '../redux/reducers/cart';
import {addPromise} from '../redux/reducers/xhr';
import CartRowLoader from '../components/cart/CartRowLoader';
import {useCart} from '../hooks/cart';
import {makeAllMenus} from '../lib/menu';
import {IMenuItem} from '../@types/components';

export default function CartPage() {
	const dispatch = useAppDispatch();
	const {id: cartId, cartInited} = useCart();
	const [items, setItems] = useState<ICartItem[]>([]);
	const [mainMenu, setMainMenu] = useState<IMenuItem[]>([]);
	const [footerMenu, setFooterMenu] = useState<IMenuItem[]>([]);
	const [loading, setLoading] = useState(false);

	const getCartData = async (cartId: string) => {
		setLoading(true);

		const cartPromise = apiClient.orders.getCartItems(cartId);
		const menuPromise = apiClient.catalog.getCategoryTree({menu: 'category'});

		Promise.all([cartPromise, menuPromise])
			.then(([{cart, items}, categoryTree]) => {
				setItems(items);
				dispatch(setCartTotal(cart.total));

				const menus = makeAllMenus({categoryTree});
				setMainMenu(menus.mainMenu);
				setFooterMenu(menus.footerMenu);

			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));

		dispatch(addPromise(cartPromise));
		dispatch(addPromise(menuPromise));
	};

	useEffect(() => {
		if (cartId) getCartData(cartId);
	}, [cartId]); //eslint-disable-line

	return (
		<MainLayout mainMenu={mainMenu} footerMenu={footerMenu}>
			<div className='container'>
				<div className='cart-page row'>
					<div className='col-lg-8 offset-lg-2'>
						<h1 className='page-header page-header_h1  page-header_m-h1'>Shopping cart</h1>
						<div className='cart-page__content content-box p-3'>
							{(loading || cartInited === TCartInited.processing)
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
									{items.length > 0 && <CartItems items={items} setItems={setItems} />}
								</>}
						</div>
					</div>
				</div>
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