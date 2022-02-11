import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import xhrReducers from './reducers/xhr';
import cartReducers from './reducers/cart';
import alertReducers from './reducers/alert';
import appReducers from './reducers/app';
import asideMenuReducers from './reducers/asideMenu';

export const store = configureStore({
	reducer: {
		xhr: xhrReducers,
		cart: cartReducers,
		alert: alertReducers,
		app: appReducers,
		asideMenu: asideMenuReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['Promise'],
				ignoredActionPaths: ['payload'],
				ignoredPaths: ['xhr.promises'],
			},
		})
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
