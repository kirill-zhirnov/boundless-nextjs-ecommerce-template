export interface IPriceForTpl {
	price: number,
	oldPrice: number|null,
	isFrom: boolean
}

export const getPriceForTpl = (curPrice: number|number[], oldPrice: null|number|number[]): IPriceForTpl => {
	const out: IPriceForTpl = {
		price: Array.isArray(curPrice) ? curPrice[0] : curPrice,
		oldPrice: null,
		isFrom: (Array.isArray(curPrice) && curPrice[0] != curPrice[1]) ? true : false
	};

	if (oldPrice && !(Array.isArray(curPrice) && !Array.isArray(oldPrice))) {
		out.oldPrice = Array.isArray(oldPrice) ? oldPrice[0] : oldPrice;
	}

	return out;
};