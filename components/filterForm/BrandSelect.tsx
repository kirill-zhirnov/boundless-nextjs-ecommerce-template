import {IFilterFieldProps} from '../FilterForm';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {IProductManufacturer} from 'boundless-api-client';
import {TQuery} from '../../@types/common';
import Collapse from 'react-bootstrap/Collapse';


export default function BrandSelect({field, onChange, values, displayLimit, idsPrefix}: IFilterFieldProps) {
	const {brand} = values;
	const [showMore, setShowMore] = useState(false);

	const [visibleBrands, setVisibleBrands] = useState<TManufacturer[]>([]);
	const [collapsedBrands, setCollapsedBrands] = useState<TManufacturer[]>([]);

	useEffect(() => {
		const manufacturers = field.manufacturers;
		if (!manufacturers) return;
		const inStockBrands = manufacturers.filter(el => el.products_qty > 0);
		const outOfStockBrands = manufacturers.filter(el => !el.products_qty);
		const result = [...inStockBrands, ...outOfStockBrands];
		setVisibleBrands(result.slice(0, displayLimit));
		setCollapsedBrands(result.slice(displayLimit));
	}, [field.manufacturers, displayLimit]);


	const onInput = (manufacturerId: number, e: ChangeEvent<HTMLInputElement>) => {
		const value = brand.filter((el: number) => el !== manufacturerId);

		if (e.target.checked) {
			value.push(manufacturerId);
		}

		onChange({brand: value});
	};

	const handleShowMore = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setShowMore(prev => !prev);
	};

	return (
		<div className={'mb-3'}>
			<label className='form-label'>Brand</label>
			<BrandCases
				manufacturers={visibleBrands}
				onInput={onInput}
				values={values}
				idsPrefix={idsPrefix}
			/>
			{collapsedBrands.length > 0 && <>
				<Collapse in={showMore}>
					<div> {/* Intentinal for smooth Collapse animation */}
						<div className='mt-1'>
							<BrandCases
								manufacturers={collapsedBrands}
								onInput={onInput}
								values={values}
								idsPrefix={idsPrefix}
							/>
						</div>
					</div>
				</Collapse>
				<div className='mt-1'>
					<a
						className='small'
						href='#'
						onClick={handleShowMore}
					>
						<>{showMore ? 'Show less' : 'Show all'}</>
					</a>
				</div>
			</>}
		</div>
	);
}

const BrandCases = ({manufacturers, onInput, values, idsPrefix}: IBrandsProps) => {
	return (
		<div className='d-flex gap-1 flex-wrap'>
			{manufacturers.map(({manufacturer_id, title, products_qty}) =>
				<div key={manufacturer_id}>
					<input className='btn-check'
						id={`${idsPrefix}brand_${manufacturer_id}`}
						type='checkbox'
						value={manufacturer_id}
						name={'brand[]'}
						onChange={onInput.bind(null, manufacturer_id)}
						checked={values.brand.includes(manufacturer_id)}
						disabled={products_qty === 0}
					/>
					<label className='btn btn-outline-secondary btn-sm' htmlFor={`${idsPrefix}brand_${manufacturer_id}`}>
						{title} ({products_qty})
					</label>
				</div>
			)}
		</div>
	);
};

interface IBrandsProps {
	manufacturers: TManufacturer[];
	values: TQuery;
	onInput: (manufacturerId: number, e: ChangeEvent<HTMLInputElement>) => void;
	idsPrefix: string;
}

type TManufacturer = IProductManufacturer & {products_qty: number}