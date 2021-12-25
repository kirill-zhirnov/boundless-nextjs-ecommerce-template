import {IFilterField, TFilterFieldType, TFilterType} from 'boundless-api-client';
import {IFilterFieldProp, TGetProductsInStock} from 'boundless-api-client/endpoints/catalog';
import React, {useEffect, useState} from 'react';
import {TQuery} from '../../@types/common';
import {filterProductsQuery} from '../../lib/services/category';
import CharacteristicField from './FilterFields/CharacteristicField';
import PriceField from './FilterFields/PriceField';
import StockField from './FilterFields/StockField';

export default function FilterFields({fields, params, filterFields, changeFilters}: FilterFieldsProps) {
	const [filterParams, setFilterParams] = useState<IFilterParams>({});

	const setParamsValue = (key: keyof IFilterParams, value: number | string | null) => {
		setFilterParams(prev => {
			const params = {...prev};
			if (!value) {
				delete params[key];
				return params;
			}
			return ({...prev, [key]: value});
		});
	};

	useEffect(() => {
		setFilterParams(filterProductsQuery(params, false));
	}, [params]);

	const clearFilters = () => {
		setFilterParams({});
		changeFilters({});
	};

	return (
		<div className='content-box'>
			{fields.map(field => (
				<React.Fragment key={field.field_id}>
					{field.type === TFilterFieldType.price &&
						<PriceField
							valueMin={filterParams.price_min}
							valueMax={filterParams.price_max}
							filterField={findFilterField(filterFields, field)}
							setValue={setParamsValue}
						/>}
					{field.type === TFilterFieldType.characteristic && field.characteristic &&
						<CharacteristicField
							characteristic={field.characteristic}
							setValue={setParamsValue}
							filterField={findFilterField(filterFields, field)}
						/>}
					{field.type === TFilterFieldType.availability && <StockField inStock={filterParams.in_stock} setValue={setParamsValue} />}
				</React.Fragment>
			))}
			<div className='text-center p-3'>
				<div className='btn-group btn-group-sm'>
					<button className='btn btn-outline-primary' onClick={clearFilters}>Clear</button>
					<button className='btn btn-primary' onClick={() => changeFilters(filterParams)}>Show</button>
				</div>
			</div>
		</div>
	);
}

interface FilterFieldsProps {
	fields: IFilterField[];
	params: TQuery;
	filterFields: IFilterFieldProp[];
	changeFilters: (params: TQuery) => void;
}

export interface IFilterParams {
	price_min?: number;
	price_max?: number;
	in_stock?: TGetProductsInStock;
}

const findFilterField = (filterFields: IFilterFieldProp[], field: IFilterField) => {
	switch (field.type) {
		case TFilterFieldType.price:
			return filterFields.find(filterField => filterField.type === TFilterType.price_range);
		case TFilterFieldType.characteristic:
			return filterFields.find(filterField => filterField.characteristic_id === field.characteristic_id);
		default:
			return undefined;
	}
};