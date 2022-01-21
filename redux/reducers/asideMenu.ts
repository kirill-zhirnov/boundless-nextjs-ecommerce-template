import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: IAsideMenuState = {
	isOpened: false
};

const asideMenuSlice = createSlice({
	name: 'asideMenu',
	initialState,
	reducers: {
		setIsOpened(state, action: PayloadAction<boolean>) {
			state.isOpened = action.payload;
		}
	}
});

export const {setIsOpened} = asideMenuSlice.actions;
export default asideMenuSlice.reducer;

export interface IAsideMenuState {
	isOpened: boolean
}