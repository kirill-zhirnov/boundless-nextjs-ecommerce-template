import CoverTextInCenter from '../../components/CoverTextInCenter';

export default function CoverPage() {
	return (
		<>
			<CoverTextInCenter
				img='images/b4d299e7646154e5eb5e60e3e6f7bcc7.jpeg'
				imgPortrait='images/902eda461019f0621cc5bca0ba01d388.jpg'
				content={{
					intro: 'Ну интро',
					head: 'Типа хед',
					subHead: 'типа под'
				}}
				shadow={{
					opacity: 0.5,
					backgroundColor: '#000'
				}}
				link={'http://google.com'}
			/>
			<div className='text-center' style={{minHeight: 200}}>Some other text here</div>
		</>
	);
}