import {IFilterFieldRange} from "boundless-api-client";
import {IFilterFieldProps} from "../FilterForm";
import {ChangeEvent} from "react";

export default function PriceRangeField({field, onChange, values}: IFilterFieldProps) {
	const onInput = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.name, e.target.value);

	return (
		<div className={'row'}>
			<div className={'col mb-3'}>
				<label htmlFor="filter_price_min" className="form-label">From</label>
				<input type="number"
							 className="form-control"
							 id="filter_price_min"
							 min={field.range?.min || 0}
							 placeholder={String(field.range?.min || 0)}
							 name={'price_min'}
							 step={0.01}
							 onChange={onInput}
							 value={values.price_min}
				/>
			</div>
			<div className={'col'}>

			</div>
		</div>
	);
}