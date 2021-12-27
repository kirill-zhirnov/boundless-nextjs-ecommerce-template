import {ICategoryItem, IFilter, IFilterField, IFilterFieldRange} from 'boundless-api-client';
import {useEffect, useState} from 'react';
import {TQuery} from '../../@types/common';
import {apiClient} from '../../lib/services/api';
import {getFilterFieldsQuery} from '../../lib/services/category';
import FilterFields from './FilterFields';

export default function CategoryFilters({category, onCollectionChange, productsQuery}: ICategoryFiltersProps) {
	const [filter, setFilter] = useState<IFilter | null>(null);
	const [fieldRanges, setFieldRanges] = useState<IFilterFieldRange[]>([]);

	const [loading, setLoading] = useState(false);

	const changeFilters = (newParams: TQuery) => {
		const query = {...newParams};
		if (productsQuery['per-page']) Object.assign(query, {'per-page': productsQuery['per-page']});

		onCollectionChange(query);
	};

	const initFilters = async () => {
		setLoading(true);

		const {filter, fieldRanges} = await fetchInitialFilters(category, productsQuery);

		setFilter(filter);
		setFieldRanges(fieldRanges);
		setLoading(false);
	};

	useEffect(() => {
		initFilters();
	}, [category])

	if (loading) return <div>Loading...</div>;

	return (
		<>
			{filter && <FilterFields params={productsQuery} fields={filter.fields} filterFields={fieldRanges} changeFilters={changeFilters} />}
		</>
	);
}

interface ICategoryFiltersProps {
	onCollectionChange: (params: {[key: string]: any}) => void;
	category: ICategoryItem;
	productsQuery: TQuery;
}

const fetchInitialFilters = async (category: ICategoryItem, productsQuery: TQuery): Promise<{filter: IFilter|null, fieldRanges: IFilterFieldRange[]}> => {
	let fieldRanges: IFilterFieldRange[] = [], filter: IFilter|null = null;
	if (!category.props!.use_filter) {
		return {filter, fieldRanges};
	}

	filter = await fetchFilter(category.props!.filter_id);
	if (filter) {
		fieldRanges = await fetchFilterFields(filter.fields, productsQuery);
	}

	return {filter, fieldRanges};
};

const fetchFilter = async (filterId: number | null): Promise<IFilter|null> => {
	const filters = await apiClient.catalog.getFilters();
	const filter = filterId
		? filters.find(filter => filter.filter_id === filterId)
		: filters.find(filter => filter.is_default === true);

	return filter || null;
};

const fetchFilterFields = async (fields: IFilterField[], productsQuery: TQuery): Promise<IFilterFieldRange[]> => {
	const filter_fields = getFilterFieldsQuery(fields);

	const {filterFields} = await apiClient.catalog.getFilterFields({
		filter_fields,
		values: productsQuery
	});

	return filterFields;
};