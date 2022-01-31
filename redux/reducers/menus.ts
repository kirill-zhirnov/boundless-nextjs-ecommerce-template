import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: IMenusState = {
	main: null,
	footer: null
};

const menusSlice = createSlice({
	name: 'menus',
	initialState,
	reducers: {
		setMainMenu(state, action: PayloadAction<IMenuItem[]|null>) {
			state.main = action.payload;
		},
		setFooterMenu(state, action: PayloadAction<IMenuItem[]|null>) {
			state.footer = action.payload;
		}
	}
});

export const {setMainMenu, setFooterMenu} = menusSlice.actions;
export default menusSlice.reducer;

export interface IMenuItem {
	title: string,
	url?: string,
	img?: IMenuItemImage,
	isActive?: boolean,
	children?: IMenuItem[]
}

export interface IMenuItemImage {
	src: string,
	width?: number,
	height?: number
}

interface IMenusState {
	main: null|IMenuItem[];
	footer: null|IMenuItem[];
}

