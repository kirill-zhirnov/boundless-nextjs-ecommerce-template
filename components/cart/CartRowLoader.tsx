import ContentLoader from 'react-content-loader';

export default function CartRowLoader({bg}: {bg: string}) {
	return (
		<div className='row mb-2 mx-1 py-3 rounded' style={{backgroundColor: bg || '#fff'}}>
			<div className='col-md-4 d-flex mb-2 align-items-start '>
				<ContentLoader
					speed={2}
					width={230}
					height={60}
					viewBox='0 0 240 70'
					backgroundColor={bg ? '#d3d3d3':'#f3f3f3'}
					foregroundColor={bg ? '#ababab':'#ecebeb'}
				>
					<rect x='75' y='15' rx='3' ry='3' width='158' height='12' />
					<rect x='75' y='35' rx='3' ry='3' width='100' height='12' />
					<rect x='0' y='10' rx='3' ry='3' width='60' height='60' />
				</ContentLoader>
			</div>
			<div className='col-md-2 text-start text-md-center mb-2 py-1 px-4 px-md-0'>
				<SmallLoader bg={bg}/>
			</div>
			<div className='col-md-2 text-start text-md-center mb-2 py-1 px-4 px-md-0'>
				<SmallLoader bg={bg}/>
			</div>
			<div className='col-md-2 text-start text-md-center mb-2 py-1 px-4 px-md-0'>
				<SmallLoader bg={bg}/>
			</div>
		</div>
	);
}

const SmallLoader = ({bg}: {bg: string}) => (
	<ContentLoader
		speed={2}
		width={60}
		height={20}
		viewBox='0 0 60 20'
		backgroundColor={bg ? '#d3d3d3':'#f3f3f3'}
		foregroundColor={bg ? '#ababab':'#ecebeb'}
	>
		<rect x='0' y='10' rx='3' ry='3' width='60' height='10' />
	</ContentLoader>
);