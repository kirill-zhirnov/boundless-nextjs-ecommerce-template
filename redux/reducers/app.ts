import {createSlice} from '@reduxjs/toolkit';

const appSlice = createSlice({
	name: 'app',
	initialState: {
		isRouteChanging: false,
	} as AppState,
	reducers: {
		startRouting(state) {
			state.isRouteChanging = true;
		},
		endRouting(state) {
			state.isRouteChanging = false;
		}
	}
});

export const {startRouting, endRouting} = appSlice.actions;

export default appSlice.reducer;

export interface AppState {
	isRouteChanging: boolean;
}