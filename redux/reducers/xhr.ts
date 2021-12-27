import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const xhrSlice = createSlice({
	name: 'xhr',
	initialState: {
		promises: []
	} as IXHRState,
	reducers: {
		addPromise(state, action: PayloadAction<Promise<any>>) {
			state.promises.push(action.payload);
		},
		cleanPromises(state) {
			state.promises = [];
		}
	}
});

export const {addPromise, cleanPromises} = xhrSlice.actions;

export default xhrSlice.reducer;

export interface IXHRState {
	promises: Promise<any>[]
}