import {IFilter} from 'boundless-api-client';
import {useEffect, useState} from 'react';
import {TQuery} from '../../@types/common';
import {apiClient} from '../../lib/services/api';
import FilterFields from './FilterFields';

export default function CategoryFilters({filterId, changeFilters, params}: CategotyFiltersProps) {
	const [filter, setFilter] = useState<IFilter | null>(null);

	const [loading, setLoading] = useState(false);

	const fetchFilterFields = async () => {

	};


	useEffect(() => {
		const fetchFilters = async () => {
			setLoading(true);
			const filters = await apiClient.catalog.getFilters();
			const filter = filterId
				? filters.find(filter => filter.filter_id === filterId)
				: filters.find(filter => filter.is_default === true);

			if (filter) setFilter(filter);
			setLoading(false);
		};

		fetchFilters();
	}, []) //eslint-disable-line

	if (loading) return <div>Loading...</div>;

	return (
		<>
			{filter && <FilterFields params={params} fields={filter.fields} changeFilters={changeFilters} />}
		</>
	);
}

interface CategotyFiltersProps {
	changeFilters: (params: {[key: string]: any}) => void;
	filterId?: number | null;
	params: TQuery;
}
