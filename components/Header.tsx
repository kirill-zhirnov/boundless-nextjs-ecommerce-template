import Link from 'next/link';
import HeaderCart from './Header/Cart';

export default function Header() {
	return (
		<header className='page__header' >
			<div className='container text-center'>
				<div className='d-flex justify-content-between py-2'>
					<div className='page__header-logo'>
						<Link href='/'>
							<a >
								<img src={'/logo.svg'} />
							</a>
						</Link>
					</div>
					<HeaderCart />
				</div>
			</div>
		</header>
	);
}
