import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICartTotal} from 'boundless-api-client';

export interface CartState {
	cartId: string|null;
	loading: boolean;
	total: ICartTotal|null;
}

const initialState: CartState = {
	cartId: null,
	loading: false,
	total: null,
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCartId: (state, action: PayloadAction<string>) => {
			state.cartId = action.payload;
		},
		setCartLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setCartTotal: (state, action: PayloadAction<ICartTotal>) => {
			state.total = action.payload;
		},
	},
});

export const {setCartId, setCartLoading, setCartTotal} = cartSlice.actions;

export default cartSlice.reducer;
