import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent, useEffect, useState} from 'react';
import {IProductManufacturer} from 'boundless-api-client';
import {TQuery} from '../../@types/common';
import Collapse from 'react-bootstrap/Collapse';

const DEFAULT_DISPLAY_LIMIT = 6;

export default function BrandSelect({field, onChange, values, displayLimit}: IFilterFieldProps) {
	const {brand} = values;
	const limit = displayLimit || DEFAULT_DISPLAY_LIMIT;
	const [showMore, setShowMore] = useState(false);

	const [visibleBrands, setVisibleBrands] = useState<TManufacturer[]>([]);
	const [collapsedBrands, setCollapsedBrands] = useState<TManufacturer[]>([]);

	useEffect(() => {
		const manufacturers = field.manufacturers;
		if (!manufacturers) return;
		const inStockBrands = manufacturers.filter(el => el.products_qty > 0);
		const outOfStockBrands = manufacturers.filter(el => !el.products_qty);
		const result = [...inStockBrands, ...outOfStockBrands];
		setVisibleBrands(result.slice(0, limit));
		setCollapsedBrands(result.slice(limit));
	}, [field.manufacturers, limit]);


	const onInput = (manufacturerId: number, e: ChangeEvent<HTMLInputElement>) => {
		const value = brand.filter((el: number) => el !== manufacturerId);

		if (e.target.checked) {
			value.push(manufacturerId);
		}

		onChange('brand', value);
	};

	return (
		<div className={'mb-3'}>
			<label className='form-label'>Brand</label>
			<BrandCases
				manufacturers={visibleBrands}
				onInput={onInput}
				values={values}
			/>
			{collapsedBrands.length > 0 && <>
				<Collapse in={showMore}>
					<div> {/* Intentinal for smooth Collapse animation */}
						<div className='mt-1'>
							<BrandCases
								manufacturers={collapsedBrands}
								onInput={onInput}
								values={values}
							/>
						</div>
					</div>
				</Collapse>
				<a
					className='btn btn-link btn-sm'
					onClick={() => setShowMore(prev => !prev)}
				>
					{showMore ? 'Show less' : 'Show more'}
				</a>
			</>}
		</div>
	);
}

const BrandCases = ({manufacturers, onInput, values}: IBrandsProps) => {
	return (
		<div className='d-flex gap-1 flex-wrap'>
			{manufacturers.map(({manufacturer_id, title, products_qty}) =>
				<div key={manufacturer_id}>
					<label className='btn btn-outline-secondary btn-sm'>
						<input className='btn-check'
							type='checkbox'
							value={manufacturer_id}
							name={'brand[]'}
							onChange={onInput.bind(null, manufacturer_id)}
							checked={values.brand.includes(manufacturer_id)}
							disabled={products_qty === 0}
						/>
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
}

type TManufacturer = IProductManufacturer & {products_qty: number}