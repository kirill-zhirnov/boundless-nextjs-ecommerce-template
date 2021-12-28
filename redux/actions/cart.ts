import {setCartId, setCartLoading, setCartSubmitting, setCartTotal, showCall2Order, showVariantModal} from '../reducers/cart';
import {AppThunk} from '../store';
import Cookie from 'js-cookie';
import {apiClient} from '../../lib/services/api';
import {addPromise} from '../reducers/xhr';

export const getCartInfo = (): AppThunk => async (dispatch) => {
	const cartId = Cookie.get('boundless_cart_id');
	if (cartId) {
		dispatch(getCartTotal(cartId));
		Cookie.set('boundless_cart_id', cartId, {expires: 365}); //refresh cookie expiration
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
			Cookie.set('boundless_cart_id', cart.id, {expires: 365});
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

export const addItem2Cart = (itemId: number, qty: number = 1, callToOrder: boolean = true): AppThunk => async (dispatch, getState) => {
	try {
		const cartId = getState().cart.cartId;
		if (cartId) {
			dispatch(setCartSubmitting(true));
			const promise = apiClient.orders.addItemToCart(cartId, itemId, qty).then(
				({variants, product, actionRequired, cartTotal}) => {
					dispatch(setCartSubmitting(false));
					if (actionRequired === 'chooseVariant' && variants && product) {
						dispatch(showVariantModal({product, variants}));
					} else if (cartTotal) {
						dispatch(setCartTotal(cartTotal));
						if (callToOrder) dispatch(showCall2Order({product, qty}));
					}
				});
			dispatch(addPromise(promise));
		}
	} catch (err) {
		console.error(err);
	}
};
