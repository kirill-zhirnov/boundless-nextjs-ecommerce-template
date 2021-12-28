import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: IXHRState = {
	show: false,
	type: 'danger',
	text: 'Something went wrong'
};

const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		showErrorAlert(state, action: PayloadAction<string>) {
			state.show = true;
			state.type = 'danger';
			state.text = action.payload;
		},
		showSuccessAlert(state, action: PayloadAction<string>) {
			state.show = true;
			state.type = 'success';
			state.text = action.payload;
		},
		hideAlert(state) {
			state.show = false;
		},
		resetAlert() {
			return initialState;
		}
	}
});

export const {showErrorAlert, showSuccessAlert, hideAlert, resetAlert} = alertSlice.actions;

export default alertSlice.reducer;

export interface IXHRState {
	show: boolean;
	type: 'danger'|'success';
	text: string;
}