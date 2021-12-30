import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import SortUp from '@fortawesome/fontawesome-free/svgs/solid/sort-amount-down.svg';
import SortDown from '@fortawesome/fontawesome-free/svgs/solid/sort-amount-down-alt.svg';
import {TQuery, TSortOrder} from '../@types/common';

const sortFields = [
	{id: 1, title: 'Default', order: false, alias: 'default'},
	{id: 2, title: 'By price', order: true, alias: 'price'},
];

export default function SortButtons({params, onSort}: {params: TQuery, onSort: (query: TQuery) => void}) {
	const activeField = getActiveSortField(params.sort);
	const [activeId, setActiveId] = useState<number>(activeField.id);
	const [order, setOrder] = useState<TSortOrder>(activeField.order);

	useEffect(() => {
		const {id, order} = getActiveSortField(params.sort);
		setActiveId(id);
		setOrder(order);
	}, [params]);

	const onSortClick = (e: React.MouseEvent, id: number) => {
		e.preventDefault();

		const newOrder = activeId === id ? getOppositeOrder(order) : TSortOrder.asc;
		setOrder(newOrder);
		setActiveId(id);

		const newAlias = sortFields.find(el => el.id === id)!.alias;
		const newSortQuery = `${newOrder}${newAlias === 'default' ? '' : newAlias}`;
		const newParams = {...params};

		if (newSortQuery) {
			Object.assign(newParams, {sort: newSortQuery});
		} else {
			delete newParams.sort;
		}

		onSort(newParams);
	};

	return (
		<div className='sort-buttons d-flex align-items-center justify-content-end mb-2'>
			<label className='small me-2'>Sort by:</label>
			<ul className='list-unstyled d-flex gap-2 flex-wrap flex-sm-nowrap m-0'>
				{sortFields.map(field => {
					const isActive = activeId === field.id;
					return (
						<li key={field.id} className={clsx(isActive && 'active')}>
							{isActive && !field.order
								? <>{field.title}</>
								: <a href='#' rel='nofollow' onClick={(e) => onSortClick(e, field.id)}>
									{field.title}
									{field.order && <img
										className='ms-1'
										height={14}
										src={order === TSortOrder.asc ? SortDown.src : SortUp.src}
										width={14}
									/>}
								</a>}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

const getActiveSortField = (sort: string) => {
	const sortQuery = (sort || '').split(',')[0]; //gets only the first sort field from query
	const isDesc = sortQuery.startsWith('-');

	const order = isDesc ? TSortOrder.desc : TSortOrder.asc;
	const sortAlias = isDesc ? sortQuery.replace('-', '') : sortQuery;
	const activeId = (sortFields.find(el => el.alias === sortAlias) || sortFields.find(el => el.alias === 'default'))!.id;

	return {
		id: activeId,
		order,
	};
};

const getOppositeOrder = (order: TSortOrder) => {
	return order === TSortOrder.asc ? TSortOrder.desc : TSortOrder.asc;
};