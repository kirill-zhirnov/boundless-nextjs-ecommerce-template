import Link from 'next/link';
import CallToOrder from './Header/CallToOrder';
import HeaderCart from './Header/Cart';
import ChooseVariantModal from './Header/ChooseVariantModal';

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
				<div className='position-relative'>
					<CallToOrder />
				</div>
			</div>
			<ChooseVariantModal />
		</header>
	);
}
