import {setCartId, setCartLoading, setCartTotal} from '../reducers/cart';
import {AppThunk} from '../store';
import Cookie from 'js-cookie';
import {apiClient} from '../../lib/services/api';

export const getCartInfo = (): AppThunk => async (dispatch) => {
	const cartId = Cookie.get('boundless_cart_id');
	if (cartId) {
		dispatch(getCartTotal(cartId));
	} else {
		dispatch(retrieveCart());
	}
};

export const retrieveCart = (): AppThunk => async (dispatch) => {
	dispatch(setCartLoading(true));
	try {
		const cart = await apiClient.orders.retrieveCart();
		if (cart && cart.id) {
			dispatch(setCartId(cart.id));
			dispatch(setCartTotal(cart.total));
			Cookie.set('boundless_cart_id', cart.id);
		}
	} catch (err) {
		console.error(err);
	} finally {
		dispatch(setCartLoading(false));
	}
};

export const getCartTotal = (cartId: string): AppThunk => async (dispatch) => {
	dispatch(setCartLoading(true));
	try {
		const cart = await apiClient.orders.getCartInfo(cartId);
		if (cart && cart.id) {
			dispatch(setCartId(cart.id));
			dispatch(setCartTotal(cart.total));
			if (cartId !== cart.id) {
				Cookie.set('boundless_cart_id', cart.id);
			}
		}
	} catch (err) {
		console.error(err);
	} finally {
		dispatch(setCartLoading(false));
	}
};