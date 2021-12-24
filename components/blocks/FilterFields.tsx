import {IFilterField, TFilterFieldType} from 'boundless-api-client';
import React, {useState} from 'react';
import PriceField from './FilterFields/PriceField';

export default function FilterFields({fields, changeFilters}: FilterFieldsProps) {
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

	return (
		<div className='content-box'>
			{fields.map(field => (
				<React.Fragment key={field.field_id}>
					{field.type === TFilterFieldType.price && <PriceField valueMin={filterParams.price_min} valueMax={filterParams.price_max} setValue={setParamsValue}/>}
				</React.Fragment>
			))}
			<div className='text-center p-3'>
				<button className='btn btn-primary btn-sm' onClick={() => changeFilters(filterParams)}>Show</button>
			</div>
		</div>
	);
}

interface FilterFieldsProps {
	fields: IFilterField[];
	changeFilters: (params: {[key: string]: any}) => void;
}

export interface IFilterParams {
	price_min?: number;
	price_max?: number;
}