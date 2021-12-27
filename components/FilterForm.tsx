import {IFilterField, IFilterFieldRange, TCharacteristicType, TFilterFieldType} from "boundless-api-client";
import {TQuery} from "../@types/common";
import {SyntheticEvent, useCallback, useEffect, useState} from "react";
import {apiClient} from "../lib/services/api";
import PriceRangeField from "./filterForm/PriceRange";
import _debounce from "lodash/debounce";
import MultipleSelectCharacteristic from "./filterForm/MultipleSelectCharacteristic";

/**
 * @param filterFields - might be passed manually, e.g. pass:
 * [{type: 'price'}] to have filters by price only. In other words you don't necessarily need to fetch filters from the server side.
 *
 * @param queryParams
 * @param onSubmit
 * @constructor
 */
export default function FilterForm({filterFields, queryParams, onSearch}: IFilterFormProps) {
	const [hasChanged, setHasChanged] = useState<boolean>(false);
	const [values, setValues] = useState<TQuery>({});
	const [ranges, setRanges] = useState<IFilterFieldRange[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isReCalculating, setIsReCalculating] = useState<boolean>(false);
	const [preSearchResult, setPreSearchResult] = useState<null|number>(null);

	useEffect(() => {
		setIsLoading(true);
		fetchRanges(filterFields, queryParams).then(ranges => {
			setValues({...makeInitialValues(ranges), ...queryParams});
			setRanges(ranges);
			setIsLoading(false);
		});
	}, []);
	const reCalcRanges = useCallback(_debounce((values) => {
		setIsReCalculating(true);
		fetchRanges(filterFields, values).then(ranges => {
			setRanges(ranges);
			setIsReCalculating(false);
		});
	}, 1000), []);

	const onChange = (key: string, value: any, characteristicId?: number) => {
		let newValues: TQuery = {};
		if (key === 'props') {
			const props = Object.assign({}, values.props, {[characteristicId!]: value});
			newValues = {...values, ...{props: props}};
		} else {
			newValues = {...values, ...{[key]: value}};
		}

		setHasChanged(true);
		setValues(newValues);
		reCalcRanges(newValues);
	};

	const onSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		onSearch(values);
	};

	if (!ranges.length)
		return null;

	if (isLoading)
		return <div>Loading...</div>;

	return (
		<form className={'filters'} onSubmit={onSubmit}>
			{ranges.map((filterField, i) => {
				switch (filterField.type) {
					case TFilterFieldType.price:
						return <PriceRangeField field={filterField}
																		onChange={onChange}
																		values={values}
																		key={i} />;

					case TFilterFieldType.characteristic: {
						if (isMultiCaseType(filterField.characteristic!.type)) {
							return <MultipleSelectCharacteristic
								field={filterField}
								onChange={onChange}
								values={values}
								key={i} />;
						}
						break;
					}
				}
			})}
			<div className="btn-group" role="group">
				<button type="submit"
								className="btn btn-primary"
								disabled={!hasChanged}
				>{getSubmitLabel(isReCalculating, preSearchResult)}</button>
				<button type="button" className="btn btn-secondary">Clear</button>
			</div>
		</form>
	);
}

const fetchRanges = async (filterFields: TShortFilterField[], values: TQuery) => {
	const filter_fields = filterFields.map(
		({type, characteristic_id}) => ({type, characteristic_id})
	);
	const {ranges} = await apiClient.catalog.getFilterFieldsRanges({filter_fields, values})

	return ranges;
};

const getSubmitLabel = (isReCalculating: boolean, preSearchResult: null|number): string => {
	return 'soon :)';
};

const makeInitialValues = (filterFields: IFilterFieldRange[]) => {
	const out: TQuery = {};

	for (const filterField of filterFields) {
		switch (filterField.type) {
			case TFilterFieldType.price:
				Object.assign(out, {price_min: '', price_max: ''});
				break;

			case TFilterFieldType.characteristic:
				if (isMultiCaseType(filterField.characteristic!.type)) {
					if (!('props' in out)) {
						out.props = {};
					}

					out.props[filterField.characteristic_id!] = [];
				}
				break;
		}
	}

	return out;
};

const isMultiCaseType = (type: TCharacteristicType) => [TCharacteristicType.radio, TCharacteristicType.select, TCharacteristicType.checkbox].includes(type);

type TShortFilterField = Pick<IFilterField, "type" | "characteristic_id">;

interface IFilterFormProps {
	filterFields: TShortFilterField[],
	queryParams: TQuery;
	onSearch: (data: TQuery) => void;
}

export interface IFilterFieldProps {
	field: IFilterFieldRange;
	values: TQuery;
	onChange: (key: string, value: any, characteristicId?: number) => void;
}