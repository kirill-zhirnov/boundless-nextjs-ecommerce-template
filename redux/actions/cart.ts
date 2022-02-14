import {
	setCartInited,
	setCartSubmitting,
	setCartTotal, setInitStatus,
	showCall2Order,
	showVariantModal,
	TCartInited
} from '../reducers/cart';
import {AppThunk} from '../store';
import Cookie from 'js-cookie';
import {apiClient} from '../../lib/api';
import {addPromise} from '../reducers/xhr';
import {showErrorAlert} from '../reducers/alert';

export const initCart = (): AppThunk => async (dispatch, getState) => {
	const {cartInited} = getState().cart;
	if ([TCartInited.yes, TCartInited.processing].includes(cartInited)) {
		return;
	}

	dispatch(setInitStatus(TCartInited.processing));
	try {
		const cartInfo = await getCartByCookieOrRetrieve();
		Cookie.set('boundless_cart_id', cartInfo.id, {expires: 365, sameSite: 'None', secure: true});

		dispatch(setCartInited(cartInfo));
	} catch (err) {
		console.error(err);
		dispatch(setInitStatus(TCartInited.no));
	}
};

export const getCartByCookieOrRetrieve = async () => {
	const cartId = Cookie.get('boundless_cart_id');
	if (cartId) {
		try {
			return await apiClient.orders.getCartInfo(cartId);
		} catch (e) {
			//
		}
	}

	return await apiClient.orders.retrieveCart();
};

export const addItem2Cart = (itemId: number, qty: number = 1, callToOrder: boolean = true): AppThunk => async (dispatch, getState) => {
	try {
		const cartId = getState().cart.cartId;
		if (!cartId) {
			dispatch(showErrorAlert('Error loading cart'));
			return;
		}

		dispatch(setCartSubmitting(true));
		const promise = apiClient.orders.addItemToCart(cartId, itemId, qty).then(
			({product, actionRequired, cartTotal, added}) => {
				dispatch(setCartSubmitting(false));
				if (actionRequired === 'chooseVariant' && product) {
					dispatch(showVariantModal({product}));
				} else if (cartTotal) {
					dispatch(setCartTotal(cartTotal));
					if (callToOrder && added) dispatch(showCall2Order(added));
				}
			});
		dispatch(addPromise(promise));
	} catch (err) {
		console.error(err);
	}
};