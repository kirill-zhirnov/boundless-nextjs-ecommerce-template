export interface IBreadCrumbItem {
	title: string;
	isActive?: boolean;
	url?: string
}

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