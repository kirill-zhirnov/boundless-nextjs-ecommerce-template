import {IFilterField, IFilterFieldRange, TCharacteristicType, TFilterFieldType} from 'boundless-api-client';
import {TQuery} from '../@types/common';
import {SyntheticEvent, useCallback, useEffect, useRef, useState} from 'react';
import {apiClient} from '../lib/services/api';
import PriceRangeField from './filterForm/PriceRange';
import _debounce from 'lodash/debounce';
import _omit from 'lodash/omit';
import _isObjectLike from 'lodash/isObjectLike';
import _pick from 'lodash/pick';
import MultipleSelectCharacteristic from './filterForm/MultipleSelectCharacteristic';
import TextCharacteristic from './filterForm/TextCharacteristic';
import BrandSelect from './filterForm/BrandSelect';
import Stock from './filterForm/Stock';
import isEqual from 'lodash/isEqual';

/**
 * @param filterFields - might be passed manually, e.g. pass:
 * [{type: 'price'}] to have filters by price only. In other words you don't necessarily need to fetch filters from the server side.
 *
 * @param queryParams
 * @param onSubmit
 * @constructor
 */
export default function FilterForm({filterFields, queryParams, categoryId, onSearch}: IFilterFormProps) {
	const [hasChanged, setHasChanged] = useState<boolean>(false);
	const [values, setValues] = useState<TQuery>({});
	const [ranges, setRanges] = useState<IFilterFieldRange[]>([]);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [preSearchResult, setPreSearchResult] = useState<null | number>(null);

	const prevQuery = useRef<TQuery>(queryParams);
	const submitted = useRef(false);

	const getData = () => {
		const sanitizedQuery = sanitizeIncomingQuery(queryParams);
		setIsFetching(true);
		fetchRanges(filterFields, {category: [categoryId], ...sanitizedQuery}).then(({ranges}) => {
			setValues({...sanitizedQuery, ...makeInitialValues(ranges, sanitizedQuery)});
			setRanges(ranges);
			setIsFetching(false);
		}).catch(console.error);
	};

	useEffect(() => {
		if (filterQueryChanged(prevQuery.current, queryParams) && !submitted.current) {
			getData();
		}
		prevQuery.current = queryParams;
		submitted.current = false;
	}, [queryParams]); // eslint-disable-line

	useEffect(() => {
		getData();
	}, []); //eslint-disable-line

	// eslint-disable-next-line
	const reCalcRanges = useCallback(_debounce((values) => {
		setIsFetching(true);
		fetchRanges(filterFields, {category: [categoryId], ...values}).then(({ranges, totalProducts}) => {
			setRanges(ranges);
			setPreSearchResult(totalProducts);
			setIsFetching(false);
		}).catch(console.error);
	}, 500), []);

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

		const filteredValues = filterEmptyValues(values);
		onSearch(_omit(filteredValues, ['page']));
		submitted.current = true;
		setHasChanged(false);
	};

	const onClear = (e: SyntheticEvent) => {
		e.preventDefault();

		const clearedValues = _omit(values, ['page', 'in_stock', 'props', 'price_min', 'price_max', 'brand', 'in_stock']);

		onSearch(clearedValues);
		setValues({...clearedValues, ...makeInitialValues(ranges, clearedValues)});
		setIsFetching(true);
		fetchRanges(filterFields, clearedValues).then(({ranges}) => {
			setRanges(ranges);
			setHasChanged(false);
			setIsFetching(false);
		}).catch(console.error);
	};

	if (!ranges.length) {
		if (isFetching)
			return <div>Loading...</div>;

		return null;
	}

	return (
		<form className={'filters px-1'} onSubmit={onSubmit}>
			{ranges.map((filterField, i) => {
				switch (filterField.type) {
					case TFilterFieldType.price:
						return <PriceRangeField field={filterField}
							onChange={onChange}
							values={values}
							key={i} />;

					case TFilterFieldType.brand:
						return <BrandSelect field={filterField}
							onChange={onChange}
							values={values}
							key={i} />;

					case TFilterFieldType.availability:
						return <Stock field={filterField}
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
						} else {
							return <TextCharacteristic
								field={filterField}
								onChange={onChange}
								values={values}
								key={i} />;
						}
					}
				}
			})}
			<div className='btn-group' role='group'>
				<button type='button'
					className='btn btn-secondary'
					onClick={onClear}
					disabled={isFetching}
				>Clear</button>
				<button type='submit'
					className='btn btn-primary'
					disabled={!hasChanged || isFetching}
				>{getSubmitLabel(hasChanged, isFetching, preSearchResult)}</button>
			</div>
		</form>
	);
}

