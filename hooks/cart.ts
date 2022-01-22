import {useAppDispatch, useAppSelector} from './redux';
import {RootState} from '../redux/store';
import {useEffect} from 'react';
import {initCart} from '../redux/actions/cart';

export function useCart() {
	const cart = useAppSelector((state: RootState) => state.cart);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initCart());
	}, []);//eslint-disable-line

	return {
		total: cart.total,
		id: cart.cartId,
		cartInited: cart.cartInited
	};
}