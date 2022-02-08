import React from 'react';

type CrossProps = {
	width?: number;
	height?: number;
	fill?: string;
	onClick?: () => void;
	className?: string;
};

export const Cross: React.FC<CrossProps> = React.forwardRef(
	(
		{width = 16, height = 16, fill = '#4F4F4F', onClick, className},
		ref: React.Ref<HTMLDivElement>
	) => (
		<div
			ref={ref}
			onClick={onClick}
			className={className}
			style={{cursor: 'pointer'}}
		>
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					style={{fill}}
					fillRule='evenodd'
					clipRule='evenodd'
					d='M8.00008 9.41429L3.70718 13.7072L2.29297 12.293L6.58586 8.00008L2.29297 3.70718L3.70718 2.29297L8.00008 6.58586L12.293 2.29297L13.7072 3.70718L9.41429 8.00008L13.7072 12.293L12.293 13.7072L8.00008 9.41429Z'
					fill='#4F4F4F'
				/>
			</svg>
		</div>
	)
);
