import {ICartItem} from 'boundless-api-client';
import {useCallback, useEffect, useMemo, useState} from 'react';
import CartItems from '../components/cart/CartItems';
import {useAppDispatch} from '../hooks/redux';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/api';
import {setCartTotal, TCartInited} from '../redux/reducers/cart';
import {addPromise} from '../redux/reducers/xhr';
import {useCart} from '../hooks/cart';
import {makeAllMenus} from '../lib/menu';
import {IMenuItem} from '../@types/components';
import {GetServerSideProps} from 'next';
import CartLoader from '../components/cart/CartLoader';
import Link from 'next/link';
import {calcTotal, calcTotalPrice} from '../lib/calculator';
import {useRouter} from 'next/router';
import {IBasicSettings} from '../@types/settings';

export default function CartPage({mainMenu, footerMenu, basicSettings}: ICartPageProps) {
	const {cartInited} = useCart();
	const router = useRouter();
	const {items, setItems, loading, total} = useCartItems();

	return (
		<MainLayout
			mainMenu={mainMenu}
			footerMenu={footerMenu}
			basicSettings={basicSettings}
			noIndex
		>
			<div className='container'>
				<div className='cart-page row'>
					<div className='col-lg-8 offset-lg-2'>
						{router.query.error && <div className={'alert alert-danger'} role={'alert'}>{router.query.error}</div>}
						<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Shopping cart</h1>
						<div className='cart-page__content'>
							{(loading || cartInited === TCartInited.processing)
								? <CartLoader />
								: items.length > 0
									? <CartItems items={items} setItems={setItems} total={total}/>
									: <>
										<p className='cart-page__warning'>
											Your shopping cart is empty.
										</p>
										<p className='cart-page__warning'>
											<Link href='/'>
												<a className='btn btn-success'>Go shopping!</a>
											</Link>
										</p>
									</>}
						</div>
					</div>
				</div>
			</div>
		</MainLayout >
	);
}

export const getServerSideProps: GetServerSideProps<ICartPageProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const basicSettings = await apiClient.system.fetchSettings(['system.locale', 'system.currency']) as IBasicSettings;
	const {mainMenu, footerMenu} = makeAllMenus({categoryTree});

	return {
		props: {
			mainMenu,
			footerMenu,
			basicSettings
		}
	};
};

interface ICartPageProps {
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
	basicSettings: IBasicSettings;
}

const useCartItems = () => {
	const dispatch = useAppDispatch();
	const {id: cartId} = useCart();
	const [items, setItems] = useState<ICartItem[]>([]);
	const [loading, setLoading] = useState(false);

	const initCartData = useCallback((cartId: string) => {
		setLoading(true);

		const promise = apiClient.cart.getCartItems(cartId)
			.then(({cart, items}) => {
				setItems(items);
				dispatch(setCartTotal(cart.total));
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));

		dispatch(addPromise(promise));
	}, [dispatch]);

	useEffect(() => {
		if (cartId) {
			initCartData(cartId);
		}
	}, [cartId, initCartData]);

	const total = useMemo(() => calcTotal(items.map(el => ({
		qty: el.qty,
		price: calcTotalPrice(el.itemPrice.final_price!, el.qty)
	}))), [items]);

	useEffect(() => {
		dispatch(setCartTotal({
			qty: total.qty,
			total: total.price
		}));
	}, [total, dispatch]);

	return {
		items,
		setItems,
		loading,
		total
	};
};