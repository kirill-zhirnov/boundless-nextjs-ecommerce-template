import React from 'react';

type UnstyledChevronProps = {
	width?: number;
	height?: number;
	fill?: string;
	collapsed?: boolean;
	onClick?: () => void;
	className?: string;
};

export const UnstyledChevron: React.FC<UnstyledChevronProps> = React.forwardRef(
	(
		{
			width = 24,
			height = 24,
			fill = '#666666',
			// collapsed,
			onClick,
			className,
		},
		ref: React.Ref<HTMLDivElement>
	) => (
		<div
			style={{
				width,
				height,
				transform: 'rotate(-90deg)',
			}}
			ref={ref}
			onClick={onClick}
			// collapsed={collapsed}
			className={className}
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
					d='M17.9999 9.64423L16.5857 8.23002L11.636 13.1798L6.68624 8.23002L5.27203 9.64423L10.2218 14.594L11.636 16.0082L13.0502 14.594L17.9999 9.64423Z'
					fill='#666666'
				/>
			</svg>
		</div>
	)
);
