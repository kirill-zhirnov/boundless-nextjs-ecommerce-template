import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICurrency, ILocaleSettings} from 'boundless-api-client';

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
		},
		setBasicSettings(state, action: PayloadAction<{'system.currency': ICurrency, 'system.locale': ILocaleSettings}>) {
			const {'system.currency': currency, 'system.locale': localeSettings} = action.payload;

			return {
				...state,
				currency,
				localeSettings
			};
		}
	}
});

export const {startRouting, endRouting, setBasicSettings} = appSlice.actions;

export default appSlice.reducer;

export interface AppState {
	isRouteChanging: boolean;
	currency?: ICurrency,
	localeSettings?: ILocaleSettings,
}