const fetchRanges = async (filterFields: TShortFilterField[], values: TQuery) => {
	const filter_fields = filterFields.map(
		({type, characteristic_id}) => ({type, characteristic_id})
	);
	const data = await apiClient.catalog.getFilterFieldsRanges({filter_fields, values});

	return data;
};

const getSubmitLabel = (hasChanged: boolean, isFetching: boolean, preSearchResult: null | number): string => {
	if (hasChanged) {
		if (isFetching)
			return 'Calculating...';

		if (preSearchResult !== null)
			return `Show (${preSearchResult})`;
	}

	return 'Search';
};

const makeInitialValues = (filterFields: IFilterFieldRange[], query: TQuery) => {
	const out: TQuery = {};

	for (const filterField of filterFields) {
		switch (filterField.type) {
			case TFilterFieldType.price:
				Object.assign(out, {price_min: '', price_max: ''}, _pick(query, ['price_min', 'price_max']));
				break;

			case TFilterFieldType.brand:
				Object.assign(out, {brand: (query.brand || []).map((el: string) => Number(el))});
				break;

			case TFilterFieldType.availability:
				Object.assign(out, {in_stock: query.in_stock || ''});
				break;

			case TFilterFieldType.characteristic: {
				const props = (_isObjectLike(query.props) && !Array.isArray(query.props)) ? query.props : {};
				if (!('props' in out)) {
					out.props = {};
				}

				if (isMultiCaseType(filterField.characteristic!.type)) {
					out.props[filterField.characteristic_id!] = (filterField.characteristic_id! in props && Array.isArray(props[filterField.characteristic_id!]))
						? props[filterField.characteristic_id!]
						: [];
				} else {
					out.props[filterField.characteristic_id!] = (filterField.characteristic_id! in props)
						? String(props[filterField.characteristic_id!])
						: '';
				}
				break;
			}
		}
	}

	return out;
};

const filterEmptyValues = (values: TQuery): TQuery => {
	const outValues: TQuery = {};

	for (const [key, val] of Object.entries(values)) {
		if (key == 'props') {
			const props = filterEmptyValues(val);
			if (Object.keys(props).length) {
				outValues[key] = props;
			}
		} else {
			if (Array.isArray(val)) {
				if (val.length) {
					outValues[key] = val;
				}
			} else if (val !== '') {
				outValues[key] = val;
			}
		}
	}

	return outValues;
};

const sanitizeIncomingQuery = (queryParams: TQuery): TQuery => {
	const sanitizedQuery: TQuery = {};
	for (const [key, val] of Object.entries(queryParams)) {
		if (key === 'props') {
			if (_isObjectLike(val) && !Array.isArray(val)) {
				sanitizedQuery[key] = val;
			}
		} else {
			sanitizedQuery[key] = val;
		}
	}

	return sanitizedQuery;
};

const filterQueryChanged = (oldQuery: TQuery, newQuery: TQuery) => {
	if (oldQuery === newQuery) return false;

	const filterKeys = ['brand', 'price_min', 'price_max', 'props', 'in_stock'];

	for (const key of filterKeys) {
		if (key === 'props' || key === 'brand') {
			if (!isEqual(oldQuery[key], newQuery[key])) return true;
		} else {
			const valuesEqual = oldQuery[key] && newQuery[key] && oldQuery[key] === newQuery[key];
			const noValues = !oldQuery[key] && !newQuery[key];
			if (!(valuesEqual || noValues))
				return true;
		}
	}

	return false;
};

const isMultiCaseType = (type: TCharacteristicType) => [TCharacteristicType.radio, TCharacteristicType.select, TCharacteristicType.checkbox].includes(type);

type TShortFilterField = Pick<IFilterField, 'type' | 'characteristic_id'>;

interface IFilterFormProps {
	filterFields: TShortFilterField[],
	queryParams: TQuery;
	categoryId: number;
	onSearch: (data: TQuery) => void;
}

export interface IFilterFieldProps {
	field: IFilterFieldRange;
	values: TQuery;
	onChange: (key: string, value: any, characteristicId?: number) => void;
}