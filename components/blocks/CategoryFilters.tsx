import {ICategoryItem, IFilter, IFilterField, IFilterFieldRange} from 'boundless-api-client';
import {useEffect, useState} from 'react';
import {TQuery} from '../../@types/common';
import {apiClient} from '../../lib/services/api';
import {getFilterFieldsQuery} from '../../lib/services/category';
import FilterFields from './FilterFields';

export default function CategoryFilters({category, onCollectionChange, productsQuery}: CategotyFiltersProps) {
	const [filter, setFilter] = useState<IFilter | null>(null);
	const [filterFields, setFilterFields] = useState<IFilterFieldRange[]>([]);

	const [loading, setLoading] = useState(false);

	const changeFilters = (newParams: TQuery) => {
		const query = {...newParams};
		if (productsQuery['per-page']) Object.assign(query, {'per-page': productsQuery['per-page']});

		onCollectionChange(query);
	};

	const getFilters = async () => {
		setLoading(true);
		const filter = await fetchFilter(category.props?.filter_id || null);
		setFilter(filter || null);
		if (filter?.fields) {
			const filterFields = await fetchFilterFields(filter.fields, productsQuery);
			if (filterFields?.length) setFilterFields(filterFields);
		}
		setLoading(false);
	};

	useEffect(() => {

		if (category.props?.use_filter) {
			getFilters();
		}
	}, []) //eslint-disable-line

	if (loading) return <div>Loading...</div>;

	return (
		<>
			{filter && <FilterFields params={productsQuery} fields={filter.fields} filterFields={filterFields} changeFilters={changeFilters} />}
		</>
	);
}

interface CategotyFiltersProps {
	onCollectionChange: (params: {[key: string]: any}) => void;
	category: ICategoryItem;
	productsQuery: TQuery;
}

const fetchFilter = async (filterId: number | null) => {
	const filters = await apiClient.catalog.getFilters();
	const filter = filterId
		? filters.find(filter => filter.filter_id === filterId)
		: filters.find(filter => filter.is_default === true);

	return filter;
};

const fetchFilterFields = async (fields: IFilterField[], productsQuery: TQuery) => {
	const filter_fields = getFilterFieldsQuery(fields);

	const {ranges} = await apiClient.catalog.getFilterFieldsRanges({
		filter_fields,
		values: productsQuery || {}
	});

	console.log('--fetching fields', fields, ranges);
	return ranges;
};