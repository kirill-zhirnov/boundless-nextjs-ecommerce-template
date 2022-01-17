import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICartProduct, ICartTotal, IExtendedVariants, IVwItem} from 'boundless-api-client';

export interface CartState {
	cartId: string|null;
	loading: boolean;
	total: ICartTotal|null;
	showVariantModal: boolean;
	variantModalData: IVariantModalData;
	showCall2Order: boolean;
	call2OrderData: ICall2OrderData;
	submitting: boolean;
}

const initialState: CartState = {
	cartId: null,
	loading: false,
	total: null,
	showVariantModal: false,
	variantModalData: {},
	showCall2Order: false,
	call2OrderData: {},
	submitting: false,
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
		showVariantModal: (state, action: PayloadAction<IVariantModalData>) => {
			state.showVariantModal = true;
			state.variantModalData = action.payload;
		},
		hideVariantModal: (state) => {
			state.showVariantModal = false;
			state.variantModalData = {};
		},
		showCall2Order: (state, action: PayloadAction<ICall2OrderData>) => {
			state.showCall2Order = true;
			state.call2OrderData = action.payload;
		},
		hideCall2Order: (state) => {
			state.showCall2Order = false;
			state.call2OrderData = {};
		},
		setCartSubmitting: (state, action: PayloadAction<boolean>) => {
			state.submitting = action.payload;
		},
	},
});

export const {setCartId, setCartLoading, setCartTotal, showVariantModal, hideVariantModal, showCall2Order, hideCall2Order, setCartSubmitting} = cartSlice.actions;

export default cartSlice.reducer;

export interface IVariantModalData {
	variants?: IExtendedVariants;
	product?: ICartProduct;
}
export interface ICall2OrderData {
	qty?: number;
	item?: IVwItem;
}