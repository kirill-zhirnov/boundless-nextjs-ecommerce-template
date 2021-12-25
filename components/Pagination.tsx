import {IPagination} from 'boundless-api-client/types/common';
import {createGetStr} from 'boundless-api-client/utils.js';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import React from 'react';

export default function Pagination({pagination, params, onChange}: IPaginationProps) {
	const router = useRouter();
	const {currentPage, pageCount} = pagination;
	const baseUrl = router.asPath.split('?')[0];

	const getFullNavUrl = (page: number) => {
		return `${baseUrl}?${createGetStr(Object.assign({...params}, {page}))}`;
	};

	const prevPageNum = currentPage - 1 < 1 ? 1 : currentPage - 1;
	const nextPageNum = currentPage + 1 > pageCount ? pageCount : currentPage + 1;

	//@ts-ignore
	const onClick = (page, e) => {
		e.preventDefault();
		onChange({...params, page});
	};

	return (
		<nav className={clsx('d-flex justify-content-center', pageCount < 2 && 'd-none')}>
			<ul className='pagination'>
				<li className={clsx('page-item', currentPage <= 1 && 'disabled')}>
					<a
						className='page-link'
						aria-label='Previous'
						onClick={onClick.bind(null, prevPageNum)}
						href={getFullNavUrl(prevPageNum)}
					>
						<span aria-hidden='true'>&laquo;</span>
					</a>
				</li>
				{[...Array(pageCount)].map((_, index) => (
					<li className={clsx('page-item', index + 1 === currentPage && 'active')} key={index}>
						<a className='page-link'
							onClick={onClick.bind(null, index + 1)}
							href={getFullNavUrl(index + 1)}
						>{index + 1}</a>
					</li>
				))}
				<li className={clsx('page-item', currentPage >= pageCount && 'disabled')}>
					<a
						className='page-link'
						aria-label='Previous'
						onClick={onClick.bind(null, nextPageNum)}
						href={getFullNavUrl(nextPageNum)}
					>
						<span aria-hidden='true'>&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
	);
}

interface IPaginationProps {
	pagination: IPagination;
	params: {[key: string]: any};
	onChange: (params: {page: number}) => void;
}