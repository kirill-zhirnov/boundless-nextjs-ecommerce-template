import {IPagination} from 'boundless-api-client/types/common';
import {createGetStr} from 'boundless-api-client/utils.js';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

export default function Pagination({pagination, navUrl, onChange}: IPaginationProps) {
	const {currentPage, pageCount} = pagination;
	console.log('in pagination:', navUrl);
	const getFullNavUrl = (page: number) => {
		const {baseUrl, params} = navUrl;
		return `${baseUrl}?${createGetStr(Object.assign(params, {page}))}`;
	};

	const prevPageNum = currentPage - 1 < 1 ? 1 : currentPage - 1;
	const nextPageNum = currentPage + 1 > pageCount ? pageCount : currentPage + 1;

	//@ts-ignore
	const onClick = (page, e) => {
		e.preventDefault();
		onChange({page});
	};

	return (
		<nav className={clsx('d-flex justify-content-center', pageCount < 2 && 'd-none')}>
			<ul className='pagination'>
				<li className={clsx('page-item', currentPage <= 1 && 'disabled')}>
					<Link href={getFullNavUrl(prevPageNum)} shallow>
						<a className='page-link' aria-label='Previous'>
							<span aria-hidden='true'>&laquo;</span>
						</a>
					</Link>
				</li>
				{[...Array(pageCount)].map((_, index) => (
					<li className={clsx('page-item', index + 1 === currentPage && 'active')} key={index}>
						{/*<Link href={getFullNavUrl(index + 1)} shallow>*/}
						<a className='page-link'
							 onClick={onClick.bind(null, index + 1)}
							 href={getFullNavUrl(index + 1)}
						>{index + 1}</a>
						{/*</Link>*/}
					</li>
				))}
				<li className={clsx('page-item', currentPage >= pageCount && 'disabled')}>
					<Link href={getFullNavUrl(nextPageNum)} shallow>
						<a className='page-link' aria-label='Next'>
							<span aria-hidden='true'>&raquo;</span>
						</a>
					</Link>
				</li>
			</ul>
		</nav>
	);
}

interface IPaginationProps {
	pagination: IPagination;
	navUrl: {
		baseUrl: string;
		params: {[key: string]: any};
	},
	onChange: (params: {page: number}) => void;
}