import {IPagination} from 'boundless-api-client/types/common';
import clsx from 'clsx';
import React from 'react';

export default function Pagination({pagination, setPage}: IPaginationProps) {
	const {currentPage, pageCount} = pagination;


	const prevClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setPage(currentPage - 1);
	};

	const nextClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setPage(currentPage + 1);
	};

	const pageClick = (e: React.MouseEvent, page: number) => {
		e.preventDefault();
		setPage(page);
	};

	return (

		<nav className={clsx('d-flex justify-content-center', pageCount < 2 && 'd-none')}>
			<ul className='pagination'>
				<li className={clsx('page-item', currentPage <= 1 && 'disabled')}>
					<a className='page-link' href='#' aria-label='Previous' onClick={prevClick}>
						<span aria-hidden='true'>&laquo;</span>
					</a>
				</li>
				{[...Array(pageCount)].map((_, index) => (
					<li className={clsx('page-item', index + 1 === currentPage && 'active')} key={index}>
						<a className='page-link' href='#' onClick={(e) => pageClick(e, index + 1)}>{index + 1}</a>
					</li>
				))}
				<li className={clsx('page-item', currentPage >= pageCount && 'disabled')}>
					<a className='page-link' href='#' aria-label='Next' onClick={nextClick}>
						<span aria-hidden='true'>&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
	);
}

interface IPaginationProps {
	pagination: IPagination;
	setPage: (page: number) => void;
}