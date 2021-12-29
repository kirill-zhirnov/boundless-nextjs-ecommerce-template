export default function Loader({color = '#ccc'}: {color?: string}) {
	return (
		<div className='d-flex justify-content-center align-items-center flex-grow-1'>
			<div className='css-loader'>
				<div style={{backgroundColor: color}}/>
				<div style={{backgroundColor: color}}/>
				<div style={{backgroundColor: color}}/>
			</div>
		</div>
	);
}